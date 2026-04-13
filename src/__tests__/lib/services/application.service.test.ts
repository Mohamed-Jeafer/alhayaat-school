import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServiceError } from '@/lib/services/service-error';

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true, remaining: 4, reset: 0 }),
}));
vi.mock('@/lib/db/queries', () => ({
  createApplication: vi.fn(),
}));
vi.mock('@/lib/email/templates', () => ({
  sendApplicationConfirmation: vi.fn().mockResolvedValue(undefined),
  sendAdminApplicationNotification: vi.fn().mockResolvedValue(undefined),
}));

import { submitEnrollmentApplication } from '@/lib/services/application.service';
import { checkRateLimit } from '@/lib/rate-limit';
import { createApplication } from '@/lib/db/queries';
import {
  sendApplicationConfirmation,
  sendAdminApplicationNotification,
} from '@/lib/email/templates';

const mockRateLimit = checkRateLimit as ReturnType<typeof vi.fn>;
const mockCreate = createApplication as ReturnType<typeof vi.fn>;
const mockEmailConfirm = sendApplicationConfirmation as ReturnType<typeof vi.fn>;
const mockEmailAdmin = sendAdminApplicationNotification as ReturnType<typeof vi.fn>;

const validInput = {
  student: {
    firstName: 'Yusuf',
    lastName: 'Omar',
    dateOfBirth: '2018-03-15',
    gradeApplyingFor: 'Grade 1',
  },
  guardian: {
    name: 'Omar Hassan',
    email: 'omar@example.com',
    relationship: 'Father',
    phone: '+16135550199',
    address: '123 Rideau St',
  },
  academic: { currentGrade: 'JK', languagesSpoken: ['English', 'Arabic'] },
  additional: { howDidYouHear: 'Friend', agreeToTerms: true },
};

const mockApp = {
  id: 'app-uuid-1',
  student_data: validInput.student,
  guardian_data: validInput.guardian,
  academic_data: validInput.academic,
  additional_data: validInput.additional,
  submitted_at: new Date('2026-04-12T00:00:00Z'),
  status: 'pending',
};

beforeEach(() => {
  vi.clearAllMocks();
  mockRateLimit.mockResolvedValue({ success: true, remaining: 4, reset: 0 });
  mockCreate.mockResolvedValue(mockApp);
});

describe('submitEnrollmentApplication', () => {
  it('returns the created application on success', async () => {
    const result = await submitEnrollmentApplication(validInput, '1.2.3.4');

    expect(result).toMatchObject({ id: 'app-uuid-1', status: 'pending' });
  });

  it('calls checkRateLimit with the prefixed application IP key', async () => {
    await submitEnrollmentApplication(validInput, '1.2.3.4');

    expect(mockRateLimit).toHaveBeenCalledWith('application:1.2.3.4');
  });

  it('calls createApplication with the four JSONB sections', async () => {
    await submitEnrollmentApplication(validInput, '1.2.3.4');

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        studentData: expect.objectContaining({ firstName: 'Yusuf', lastName: 'Omar' }),
        guardianData: expect.objectContaining({ email: 'omar@example.com' }),
        academicData: expect.objectContaining({ currentGrade: 'JK' }),
        additionalData: expect.objectContaining({ agreeToTerms: true }),
      })
    );
  });

  it('throws ServiceError(429) when rate limit is exceeded', async () => {
    mockRateLimit.mockResolvedValue({ success: false, remaining: 0, reset: 0 });

    await expect(submitEnrollmentApplication(validInput, '1.2.3.4')).rejects.toMatchObject({
      statusCode: 429,
      message: expect.stringMatching(/too many/i),
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('throws ServiceError(500) when createApplication throws', async () => {
    mockCreate.mockRejectedValue(new Error('db connection refused'));

    await expect(submitEnrollmentApplication(validInput, '1.2.3.4')).rejects.toMatchObject({
      statusCode: 500,
    });
  });

  it('throws ServiceError(500) when createApplication returns null', async () => {
    mockCreate.mockResolvedValue(null);

    await expect(submitEnrollmentApplication(validInput, '1.2.3.4')).rejects.toMatchObject({
      statusCode: 500,
    });
  });

  it('fires both confirmation and admin emails after successful DB write', async () => {
    await submitEnrollmentApplication(validInput, '1.2.3.4');

    expect(mockEmailConfirm).toHaveBeenCalledWith(
      'Omar Hassan',
      'omar@example.com',
      'Yusuf Omar'
    );
    expect(mockEmailAdmin).toHaveBeenCalledWith(
      'Omar Hassan',
      'omar@example.com',
      'Yusuf Omar',
      'app-uuid-1'
    );
  });

  it('still resolves when confirmation email rejects (fire-and-forget)', async () => {
    mockEmailConfirm.mockRejectedValue(new Error('SMTP timeout'));

    await expect(submitEnrollmentApplication(validInput, '1.2.3.4')).resolves.toBeDefined();
  });

  it('still resolves when admin email rejects (fire-and-forget)', async () => {
    mockEmailAdmin.mockRejectedValue(new Error('SMTP timeout'));

    await expect(submitEnrollmentApplication(validInput, '1.2.3.4')).resolves.toBeDefined();
  });

  it('throws a ServiceError instance (not a plain Error)', async () => {
    mockCreate.mockRejectedValue(new Error('db down'));

    const err = await submitEnrollmentApplication(validInput, '1.2.3.4').catch((e) => e);
    expect(err).toBeInstanceOf(ServiceError);
  });
});
