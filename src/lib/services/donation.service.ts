import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { createDonation } from '@/lib/db/queries';
import { generateReceipt } from '@/lib/pdf/receipt';
import { sendThankYouEmail } from '@/lib/email/donations';
import { logger } from '@/lib/logger';
import { ServiceError } from './service-error';

export interface CreateCheckoutSessionInput {
  amount: number;
  donorName: string;
  donorEmail: string;
  donorAddress?: string;
  isAnonymous: boolean;
}

export async function createCheckoutSession(
  data: CreateCheckoutSessionInput,
  appUrl: string
): Promise<string> {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'Donation to Al-Hayaat School',
            description: 'Your donation supports academic excellence and spiritual development.',
          },
          unit_amount: data.amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${appUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/donate`,
    customer_email: data.donorEmail,
    metadata: {
      donorName: data.isAnonymous ? 'Anonymous' : data.donorName,
      donorEmail: data.donorEmail,
      donorAddress: data.donorAddress ?? '',
      isAnonymous: String(data.isAnonymous),
    },
  }).catch((err) => {
    logger.error('Stripe error', err, 'services/donation');
    throw new ServiceError('Payment service temporarily unavailable.', 500);
  });

  if (!session.url) {
    throw new ServiceError('Payment service temporarily unavailable.', 500);
  }

  return session.url;
}

export async function handleDonationWebhook(
  rawBody: string,
  signature: string
): Promise<void> {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    logger.error('STRIPE_WEBHOOK_SECRET not configured — ERR_WEBHOOK_SECRET_MISSING', undefined, 'services/donation');
    throw new ServiceError('Webhook not configured', 500);
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Signature verification failed — ERR_STRIPE_INVALID_SIGNATURE', message, 'services/donation');
    throw new ServiceError('Invalid signature', 400);
  }

  if (event.type !== 'checkout.session.completed') return;

  const session = event.data.object as Stripe.Checkout.Session;

  const isAnonymous = session.metadata?.isAnonymous === 'true';
  const donorEmail = session.metadata?.donorEmail ?? session.customer_email;

  if (!donorEmail) {
    logger.error('Missing donor email — ERR_MISSING_DONOR_EMAIL', { sessionId: session.id }, 'services/donation');
    throw new ServiceError('Missing donor email', 500);
  }

  const donation = await createDonation({
    stripeSessionId: session.id,
    amountCad: (session.amount_total ?? 0) / 100,
    donorName: isAnonymous ? null : (session.metadata?.donorName ?? null),
    donorEmail,
    donorAddress: session.metadata?.donorAddress || undefined,
    isAnonymous,
  }).catch((err) => {
    logger.error('DB write failed — ERR_DB_WRITE_FAILED', { err, sessionId: session.id }, 'services/donation');
    throw new ServiceError('Database error', 500);
  });

  if (!donation) {
    logger.info(`Duplicate event ignored: ${session.id}`, undefined, 'services/donation');
    return;
  }

  logger.info(`Donation recorded: ${donation.id} — $${donation.amountCad} CAD`, undefined, 'services/donation');

  generateReceipt(donation)
    .then((pdf) => sendThankYouEmail({ donation, receiptPdf: pdf }))
    .then(() => logger.info(`Email sent for donation: ${donation.id}`, undefined, 'services/donation'))
    .catch((err) =>
      logger.error('Email/PDF failed — ERR_EMAIL_SEND_FAILED', { err, donationId: donation.id }, 'services/donation')
    );
}
