import { NextRequest, NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/validations/forms';
import { subscribeToNewsletter } from '@/lib/services/newsletter.service';
import { ServiceError } from '@/lib/services/service-error';

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

  try {
    const { isNew, message } = await subscribeToNewsletter(email, ip);
    return NextResponse.json({ message }, { status: isNew ? 201 : 200 });
  } catch (err) {
    if (err instanceof ServiceError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    throw err;
  }
}
