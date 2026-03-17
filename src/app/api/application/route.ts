import { NextRequest, NextResponse } from 'next/server';
import { applicationSchema } from '@/lib/validations/forms';
import { checkRateLimit } from '@/lib/rate-limit';
import { createApplication } from '@/lib/db/queries';
import {
  sendApplicationConfirmation,
  sendAdminApplicationNotification,
} from '@/lib/email/templates';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // 1. Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  // 2. Validate
  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  // 3. Rate limit by IP
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const rateLimit = await checkRateLimit(`application:${ip}`);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again in an hour.' },
      { status: 429, headers: { 'Retry-After': '3600' } }
    );
  }

  // 4. Persist
  const { student, guardian, academic, additional } = parsed.data;
  let application;
  try {
    application = await createApplication({
      studentData: student as Record<string, unknown>,
      guardianData: guardian as Record<string, unknown>,
      academicData: academic as Record<string, unknown>,
      additionalData: additional as Record<string, unknown>,
    });
  } catch (err) {
    logger.error('createApplication error', err, 'api/application');
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }

  if (!application) {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }

  // 5. Non-blocking emails
  const studentName = `${student.firstName} ${student.lastName}`;
  sendApplicationConfirmation(guardian.name, guardian.email, studentName).catch(
    (e) => logger.error('email error', e, 'api/application')
  );
  sendAdminApplicationNotification(
    guardian.name,
    guardian.email,
    studentName,
    application.id
  ).catch((e) => logger.error('email error', e, 'api/application'));

  // 6. Respond
  return NextResponse.json({ success: true, id: application.id }, { status: 201 });
}
