import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formDataRequest } from '../helpers/request';

vi.mock('@/lib/db/queries', () => ({
  createJobApplication: vi.fn(),
}));
vi.mock('@/lib/email/templates', () => ({
  sendJobApplicationConfirmation: vi.fn().mockResolvedValue(undefined),
  sendAdminJobApplicationNotification: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true, remaining: 4, reset: 0 }),
}));

// Mock Azure Blob Storage — the main external boundary for this route
vi.mock('@azure/storage-blob', () => {
  const blockBlobClient = {
    upload: vi.fn().mockResolvedValue({}),
    url: 'https://storage.blob.core.windows.net/resumes/mock-uuid-resume.pdf',
  };
  const containerClient = {
    createIfNotExists: vi.fn().mockResolvedValue({}),
    getBlockBlobClient: vi.fn().mockReturnValue(blockBlobClient),
  };
  return {
    BlobServiceClient: {
      fromConnectionString: vi.fn().mockReturnValue({
        getContainerClient: vi.fn().mockReturnValue(containerClient),
      }),
    },
  };
});

import { POST } from '@/app/api/jobs/apply/route';
import { createJobApplication } from '@/lib/db/queries';
import { checkRateLimit } from '@/lib/rate-limit';
import { BlobServiceClient } from '@azure/storage-blob';

const mockCreate = createJobApplication as ReturnType<typeof vi.fn>;
const mockRateLimit = checkRateLimit as ReturnType<typeof vi.fn>;
const URL = 'http://localhost:3000/api/jobs/apply';

function makePdfFile(name = 'resume.pdf', sizeKb = 50): File {
  const content = new Uint8Array(sizeKb * 1024).fill(0x25); // '%' byte (PDF-like)
  return new File([content], name, { type: 'application/pdf' });
}

const mockJobApp = {
  id: 'job-uuid-1',
  applicant_name: 'Layla Nour',
  applicant_email: 'layla@example.com',
  applicant_phone: null,
  position_title: 'Arabic Teacher',
  resume_blob_url: 'https://storage.blob.core.windows.net/resumes/mock-uuid-resume.pdf',
  cover_letter: null,
  submitted_at: new Date(),
  status: 'pending',
};

beforeEach(() => {
  vi.clearAllMocks();
  mockCreate.mockResolvedValue(mockJobApp);
  mockRateLimit.mockResolvedValue({ success: true, remaining: 4, reset: 0 });
});

describe('POST /api/jobs/apply', () => {
  it('returns 201 with application id for a valid submission', async () => {
    const req = formDataRequest(URL, {
      name: 'Layla Nour',
      email: 'layla@example.com',
      position: 'Arabic Teacher',
      resume: makePdfFile(),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.id).toBe('job-uuid-1');
  });

  it('uploads resume to Azure Blob and saves the resulting URL to DB', async () => {
    const req = formDataRequest(URL, {
      name: 'Layla Nour',
      email: 'layla@example.com',
      position: 'Arabic Teacher',
      resume: makePdfFile(),
    });

    await POST(req);

    const blobClient = BlobServiceClient.fromConnectionString('');
    const container = blobClient.getContainerClient('resumes');
    expect(container.createIfNotExists).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        resumeBlobUrl: 'https://storage.blob.core.windows.net/resumes/mock-uuid-resume.pdf',
      })
    );
  });

  it('returns 422 when resume file is missing', async () => {
    const req = formDataRequest(URL, {
      name: 'Layla Nour',
      email: 'layla@example.com',
      position: 'Arabic Teacher',
      // no resume field
    });

    const res = await POST(req);
    expect(res.status).toBe(422);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('returns 422 when resume exceeds 5MB', async () => {
    const bigFile = new File([new Uint8Array(6 * 1024 * 1024)], 'big.pdf', { type: 'application/pdf' });
    const req = formDataRequest(URL, {
      name: 'Layla Nour',
      email: 'layla@example.com',
      position: 'Arabic Teacher',
      resume: bigFile,
    });

    const res = await POST(req);
    expect(res.status).toBe(422);
  });

  it('returns 422 when resume has a disallowed file type', async () => {
    const badFile = new File(['<html></html>'], 'resume.html', { type: 'text/html' });
    const req = formDataRequest(URL, {
      name: 'Layla Nour',
      email: 'layla@example.com',
      position: 'Arabic Teacher',
      resume: badFile,
    });

    const res = await POST(req);
    expect(res.status).toBe(422);
  });

  it('returns 422 when applicant name is too short', async () => {
    const req = formDataRequest(URL, {
      name: 'L',
      email: 'layla@example.com',
      position: 'Arabic Teacher',
      resume: makePdfFile(),
    });

    const res = await POST(req);
    expect(res.status).toBe(422);
  });

  it('returns 422 when email is invalid', async () => {
    const req = formDataRequest(URL, {
      name: 'Layla Nour',
      email: 'not-an-email',
      position: 'Arabic Teacher',
      resume: makePdfFile(),
    });

    const res = await POST(req);
    expect(res.status).toBe(422);
  });

  it('returns 429 when rate limited', async () => {
    mockRateLimit.mockResolvedValue({ success: false, remaining: 0, reset: 0 });

    const req = formDataRequest(URL, {
      name: 'Layla Nour',
      email: 'layla@example.com',
      position: 'Arabic Teacher',
      resume: makePdfFile(),
    });

    const res = await POST(req);
    expect(res.status).toBe(429);
  });

  it('returns 500 when Azure Blob upload fails', async () => {
    const blobClient = BlobServiceClient.fromConnectionString('');
    const container = blobClient.getContainerClient('resumes');
    const blockBlob = container.getBlockBlobClient('');
    (blockBlob.upload as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('storage error'));

    const req = formDataRequest(URL, {
      name: 'Layla Nour',
      email: 'layla@example.com',
      position: 'Arabic Teacher',
      resume: makePdfFile(),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it('returns 500 when DB throws after successful upload', async () => {
    mockCreate.mockRejectedValue(new Error('db error'));

    const req = formDataRequest(URL, {
      name: 'Layla Nour',
      email: 'layla@example.com',
      position: 'Arabic Teacher',
      resume: makePdfFile(),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it('accepts .docx files in addition to PDF', async () => {
    const docxFile = new File(
      [new Uint8Array(10)],
      'resume.docx',
      { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
    );

    const req = formDataRequest(URL, {
      name: 'Layla Nour',
      email: 'layla@example.com',
      position: 'Arabic Teacher',
      resume: docxFile,
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
  });
});
