import { DefaultAzureCredential } from '@azure/identity';

const credential = new DefaultAzureCredential();

function getMailSender(): string {
  const sender = process.env.MAIL_SENDER_ADDRESS;
  if (!sender) throw new Error('ERR_EMAIL_NOT_CONFIGURED: MAIL_SENDER_ADDRESS not set');
  return sender;
}

export interface MailAttachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  attachments?: MailAttachment[];
}): Promise<void> {
  const { token } = await credential.getToken('https://graph.microsoft.com/.default');
  const sender = getMailSender();

  const message: Record<string, unknown> = {
    subject: options.subject,
    body: { contentType: 'HTML', content: options.html },
    from: { emailAddress: { address: sender } },
    toRecipients: [{ emailAddress: { address: options.to } }],
  };

  if (options.attachments?.length) {
    message.attachments = options.attachments.map((a) => ({
      '@odata.type': '#microsoft.graph.fileAttachment',
      name: a.filename,
      contentType: a.contentType ?? 'application/octet-stream',
      contentBytes: a.content.toString('base64'),
    }));
  }

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Graph sendMail failed: ${res.status} ${res.statusText} — ${body}`);
  }
}
