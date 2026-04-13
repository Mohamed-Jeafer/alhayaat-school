import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations/forms';
import { submitContactForm } from '@/lib/services/contact.service';
import { ServiceError } from '@/lib/services/service-error';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { name, email, subject, message, honeypot } = result.data;

  if (honeypot) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';

  try {
    await submitContactForm({ name, email, subject, message }, ip);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    if (err instanceof ServiceError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    throw err;
  }
}
