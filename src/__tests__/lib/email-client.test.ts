import { describe, it, expect, vi, beforeEach } from 'vitest';

// DefaultAzureCredential is instantiated at module load time in client.ts,
// so mock must be a real constructor function.
vi.mock('@azure/identity', () => ({
  DefaultAzureCredential: function MockCredential(this: { getToken: unknown }) {
    this.getToken = () => Promise.resolve({ token: 'mock-bearer-token' });
  },
}));

// Import after mock is registered
const { sendMail } = await import('@/lib/email/client');

const SENDER = 'noreply@alhayaat.ca';

function mockFetch(status: number, body = '') {
  global.fetch = vi.fn().mockResolvedValue(
    new Response(body, { status })
  );
}

describe('sendMail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends a plain email via Graph API with correct shape', async () => {
    mockFetch(202);

    await sendMail({ to: 'parent@example.com', subject: 'Hello', html: '<p>Hi</p>' });

    expect(global.fetch).toHaveBeenCalledOnce();
    const [url, init] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('graph.microsoft.com');
    expect(url).toContain(encodeURIComponent(SENDER));
    expect(url).toContain('sendMail');
    expect(init.method).toBe('POST');
    expect(init.headers['Authorization']).toBe('Bearer mock-bearer-token');

    const body = JSON.parse(init.body as string);
    expect(body.message.toRecipients[0].emailAddress.address).toBe('parent@example.com');
    expect(body.message.subject).toBe('Hello');
    expect(body.message.body.contentType).toBe('HTML');
    expect(body.message.body.content).toBe('<p>Hi</p>');
  });

  it('includes base64-encoded attachments when provided', async () => {
    mockFetch(202);

    const pdfBuffer = Buffer.from('%PDF-1.4 mock');
    await sendMail({
      to: 'donor@example.com',
      subject: 'Receipt',
      html: '<p>Thank you</p>',
      attachments: [{ filename: 'receipt.pdf', content: pdfBuffer, contentType: 'application/pdf' }],
    });

    const body = JSON.parse((global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body);
    expect(body.message.attachments).toHaveLength(1);
    expect(body.message.attachments[0]).toMatchObject({
      '@odata.type': '#microsoft.graph.fileAttachment',
      name: 'receipt.pdf',
      contentType: 'application/pdf',
      contentBytes: pdfBuffer.toString('base64'),
    });
  });

  it('throws when Graph API returns an error status', async () => {
    mockFetch(403, 'Forbidden');

    await expect(
      sendMail({ to: 'x@example.com', subject: 'Test', html: '<p>Hi</p>' })
    ).rejects.toThrow('Graph sendMail failed: 403');
  });

  it('throws ERR_EMAIL_NOT_CONFIGURED when MAIL_SENDER_ADDRESS is not set', async () => {
    const saved = process.env.MAIL_SENDER_ADDRESS;
    delete process.env.MAIL_SENDER_ADDRESS;
    mockFetch(202);

    await expect(
      sendMail({ to: 'x@example.com', subject: 'Test', html: '<p>Hi</p>' })
    ).rejects.toThrow('ERR_EMAIL_NOT_CONFIGURED');

    process.env.MAIL_SENDER_ADDRESS = saved;
  });
});
