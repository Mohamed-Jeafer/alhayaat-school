import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations/forms';
import { checkRateLimit } from '@/lib/rate-limit';
import { createContactSubmission } from '@/lib/db/queries';
import {
  sendContactConfirmation,
  sendAdminContactNotification,
} from '@/lib/email/templates';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // 1. Parse body
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // 2. Validate
  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { name, email, message, honeypot } = result.data;

  // 3. Honeypot check — silent success (bot trap)
  if (honeypot) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // 4. Rate limit by IP
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success: allowed } = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 }
    );
  }

  // 5. Persist to DB
  try {
    await createContactSubmission({ name, email, message });
  } catch (err) {
    logger.error('DB error', err, 'contact');
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }

  // 6. Fire-and-forget emails
  Promise.all([
    sendContactConfirmation(name, email, message),
    sendAdminContactNotification(name, email, message),
  ])
    .then(() => {})
    .catch((err) => logger.error('email error', err, 'contact'));

  // 7. Success
  return NextResponse.json({ success: true }, { status: 201 });
}
