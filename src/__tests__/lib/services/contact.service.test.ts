import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServiceError } from '@/lib/services/service-error';

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true, remaining: 4, reset: 0 }),
}));
vi.mock('@/lib/db/queries', () => ({
  createContactSubmission: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/lib/email/templates', () => ({
  sendContactConfirmation: vi.fn().mockResolvedValue(undefined),
  sendAdminContactNotification: vi.fn().mockResolvedValue(undefined),
}));

import { submitContactForm } from '@/lib/services/contact.service';
import { checkRateLimit } from '@/lib/rate-limit';
import { createContactSubmission } from '@/lib/db/queries';
import {
  sendContactConfirmation,
  sendAdminContactNotification,
} from '@/lib/email/templates';

const mockRateLimit = checkRateLimit as ReturnType<typeof vi.fn>;
const mockCreate = createContactSubmission as ReturnType<typeof vi.fn>;
const mockEmailConfirm = sendContactConfirmation as ReturnType<typeof vi.fn>;
const mockEmailAdmin = sendAdminContactNotification as ReturnType<typeof vi.fn>;

const validInput = {
  name: 'Ahmed Ali',
  email: 'ahmed@example.com',
  subject: 'Enrollment question',
  message: 'I would like to learn more about the admissions process.',
};

beforeEach(() => {
  vi.clearAllMocks();
  mockRateLimit.mockResolvedValue({ success: true, remaining: 4, reset: 0 });
  mockCreate.mockResolvedValue(undefined);
});

describe('submitContactForm', () => {
  it('resolves without error for a valid submission', async () => {
    await expect(submitContactForm(validInput, '1.2.3.4')).resolves.toBeUndefined();
  });

  it('calls checkRateLimit with the raw IP (no prefix)', async () => {
    await submitContactForm(validInput, '10.0.0.1');

    expect(mockRateLimit).toHaveBeenCalledWith('10.0.0.1');
  });

  it('persists name, email, and message to the DB', async () => {
    await submitContactForm(validInput, '1.2.3.4');

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Ahmed Ali',
        email: 'ahmed@example.com',
        message: 'I would like to learn more about the admissions process.',
      })
    );
  });

  it('does not include the subject in the DB call (subject is email-only)', async () => {
    await submitContactForm(validInput, '1.2.3.4');

    const callArg = mockCreate.mock.calls[0][0];
    expect(callArg).not.toHaveProperty('subject');
  });

  it('throws ServiceError(429) when rate limited', async () => {
    mockRateLimit.mockResolvedValue({ success: false, remaining: 0, reset: 0 });

    await expect(submitContactForm(validInput, '1.2.3.4')).rejects.toMatchObject({
      statusCode: 429,
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('throws ServiceError(500) when DB throws', async () => {
    mockCreate.mockRejectedValue(new Error('connection refused'));

    await expect(submitContactForm(validInput, '1.2.3.4')).rejects.toMatchObject({
      statusCode: 500,
    });
  });

  it('thrown error is a ServiceError instance', async () => {
    mockCreate.mockRejectedValue(new Error('db down'));

    const err = await submitContactForm(validInput, '1.2.3.4').catch((e) => e);
    expect(err).toBeInstanceOf(ServiceError);
  });

  it('fires both confirmation and admin emails after DB write', async () => {
    await submitContactForm(validInput, '1.2.3.4');

    expect(mockEmailConfirm).toHaveBeenCalledWith(
      'Ahmed Ali',
      'ahmed@example.com',
      'I would like to learn more about the admissions process.'
    );
    expect(mockEmailAdmin).toHaveBeenCalledWith(
      'Ahmed Ali',
      'ahmed@example.com',
      'Enrollment question',
      'I would like to learn more about the admissions process.'
    );
  });

  it('passes empty string as subject when subject is undefined', async () => {
    const { subject: _subject, ...noSubject } = validInput;
    await submitContactForm(noSubject, '1.2.3.4');

    expect(mockEmailAdmin).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      '',
      expect.any(String)
    );
  });

  it('still resolves when email sends fail (fire-and-forget)', async () => {
    mockEmailConfirm.mockRejectedValue(new Error('SMTP down'));
    mockEmailAdmin.mockRejectedValue(new Error('SMTP down'));

    await expect(submitContactForm(validInput, '1.2.3.4')).resolves.toBeUndefined();
  });
});
