import { describe, it, expect, vi, beforeEach } from 'vitest';
import { jsonRequest } from '../helpers/request';

// ── Mock system boundaries ────────────────────────────────────────────────────
vi.mock('@/lib/db/queries', () => ({
  createContactSubmission: vi.fn(),
}));
vi.mock('@/lib/email/templates', () => ({
  sendContactConfirmation: vi.fn().mockResolvedValue(undefined),
  sendAdminContactNotification: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true, remaining: 4, reset: 0 }),
}));

import { POST } from '@/app/api/contact/route';
import { createContactSubmission } from '@/lib/db/queries';
import { checkRateLimit } from '@/lib/rate-limit';

const mockCreate = createContactSubmission as ReturnType<typeof vi.fn>;
const mockRateLimit = checkRateLimit as ReturnType<typeof vi.fn>;

const URL = 'http://localhost:3000/api/contact';

const validBody = {
  name: 'Ahmed Ali',
  email: 'ahmed@example.com',
  subject: 'Question',
  message: 'I have a question about enrollment at your school.',
};

beforeEach(() => {
  vi.clearAllMocks();
  mockCreate.mockResolvedValue(undefined);
  mockRateLimit.mockResolvedValue({ success: true, remaining: 4, reset: 0 });
});

describe('POST /api/contact', () => {
  it('returns 201 and saves submission for valid input', async () => {
    const res = await POST(jsonRequest(URL, validBody));
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(mockCreate).toHaveBeenCalledOnce();
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ahmed Ali', email: 'ahmed@example.com' })
    );
  });

  it('returns 400 for non-JSON body', async () => {
    const req = new (await import('next/server')).NextRequest(URL, {
      method: 'POST',
      body: 'not json{{',
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 422 when name is too short', async () => {
    const res = await POST(jsonRequest(URL, { ...validBody, name: 'A' }));
    expect(res.status).toBe(422);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('returns 422 when email is invalid', async () => {
    const res = await POST(jsonRequest(URL, { ...validBody, email: 'not-an-email' }));
    expect(res.status).toBe(422);
  });

  it('returns 422 when message is too short', async () => {
    const res = await POST(jsonRequest(URL, { ...validBody, message: 'Hi' }));
    expect(res.status).toBe(422);
  });

  it('returns 422 when honeypot field is filled (Zod rejects bot submissions)', async () => {
    // The honeypot field has .max(0) in Zod schema, so any non-empty value
    // triggers a 422 validation error before reaching the route-level check.
    const res = await POST(jsonRequest(URL, { ...validBody, honeypot: 'gotcha' }));

    expect(res.status).toBe(422);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('returns 429 when rate limit is exceeded', async () => {
    mockRateLimit.mockResolvedValue({ success: false, remaining: 0, reset: Date.now() + 3600000 });

    const res = await POST(jsonRequest(URL, validBody));
    expect(res.status).toBe(429);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('returns 500 when DB throws', async () => {
    mockCreate.mockRejectedValue(new Error('connection refused'));

    const res = await POST(jsonRequest(URL, validBody));
    expect(res.status).toBe(500);
  });

  it('still returns 201 even if email sending fails (fire-and-forget)', async () => {
    const { sendContactConfirmation } = await import('@/lib/email/templates');
    (sendContactConfirmation as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('email down'));

    const res = await POST(jsonRequest(URL, validBody));
    expect(res.status).toBe(201); // email failure must not affect response
  });
});
