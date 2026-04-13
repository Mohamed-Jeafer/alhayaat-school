import { BlobServiceClient } from '@azure/storage-blob';
import { checkRateLimit } from '@/lib/rate-limit';
import { createJobApplication, type JobApplication } from '@/lib/db/queries';
import {
  sendJobApplicationConfirmation,
  sendAdminJobApplicationNotification,
} from '@/lib/email/templates';
import { logger } from '@/lib/logger';
import { ServiceError } from './service-error';

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const ALLOWED_EXTS = new Set(['.pdf', '.doc', '.docx']);
const MAX_SIZE = 5 * 1024 * 1024;

export interface JobApplicationInput {
  name: string;
  email: string;
  phone?: string;
  position: string;
  coverLetter?: string;
  resume: File;
}

export async function submitJobApplication(
  data: JobApplicationInput,
  ip: string
): Promise<JobApplication> {
  if (data.resume.size === 0) {
    throw new ServiceError('Resume is required', 422);
  }
  if (data.resume.size > MAX_SIZE) {
    throw new ServiceError('Resume must be under 5MB', 422);
  }
  const ext = ('.' + (data.resume.name.split('.').pop() ?? '')).toLowerCase();
  if (!ALLOWED_TYPES.has(data.resume.type) && !ALLOWED_EXTS.has(ext)) {
    throw new ServiceError('Resume must be PDF or Word document', 422);
  }

  const rl = await checkRateLimit(`job-apply:${ip}`);
  if (!rl.success) {
    throw new ServiceError('Too many requests. Please try again later.', 429);
  }

  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connStr) {
    logger.error('AZURE_STORAGE_CONNECTION_STRING not set', undefined, 'services/job-application');
    throw new ServiceError('File upload not configured', 500);
  }

  let resumeUrl: string;
  try {
    const blobClient = BlobServiceClient.fromConnectionString(connStr);
    const container = blobClient.getContainerClient('resumes');
    await container.createIfNotExists();
    const blobName = `${crypto.randomUUID()}-${data.resume.name}`;
    const blockBlob = container.getBlockBlobClient(blobName);
    const buffer = Buffer.from(await data.resume.arrayBuffer());
    await blockBlob.upload(buffer, buffer.length, {
      blobHTTPHeaders: { blobContentType: data.resume.type },
    });
    resumeUrl = blockBlob.url;
  } catch (err) {
    logger.error('Azure Blob upload error', err, 'services/job-application');
    throw new ServiceError('Failed to upload resume. Please try again.', 500);
  }

  const application = await createJobApplication({
    applicantName: data.name,
    applicantEmail: data.email,
    applicantPhone: data.phone,
    positionTitle: data.position,
    resumeBlobUrl: resumeUrl,
    coverLetter: data.coverLetter,
  }).catch((err) => {
    logger.error('DB error', err, 'services/job-application');
    throw new ServiceError('Something went wrong.', 500);
  });

  if (!application) {
    throw new ServiceError('Something went wrong.', 500);
  }

  sendJobApplicationConfirmation(data.name, data.email, data.position).catch((e) =>
    logger.error('Confirmation email error', e, 'services/job-application')
  );
  sendAdminJobApplicationNotification(data.name, data.email, data.position).catch((e) =>
    logger.error('Admin notification email error', e, 'services/job-application')
  );

  return application;
}
