import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import { jobApplicationSchema } from '@/lib/validations/forms';
import { checkRateLimit } from '@/lib/rate-limit';
import { createJobApplication } from '@/lib/db/queries';
import {
  sendJobApplicationConfirmation,
  sendAdminJobApplicationNotification,
} from '@/lib/email/templates';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const ALLOWED_EXTS = new Set(['.pdf', '.doc', '.docx']);
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  // 1. Parse FormData
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // 2. Extract fields
  const name = (formData.get('name') as string | null) ?? '';
  const email = (formData.get('email') as string | null) ?? '';
  const phone = (formData.get('phone') as string | null) ?? '';
  const position = (formData.get('position') as string | null) ?? '';
  const coverLetter = (formData.get('coverLetter') as string | null) ?? '';
  const resume = formData.get('resume') as File | null;

  // 3. Validate text fields with Zod schema (resume handled separately)
  const result = jobApplicationSchema.safeParse({ name, email, phone, position, coverLetter });
  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { name: applicantName, email: applicantEmail, position: positionTitle } = result.data;
  const coverLetterValue = result.data.coverLetter ?? '';

  // 4. Validate resume
  if (!resume || resume.size === 0) {
    return NextResponse.json({ error: 'Resume is required' }, { status: 422 });
  }
  if (resume.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Resume must be under 5MB' }, { status: 422 });
  }
  const ext = ('.' + (resume.name.split('.').pop() ?? '')).toLowerCase();
  if (!ALLOWED_TYPES.has(resume.type) && !ALLOWED_EXTS.has(ext)) {
    return NextResponse.json(
      { error: 'Resume must be PDF or Word document' },
      { status: 422 }
    );
  }

  // 5. Rate limit by IP
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1';
  const rl = await checkRateLimit(`job-apply:${ip}`);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  // 6. Upload resume to Azure Blob Storage
  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connStr) {
    logger.error('AZURE_STORAGE_CONNECTION_STRING not set', undefined, 'jobs/apply');
    return NextResponse.json({ error: 'File upload not configured' }, { status: 500 });
  }

  let resumeUrl: string;
  try {
    const blobClient = BlobServiceClient.fromConnectionString(connStr);
    const container = blobClient.getContainerClient('resumes');
    await container.createIfNotExists();

    const blobName = `${crypto.randomUUID()}-${resume.name}`;
    const blockBlob = container.getBlockBlobClient(blobName);
    const buffer = Buffer.from(await resume.arrayBuffer());
    await blockBlob.upload(buffer, buffer.length, {
      blobHTTPHeaders: { blobContentType: resume.type },
    });
    resumeUrl = blockBlob.url;
  } catch (err) {
    logger.error('Azure Blob upload error', err, 'jobs/apply');
    return NextResponse.json(
      { error: 'Failed to upload resume. Please try again.' },
      { status: 500 }
    );
  }

  // 7. Save to DB
  let application: Awaited<ReturnType<typeof createJobApplication>>;
  try {
    application = await createJobApplication({
      applicantName,
      applicantEmail,
      applicantPhone: phone || undefined,
      positionTitle,
      resumeBlobUrl: resumeUrl,
      coverLetter: coverLetterValue || undefined,
    });
  } catch (err) {
    logger.error('DB error', err, 'jobs/apply');
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }

  // 8. Send emails (non-blocking)
  sendJobApplicationConfirmation(applicantName, applicantEmail, positionTitle).catch((e) =>
    logger.error('Confirmation email error', e, 'jobs/apply')
  );
  sendAdminJobApplicationNotification(applicantName, applicantEmail, positionTitle).catch((e) =>
    logger.error('Admin notification email error', e, 'jobs/apply')
  );

  // 9. Return success
  return NextResponse.json({ success: true, id: application?.id }, { status: 201 });
}
