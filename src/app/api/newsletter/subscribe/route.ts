import { NextRequest, NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/validations/forms';
import { checkRateLimit } from '@/lib/rate-limit';
import { upsertNewsletterSubscriber } from '@/lib/db/queries';
import { sendNewsletterConfirmation } from '@/lib/email/templates';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  const result = newsletterSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 422 });
  }

  const { email } = result.data;

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'anonymous';

  const rateLimit = await checkRateLimit(`newsletter:${ip}`);
  if (!rateLimit.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { isNew } = await upsertNewsletterSubscriber(email);

    if (isNew) {
      sendNewsletterConfirmation(email).catch((err) =>
        logger.error('email error', err, 'newsletter/subscribe')
      );
    }

    return NextResponse.json(
      { message: isNew ? 'Subscribed successfully.' : 'Already subscribed.' },
      { status: isNew ? 201 : 200 }
    );
  } catch (err) {
    logger.error('subscribe error', err, 'newsletter/subscribe');
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
