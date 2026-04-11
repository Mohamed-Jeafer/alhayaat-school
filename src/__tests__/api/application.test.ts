import { describe, it, expect, vi, beforeEach } from 'vitest';
import { jsonRequest } from '../helpers/request';

vi.mock('@/lib/db/queries', () => ({
  createApplication: vi.fn(),
}));
vi.mock('@/lib/email/templates', () => ({
  sendApplicationConfirmation: vi.fn().mockResolvedValue(undefined),
  sendAdminApplicationNotification: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true, remaining: 4, reset: 0 }),
}));

import { POST } from '@/app/api/application/route';
import { createApplication } from '@/lib/db/queries';
import { checkRateLimit } from '@/lib/rate-limit';

const mockCreate = createApplication as ReturnType<typeof vi.fn>;
const mockRateLimit = checkRateLimit as ReturnType<typeof vi.fn>;
const URL = 'http://localhost:3000/api/application';

const validPayload = {
  student: {
    firstName: 'Yusuf',
    lastName: 'Omar',
    dateOfBirth: '2018-03-15',
    gradeApplyingFor: 'Grade 1',
    previousSchool: 'Home',
  },
  guardian: {
    name: 'Omar Hassan',
    relationship: 'Father',
    phone: '+16135550199',
    email: 'omar@example.com',
    address: '123 Rideau St, Ottawa, ON K1N 5X7',
  },
  academic: {
    currentGrade: 'JK',
    subjects: ['Math', 'Science'],
    languagesSpoken: ['Arabic', 'English'],
  },
  additional: {
    howDidYouHear: 'Friend recommendation',
    agreeToTerms: true,
  },
};

const mockApp = {
  id: 'app-uuid-1',
  student_data: validPayload.student,
  guardian_data: validPayload.guardian,
  academic_data: validPayload.academic,
  additional_data: validPayload.additional,
  submitted_at: new Date(),
  status: 'pending',
};

beforeEach(() => {
  vi.clearAllMocks();
  mockCreate.mockResolvedValue(mockApp);
  mockRateLimit.mockResolvedValue({ success: true, remaining: 4, reset: 0 });
});

describe('POST /api/application', () => {
  it('returns 201 with application id for a valid submission', async () => {
    const res = await POST(jsonRequest(URL, validPayload));
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.id).toBe('app-uuid-1');
    expect(mockCreate).toHaveBeenCalledOnce();
  });

  it('persists the four JSONB sections separately', async () => {
    await POST(jsonRequest(URL, validPayload));

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        studentData: expect.objectContaining({ firstName: 'Yusuf' }),
        guardianData: expect.objectContaining({ email: 'omar@example.com' }),
        academicData: expect.objectContaining({ subjects: ['Math', 'Science'] }),
        additionalData: expect.objectContaining({ agreeToTerms: true }),
      })
    );
  });

  it('returns 400 for unparseable JSON', async () => {
    const { NextRequest } = await import('next/server');
    const req = new NextRequest(URL, {
      method: 'POST',
      body: '{invalid',
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 422 when required student fields are missing', async () => {
    const res = await POST(jsonRequest(URL, {
      ...validPayload,
      student: { firstName: 'Yusuf' }, // missing lastName, dateOfBirth, gradeApplyingFor
    }));
    expect(res.status).toBe(422);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('returns 422 when agreeToTerms is false', async () => {
    const res = await POST(jsonRequest(URL, {
      ...validPayload,
      additional: { ...validPayload.additional, agreeToTerms: false },
    }));
    expect(res.status).toBe(422);
  });

  it('returns 422 when guardian phone is invalid format', async () => {
    const res = await POST(jsonRequest(URL, {
      ...validPayload,
      guardian: { ...validPayload.guardian, phone: '123' }, // too short
    }));
    expect(res.status).toBe(422);
  });

  it('returns 429 when rate limited', async () => {
    mockRateLimit.mockResolvedValue({ success: false, remaining: 0, reset: 0 });

    const res = await POST(jsonRequest(URL, validPayload));
    expect(res.status).toBe(429);
  });

  it('returns 500 when DB returns null', async () => {
    mockCreate.mockResolvedValue(null);

    const res = await POST(jsonRequest(URL, validPayload));
    expect(res.status).toBe(500);
  });

  it('returns 500 when DB throws', async () => {
    mockCreate.mockRejectedValue(new Error('db connection lost'));

    const res = await POST(jsonRequest(URL, validPayload));
    expect(res.status).toBe(500);
  });
});
