import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServiceError } from '@/lib/services/service-error';

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true, remaining: 4, reset: 0 }),
}));
vi.mock('@/lib/db/queries', () => ({
  upsertNewsletterSubscriber: vi.fn(),
}));
vi.mock('@/lib/email/templates', () => ({
  sendNewsletterConfirmation: vi.fn().mockResolvedValue(undefined),
}));

import { subscribeToNewsletter } from '@/lib/services/newsletter.service';
import { checkRateLimit } from '@/lib/rate-limit';
import { upsertNewsletterSubscriber } from '@/lib/db/queries';
import { sendNewsletterConfirmation } from '@/lib/email/templates';

const mockRateLimit = checkRateLimit as ReturnType<typeof vi.fn>;
const mockUpsert = upsertNewsletterSubscriber as ReturnType<typeof vi.fn>;
const mockSendEmail = sendNewsletterConfirmation as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  mockRateLimit.mockResolvedValue({ success: true, remaining: 4, reset: 0 });
});

describe('subscribeToNewsletter', () => {
  it('returns { isNew: true, message } for a brand-new subscriber', async () => {
    mockUpsert.mockResolvedValue({ isNew: true });

    const result = await subscribeToNewsletter('new@example.com', '1.2.3.4');

    expect(result.isNew).toBe(true);
    expect(result.message).toMatch(/subscribed successfully/i);
  });

  it('returns { isNew: false, message } for an already-subscribed email', async () => {
    mockUpsert.mockResolvedValue({ isNew: false });

    const result = await subscribeToNewsletter('existing@example.com', '1.2.3.4');

    expect(result.isNew).toBe(false);
    expect(result.message).toMatch(/already subscribed/i);
  });

  it('calls checkRateLimit with the prefixed newsletter IP key', async () => {
    mockUpsert.mockResolvedValue({ isNew: true });

    await subscribeToNewsletter('user@example.com', '5.6.7.8');

    expect(mockRateLimit).toHaveBeenCalledWith('newsletter:5.6.7.8');
  });

  it('calls upsertNewsletterSubscriber with the email', async () => {
    mockUpsert.mockResolvedValue({ isNew: true });

    await subscribeToNewsletter('user@example.com', '1.2.3.4');

    expect(mockUpsert).toHaveBeenCalledWith('user@example.com');
  });

  it('sends a confirmation email for new subscribers', async () => {
    mockUpsert.mockResolvedValue({ isNew: true });

    await subscribeToNewsletter('new@example.com', '1.2.3.4');

    expect(mockSendEmail).toHaveBeenCalledWith('new@example.com');
  });

  it('does NOT send a confirmation email for existing subscribers', async () => {
    mockUpsert.mockResolvedValue({ isNew: false });

    await subscribeToNewsletter('existing@example.com', '1.2.3.4');

    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it('throws ServiceError(429) when rate limited', async () => {
    mockRateLimit.mockResolvedValue({ success: false, remaining: 0, reset: 0 });

    await expect(subscribeToNewsletter('user@example.com', '1.2.3.4')).rejects.toMatchObject({
      statusCode: 429,
    });
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it('throws ServiceError(500) when upsert throws', async () => {
    mockUpsert.mockRejectedValue(new Error('unique constraint violation'));

    await expect(subscribeToNewsletter('user@example.com', '1.2.3.4')).rejects.toMatchObject({
      statusCode: 500,
    });
  });

  it('thrown error is a ServiceError instance', async () => {
    mockUpsert.mockRejectedValue(new Error('db down'));

    const err = await subscribeToNewsletter('user@example.com', '1.2.3.4').catch((e) => e);
    expect(err).toBeInstanceOf(ServiceError);
  });

  it('still resolves when confirmation email rejects (fire-and-forget)', async () => {
    mockUpsert.mockResolvedValue({ isNew: true });
    mockSendEmail.mockRejectedValue(new Error('SMTP down'));

    await expect(subscribeToNewsletter('new@example.com', '1.2.3.4')).resolves.toBeDefined();
  });
});
