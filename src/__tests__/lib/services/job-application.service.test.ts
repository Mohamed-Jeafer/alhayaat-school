import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServiceError } from '@/lib/services/service-error';

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true, remaining: 4, reset: 0 }),
}));
vi.mock('@/lib/db/queries', () => ({
  createJobApplication: vi.fn(),
}));
vi.mock('@/lib/email/templates', () => ({
  sendJobApplicationConfirmation: vi.fn().mockResolvedValue(undefined),
  sendAdminJobApplicationNotification: vi.fn().mockResolvedValue(undefined),
}));

// Realistic Azure Blob Storage mock — matches the SDK's object hierarchy
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

import { submitJobApplication } from '@/lib/services/job-application.service';
import { checkRateLimit } from '@/lib/rate-limit';
import { createJobApplication } from '@/lib/db/queries';
import {
  sendJobApplicationConfirmation,
  sendAdminJobApplicationNotification,
} from '@/lib/email/templates';
import { BlobServiceClient } from '@azure/storage-blob';

const mockRateLimit = checkRateLimit as ReturnType<typeof vi.fn>;
const mockCreate = createJobApplication as ReturnType<typeof vi.fn>;
const mockEmailConfirm = sendJobApplicationConfirmation as ReturnType<typeof vi.fn>;
const mockEmailAdmin = sendAdminJobApplicationNotification as ReturnType<typeof vi.fn>;

function getBlobChain() {
  const blobSvc = BlobServiceClient.fromConnectionString('');
  const container = blobSvc.getContainerClient('resumes');
  const blockBlob = container.getBlockBlobClient('');
  return { blobSvc, container, blockBlob };
}

function makePdfFile(sizeKb = 50, name = 'resume.pdf'): File {
  const content = new Uint8Array(sizeKb * 1024).fill(0x25); // PDF-like '%' bytes
  return new File([content], name, { type: 'application/pdf' });
}

const mockJobApp = {
  id: 'job-uuid-1',
  applicant_name: 'Layla Nour',
  applicant_email: 'layla@example.com',
  applicant_phone: '+16135550200',
  position_title: 'Arabic Teacher',
  resume_blob_url: 'https://storage.blob.core.windows.net/resumes/mock-uuid-resume.pdf',
  cover_letter: 'I am passionate about Islamic education.',
  submitted_at: new Date('2026-04-12T00:00:00Z'),
  status: 'pending',
};

const validInput = {
  name: 'Layla Nour',
  email: 'layla@example.com',
  phone: '+16135550200',
  position: 'Arabic Teacher',
  coverLetter: 'I am passionate about Islamic education.',
  resume: makePdfFile(),
};

beforeEach(() => {
  vi.clearAllMocks();
  mockRateLimit.mockResolvedValue({ success: true, remaining: 4, reset: 0 });
  mockCreate.mockResolvedValue(mockJobApp);
  process.env.AZURE_STORAGE_CONNECTION_STRING =
    'DefaultEndpointsProtocol=https;AccountName=test;AccountKey=dGVzdA==;EndpointSuffix=core.windows.net';
});

describe('submitJobApplication', () => {
  it('returns the created job application on success', async () => {
    const result = await submitJobApplication(validInput, '1.2.3.4');

    expect(result).toMatchObject({ id: 'job-uuid-1', status: 'pending' });
  });

  it('uploads resume to Azure Blob and saves the URL to DB', async () => {
    await submitJobApplication(validInput, '1.2.3.4');

    const { blockBlob } = getBlobChain();
    expect(blockBlob.upload).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        resumeBlobUrl: 'https://storage.blob.core.windows.net/resumes/mock-uuid-resume.pdf',
      })
    );
  });

  it('creates the resumes container if it does not exist', async () => {
    await submitJobApplication(validInput, '1.2.3.4');

    const { container } = getBlobChain();
    expect(container.createIfNotExists).toHaveBeenCalled();
  });

  it('passes all text fields to createJobApplication', async () => {
    await submitJobApplication(validInput, '1.2.3.4');

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        applicantName: 'Layla Nour',
        applicantEmail: 'layla@example.com',
        applicantPhone: '+16135550200',
        positionTitle: 'Arabic Teacher',
        coverLetter: 'I am passionate about Islamic education.',
      })
    );
  });

  it('calls checkRateLimit with the prefixed job-apply IP key', async () => {
    await submitJobApplication(validInput, '10.0.0.5');

    expect(mockRateLimit).toHaveBeenCalledWith('job-apply:10.0.0.5');
  });

  it('fires both confirmation and admin emails after successful DB write', async () => {
    await submitJobApplication(validInput, '1.2.3.4');

    expect(mockEmailConfirm).toHaveBeenCalledWith(
      'Layla Nour',
      'layla@example.com',
      'Arabic Teacher'
    );
    expect(mockEmailAdmin).toHaveBeenCalledWith(
      'Layla Nour',
      'layla@example.com',
      'Arabic Teacher'
    );
  });

  it('still resolves when emails reject (fire-and-forget)', async () => {
    mockEmailConfirm.mockRejectedValue(new Error('SMTP down'));
    mockEmailAdmin.mockRejectedValue(new Error('SMTP down'));

    await expect(submitJobApplication(validInput, '1.2.3.4')).resolves.toBeDefined();
  });

  it('accepts .docx MIME type', async () => {
    const docx = new File(
      [new Uint8Array(10)],
      'resume.docx',
      { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
    );

    await expect(
      submitJobApplication({ ...validInput, resume: docx }, '1.2.3.4')
    ).resolves.toBeDefined();
  });

  it('accepts .doc MIME type', async () => {
    const doc = new File(
      [new Uint8Array(10)],
      'resume.doc',
      { type: 'application/msword' }
    );

    await expect(
      submitJobApplication({ ...validInput, resume: doc }, '1.2.3.4')
    ).resolves.toBeDefined();
  });

  it('accepts files whose MIME type is wrong but extension is .pdf (extension fallback)', async () => {
    const weirdPdf = new File([new Uint8Array(10)], 'resume.pdf', { type: 'application/octet-stream' });

    await expect(
      submitJobApplication({ ...validInput, resume: weirdPdf }, '1.2.3.4')
    ).resolves.toBeDefined();
  });

  // ── Validation failures ────────────────────────────────────────────────────

  it('throws ServiceError(422) when resume file is empty (size === 0)', async () => {
    const emptyFile = new File([], 'resume.pdf', { type: 'application/pdf' });

    await expect(
      submitJobApplication({ ...validInput, resume: emptyFile }, '1.2.3.4')
    ).rejects.toMatchObject({ statusCode: 422 });
    expect(mockRateLimit).not.toHaveBeenCalled();
  });

  it('throws ServiceError(422) when resume exceeds 5MB', async () => {
    const bigFile = new File([new Uint8Array(6 * 1024 * 1024)], 'big.pdf', {
      type: 'application/pdf',
    });

    await expect(
      submitJobApplication({ ...validInput, resume: bigFile }, '1.2.3.4')
    ).rejects.toMatchObject({ statusCode: 422 });
  });

  it('throws ServiceError(422) for a disallowed MIME type and bad extension', async () => {
    const htmlFile = new File(['<html/>', ''], 'resume.html', { type: 'text/html' });

    await expect(
      submitJobApplication({ ...validInput, resume: htmlFile }, '1.2.3.4')
    ).rejects.toMatchObject({ statusCode: 422 });
  });

  // ── Rate limit ─────────────────────────────────────────────────────────────

  it('throws ServiceError(429) when rate limited', async () => {
    mockRateLimit.mockResolvedValue({ success: false, remaining: 0, reset: 0 });

    await expect(submitJobApplication(validInput, '1.2.3.4')).rejects.toMatchObject({
      statusCode: 429,
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  // ── Infrastructure failures ────────────────────────────────────────────────

  it('throws ServiceError(500) when AZURE_STORAGE_CONNECTION_STRING is missing', async () => {
    delete process.env.AZURE_STORAGE_CONNECTION_STRING;

    await expect(submitJobApplication(validInput, '1.2.3.4')).rejects.toMatchObject({
      statusCode: 500,
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('throws ServiceError(500) when Azure Blob upload fails', async () => {
    const { blockBlob } = getBlobChain();
    (blockBlob.upload as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('Storage account unreachable')
    );

    await expect(submitJobApplication(validInput, '1.2.3.4')).rejects.toMatchObject({
      statusCode: 500,
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('throws ServiceError(500) when DB throws after successful upload', async () => {
    mockCreate.mockRejectedValue(new Error('constraint violation'));

    await expect(submitJobApplication(validInput, '1.2.3.4')).rejects.toMatchObject({
      statusCode: 500,
    });
  });

  it('throws ServiceError(500) when DB returns null', async () => {
    mockCreate.mockResolvedValue(null);

    await expect(submitJobApplication(validInput, '1.2.3.4')).rejects.toMatchObject({
      statusCode: 500,
    });
  });

  it('all thrown errors are ServiceError instances', async () => {
    mockCreate.mockRejectedValue(new Error('db down'));

    const err = await submitJobApplication(validInput, '1.2.3.4').catch((e) => e);
    expect(err).toBeInstanceOf(ServiceError);
  });
});
