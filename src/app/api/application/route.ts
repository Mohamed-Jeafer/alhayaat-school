import { NextRequest, NextResponse } from 'next/server';
import { applicationSchema } from '@/lib/validations/forms';
import { submitEnrollmentApplication } from '@/lib/services/application.service';
import { ServiceError } from '@/lib/services/service-error';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';

  try {
    const application = await submitEnrollmentApplication(parsed.data, ip);
    return NextResponse.json({ success: true, id: application.id }, { status: 201 });
  } catch (err) {
    if (err instanceof ServiceError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    throw err;
  }
}
