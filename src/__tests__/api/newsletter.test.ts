import { describe, it, expect, vi, beforeEach } from 'vitest';
import { jsonRequest } from '../helpers/request';

vi.mock('@/lib/db/queries', () => ({
  upsertNewsletterSubscriber: vi.fn(),
}));
vi.mock('@/lib/email/templates', () => ({
  sendNewsletterConfirmation: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true, remaining: 4, reset: 0 }),
}));

import { POST } from '@/app/api/newsletter/subscribe/route';
import { upsertNewsletterSubscriber } from '@/lib/db/queries';
import { checkRateLimit } from '@/lib/rate-limit';

const mockUpsert = upsertNewsletterSubscriber as ReturnType<typeof vi.fn>;
const mockRateLimit = checkRateLimit as ReturnType<typeof vi.fn>;
const URL = 'http://localhost:3000/api/newsletter/subscribe';

beforeEach(() => {
  vi.clearAllMocks();
  mockRateLimit.mockResolvedValue({ success: true, remaining: 4, reset: 0 });
});

describe('POST /api/newsletter/subscribe', () => {
  it('returns 201 and subscribed message for a new email', async () => {
    mockUpsert.mockResolvedValue({ isNew: true });

    const res = await POST(jsonRequest(URL, { email: 'new@example.com' }));
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.message).toMatch(/subscribed/i);
    expect(mockUpsert).toHaveBeenCalledWith('new@example.com');
  });

  it('returns 200 and already-subscribed message for an existing email', async () => {
    mockUpsert.mockResolvedValue({ isNew: false });

    const res = await POST(jsonRequest(URL, { email: 'existing@example.com' }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toMatch(/already subscribed/i);
  });

  it('returns 422 for an invalid email address', async () => {
    const res = await POST(jsonRequest(URL, { email: 'not-valid' }));
    expect(res.status).toBe(422);
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it('returns 422 for missing email field', async () => {
    const res = await POST(jsonRequest(URL, {}));
    expect(res.status).toBe(422);
  });

  it('returns 429 when rate limit is exceeded', async () => {
    mockRateLimit.mockResolvedValue({ success: false, remaining: 0, reset: 0 });

    const res = await POST(jsonRequest(URL, { email: 'user@example.com' }));
    expect(res.status).toBe(429);
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it('returns 500 when DB throws', async () => {
    mockUpsert.mockRejectedValue(new Error('db error'));

    const res = await POST(jsonRequest(URL, { email: 'user@example.com' }));
    expect(res.status).toBe(500);
  });

  it('only sends confirmation email for new subscribers, not returning ones', async () => {
    const { sendNewsletterConfirmation } = await import('@/lib/email/templates');
    mockUpsert.mockResolvedValue({ isNew: false });

    await POST(jsonRequest(URL, { email: 'existing@example.com' }));

    // Fire-and-forget only for new subscribers
    expect(sendNewsletterConfirmation).not.toHaveBeenCalled();
  });
});
