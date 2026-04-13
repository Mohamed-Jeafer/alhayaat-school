import { NextRequest, NextResponse } from 'next/server';
import { jobApplicationSchema } from '@/lib/validations/forms';
import { submitJobApplication } from '@/lib/services/job-application.service';
import { ServiceError } from '@/lib/services/service-error';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const name = (formData.get('name') as string | null) ?? '';
  const email = (formData.get('email') as string | null) ?? '';
  const phone = (formData.get('phone') as string | null) ?? '';
  const position = (formData.get('position') as string | null) ?? '';
  const coverLetter = (formData.get('coverLetter') as string | null) ?? '';
  const resume = formData.get('resume') as File | null;

  const result = jobApplicationSchema.safeParse({ name, email, phone, position, coverLetter });
  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  if (!resume) {
    return NextResponse.json({ error: 'Resume is required' }, { status: 422 });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1';

  try {
    const application = await submitJobApplication(
      {
        name: result.data.name,
        email: result.data.email,
        phone: phone || undefined,
        position: result.data.position,
        coverLetter: result.data.coverLetter ?? undefined,
        resume,
      },
      ip
    );
    return NextResponse.json({ success: true, id: application?.id }, { status: 201 });
  } catch (err) {
    if (err instanceof ServiceError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    throw err;
  }
}
