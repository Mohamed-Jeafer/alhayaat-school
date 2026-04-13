import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createCheckoutSession } from '@/lib/services/donation.service';
import { ServiceError } from '@/lib/services/service-error';
import { logger } from '@/lib/logger';

const checkoutSchema = z.object({
  amount: z.number().int().min(1).max(100000),
  donorName: z.string().min(2).max(120),
  donorEmail: z.string().email(),
  donorAddress: z.string().max(300).optional(),
  isAnonymous: z.boolean(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const result = checkoutSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: result.error.flatten() },
      { status: 422 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_URL;
  if (!appUrl) {
    logger.error('NEXT_PUBLIC_URL is not set', undefined, 'stripe/checkout-session');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const url = await createCheckoutSession(result.data, appUrl);
    return NextResponse.json({ url });
  } catch (err) {
    if (err instanceof ServiceError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    throw err;
  }
}
