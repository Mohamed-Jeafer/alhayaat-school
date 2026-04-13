import { checkRateLimit } from '@/lib/rate-limit';
import { upsertNewsletterSubscriber } from '@/lib/db/queries';
import { sendNewsletterConfirmation } from '@/lib/email/templates';
import { logger } from '@/lib/logger';
import { ServiceError } from './service-error';

export interface NewsletterSubscribeResult {
  isNew: boolean;
  message: string;
}

export async function subscribeToNewsletter(
  email: string,
  ip: string
): Promise<NewsletterSubscribeResult> {
  const rateLimit = await checkRateLimit(`newsletter:${ip}`);
  if (!rateLimit.success) {
    throw new ServiceError('Too many requests', 429);
  }

  const { isNew } = await upsertNewsletterSubscriber(email).catch((err) => {
    logger.error('subscribe error', err, 'services/newsletter');
    throw new ServiceError('Something went wrong.', 500);
  });

  if (isNew) {
    sendNewsletterConfirmation(email).catch((err) =>
      logger.error('email error', err, 'services/newsletter')
    );
  }

  return {
    isNew,
    message: isNew ? 'Subscribed successfully.' : 'Already subscribed.',
  };
}
