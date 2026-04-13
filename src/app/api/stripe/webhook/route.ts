import { NextRequest, NextResponse } from 'next/server';
import { handleDonationWebhook } from '@/lib/services/donation.service';
import { ServiceError } from '@/lib/services/service-error';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    logger.error('Missing stripe-signature header — ERR_STRIPE_INVALID_SIGNATURE', undefined, 'webhook');
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  try {
    await handleDonationWebhook(body, signature);
    return NextResponse.json({ received: true });
  } catch (err) {
    if (err instanceof ServiceError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    throw err;
  }
}
