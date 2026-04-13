import { checkRateLimit } from '@/lib/rate-limit';
import { createContactSubmission } from '@/lib/db/queries';
import {
  sendContactConfirmation,
  sendAdminContactNotification,
} from '@/lib/email/templates';
import { logger } from '@/lib/logger';
import { ServiceError } from './service-error';

export interface ContactFormInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function submitContactForm(
  data: ContactFormInput,
  ip: string
): Promise<void> {
  const { success: allowed } = await checkRateLimit(ip);
  if (!allowed) {
    throw new ServiceError('Too many submissions. Please try again later.', 429);
  }

  await createContactSubmission({
    name: data.name,
    email: data.email,
    message: data.message,
  }).catch((err) => {
    logger.error('DB error', err, 'services/contact');
    throw new ServiceError('Something went wrong. Please try again.', 500);
  });

  Promise.all([
    sendContactConfirmation(data.name, data.email, data.message),
    sendAdminContactNotification(data.name, data.email, data.subject ?? '', data.message),
  ]).catch((err) => logger.error('email error', err, 'services/contact'));
}
