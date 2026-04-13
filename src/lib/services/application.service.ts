import { checkRateLimit } from '@/lib/rate-limit';
import { createApplication, type Application } from '@/lib/db/queries';
import {
  sendApplicationConfirmation,
  sendAdminApplicationNotification,
} from '@/lib/email/templates';
import { logger } from '@/lib/logger';
import { ServiceError } from './service-error';

export interface EnrollmentApplicationInput {
  student: {
    firstName: string;
    lastName: string;
    [key: string]: unknown;
  };
  guardian: {
    name: string;
    email: string;
    [key: string]: unknown;
  };
  academic: Record<string, unknown>;
  additional: Record<string, unknown>;
}

export async function submitEnrollmentApplication(
  data: EnrollmentApplicationInput,
  ip: string
): Promise<Application> {
  const rateLimit = await checkRateLimit(`application:${ip}`);
  if (!rateLimit.success) {
    throw new ServiceError('Too many submissions. Please try again in an hour.', 429);
  }

  const application = await createApplication({
    studentData: data.student as Record<string, unknown>,
    guardianData: data.guardian as Record<string, unknown>,
    academicData: data.academic,
    additionalData: data.additional,
  }).catch((err) => {
    logger.error('createApplication error', err, 'services/application');
    throw new ServiceError('Something went wrong. Please try again.', 500);
  });

  if (!application) {
    throw new ServiceError('Something went wrong. Please try again.', 500);
  }

  const studentName = `${data.student.firstName} ${data.student.lastName}`;
  sendApplicationConfirmation(data.guardian.name, data.guardian.email, studentName).catch(
    (e) => logger.error('email error', e, 'services/application')
  );
  sendAdminApplicationNotification(
    data.guardian.name,
    data.guardian.email,
    studentName,
    application.id
  ).catch((e) => logger.error('email error', e, 'services/application'));

  return application;
}
