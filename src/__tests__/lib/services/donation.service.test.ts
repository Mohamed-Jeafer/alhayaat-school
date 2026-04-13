import { describe, it, expect, vi, beforeEach } from 'vitest';
import type Stripe from 'stripe';
import { ServiceError } from '@/lib/services/service-error';

vi.mock('@/lib/stripe', () => ({
  getStripe: vi.fn(),
}));
vi.mock('@/lib/db/queries', () => ({
  createDonation: vi.fn(),
}));
vi.mock('@/lib/pdf/receipt', () => ({
  generateReceipt: vi.fn().mockResolvedValue(Buffer.from('%PDF-mock')),
}));
vi.mock('@/lib/email/donations', () => ({
  sendThankYouEmail: vi.fn().mockResolvedValue(undefined),
}));

import { createCheckoutSession, handleDonationWebhook } from '@/lib/services/donation.service';
import { getStripe } from '@/lib/stripe';
import { createDonation } from '@/lib/db/queries';
import { generateReceipt } from '@/lib/pdf/receipt';
import { sendThankYouEmail } from '@/lib/email/donations';

const mockGetStripe = getStripe as ReturnType<typeof vi.fn>;
const mockCreateDonation = createDonation as ReturnType<typeof vi.fn>;
const mockGenerateReceipt = generateReceipt as ReturnType<typeof vi.fn>;
const mockSendThankYou = sendThankYouEmail as ReturnType<typeof vi.fn>;

const APP_URL = 'https://alhayaat.ca';

const validCheckoutInput = {
  amount: 100,
  donorName: 'Sara Hassan',
  donorEmail: 'sara@example.com',
  donorAddress: '123 Main St, Ottawa',
  isAnonymous: false,
};

const mockDonation = {
  id: 'don-uuid-1',
  stripeSessionId: 'cs_test_abc123',
  amountCad: 100,
  donorName: 'Sara Hassan',
  donorEmail: 'sara@example.com',
  donorAddress: '123 Main St, Ottawa',
  isAnonymous: false,
  status: 'completed',
  createdAt: new Date('2026-04-12T00:00:00Z'),
};

function makeStripeSession(
  overrides: Partial<Stripe.Checkout.Session> = {}
): Stripe.Checkout.Session {
  return {
    id: 'cs_test_abc123',
    object: 'checkout.session',
    amount_total: 10000,
    currency: 'cad',
    customer_email: 'sara@example.com',
    metadata: {
      donorName: 'Sara Hassan',
      donorEmail: 'sara@example.com',
      donorAddress: '123 Main St, Ottawa',
      isAnonymous: 'false',
    },
    payment_status: 'paid',
    status: 'complete',
    ...overrides,
  } as Stripe.Checkout.Session;
}

function makeStripeEvent(
  sessionOverrides: Partial<Stripe.Checkout.Session> = {},
  eventType = 'checkout.session.completed'
): Stripe.Event {
  return {
    id: 'evt_test_123',
    object: 'event',
    type: eventType,
    data: { object: makeStripeSession(sessionOverrides) },
    api_version: '2026-02-25.clover',
    created: 1712841600,
    livemode: false,
    pending_webhooks: 1,
    request: null,
  } as Stripe.Event;
}

function makeStripeInstance(event: Stripe.Event) {
  return {
    webhooks: { constructEvent: vi.fn().mockReturnValue(event) },
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({ url: 'https://checkout.stripe.com/pay/cs_test' }),
      },
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock';
  mockCreateDonation.mockResolvedValue(mockDonation);
  mockGenerateReceipt.mockResolvedValue(Buffer.from('%PDF-mock'));
  mockSendThankYou.mockResolvedValue(undefined);
});

// ─────────────────────────────────────────────────────────────
// createCheckoutSession
// ─────────────────────────────────────────────────────────────

describe('createCheckoutSession', () => {
  it('returns the Stripe checkout URL on success', async () => {
    const stripeInstance = makeStripeInstance(makeStripeEvent());
    mockGetStripe.mockReturnValue(stripeInstance);

    const url = await createCheckoutSession(validCheckoutInput, APP_URL);

    expect(url).toBe('https://checkout.stripe.com/pay/cs_test');
  });

  it('creates a CAD session for the correct amount in cents', async () => {
    const stripeInstance = makeStripeInstance(makeStripeEvent());
    mockGetStripe.mockReturnValue(stripeInstance);

    await createCheckoutSession({ ...validCheckoutInput, amount: 50 }, APP_URL);

    expect(stripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: expect.arrayContaining([
          expect.objectContaining({
            price_data: expect.objectContaining({
              currency: 'cad',
              unit_amount: 5000, // $50 × 100
            }),
          }),
        ]),
      })
    );
  });

  it('sets donorName to "Anonymous" in metadata when isAnonymous is true', async () => {
    const stripeInstance = makeStripeInstance(makeStripeEvent());
    mockGetStripe.mockReturnValue(stripeInstance);

    await createCheckoutSession({ ...validCheckoutInput, isAnonymous: true }, APP_URL);

    expect(stripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ donorName: 'Anonymous' }),
      })
    );
  });

  it('uses real donor name in metadata when isAnonymous is false', async () => {
    const stripeInstance = makeStripeInstance(makeStripeEvent());
    mockGetStripe.mockReturnValue(stripeInstance);

    await createCheckoutSession(validCheckoutInput, APP_URL);

    expect(stripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ donorName: 'Sara Hassan' }),
      })
    );
  });

  it('builds success_url and cancel_url from appUrl', async () => {
    const stripeInstance = makeStripeInstance(makeStripeEvent());
    mockGetStripe.mockReturnValue(stripeInstance);

    await createCheckoutSession(validCheckoutInput, 'https://alhayaat.ca');

    expect(stripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        success_url: expect.stringContaining('https://alhayaat.ca/donate/success'),
        cancel_url: 'https://alhayaat.ca/donate',
      })
    );
  });

  it('throws ServiceError(500) when Stripe throws', async () => {
    mockGetStripe.mockReturnValue({
      checkout: {
        sessions: { create: vi.fn().mockRejectedValue(new Error('Stripe API down')) },
      },
    });

    await expect(createCheckoutSession(validCheckoutInput, APP_URL)).rejects.toMatchObject({
      statusCode: 500,
    });
  });

  it('throws ServiceError(500) when Stripe returns a null URL', async () => {
    mockGetStripe.mockReturnValue({
      checkout: {
        sessions: { create: vi.fn().mockResolvedValue({ url: null }) },
      },
    });

    await expect(createCheckoutSession(validCheckoutInput, APP_URL)).rejects.toMatchObject({
      statusCode: 500,
    });
  });

  it('thrown error is a ServiceError instance', async () => {
    mockGetStripe.mockReturnValue({
      checkout: {
        sessions: { create: vi.fn().mockRejectedValue(new Error('error')) },
      },
    });

    const err = await createCheckoutSession(validCheckoutInput, APP_URL).catch((e) => e);
    expect(err).toBeInstanceOf(ServiceError);
  });
});

// ─────────────────────────────────────────────────────────────
// handleDonationWebhook
// ─────────────────────────────────────────────────────────────

describe('handleDonationWebhook', () => {
  it('resolves without error for a valid checkout.session.completed event', async () => {
    const event = makeStripeEvent();
    mockGetStripe.mockReturnValue(makeStripeInstance(event));

    await expect(handleDonationWebhook(JSON.stringify(event), 'valid-sig')).resolves.toBeUndefined();
  });

  it('persists the donation with correct fields', async () => {
    const event = makeStripeEvent();
    mockGetStripe.mockReturnValue(makeStripeInstance(event));

    await handleDonationWebhook(JSON.stringify(event), 'valid-sig');

    expect(mockCreateDonation).toHaveBeenCalledWith(
      expect.objectContaining({
        stripeSessionId: 'cs_test_abc123',
        amountCad: 100,        // 10000 cents ÷ 100
        donorEmail: 'sara@example.com',
        isAnonymous: false,
      })
    );
  });

  it('converts amount_total from cents to dollars correctly', async () => {
    const event = makeStripeEvent({ amount_total: 7500 }); // $75.00
    mockGetStripe.mockReturnValue(makeStripeInstance(event));

    await handleDonationWebhook(JSON.stringify(event), 'valid-sig');

    expect(mockCreateDonation).toHaveBeenCalledWith(
      expect.objectContaining({ amountCad: 75 })
    );
  });

  it('sets donorName to null for anonymous donations', async () => {
    const event = makeStripeEvent({
      metadata: {
        isAnonymous: 'true',
        donorEmail: 'anon@example.com',
        donorName: 'Should Be Hidden',
      },
    });
    mockGetStripe.mockReturnValue(makeStripeInstance(event));

    await handleDonationWebhook(JSON.stringify(event), 'valid-sig');

    expect(mockCreateDonation).toHaveBeenCalledWith(
      expect.objectContaining({ donorName: null, isAnonymous: true })
    );
  });

  it('falls back to customer_email when metadata.donorEmail is absent', async () => {
    const event = makeStripeEvent({
      customer_email: 'fallback@example.com',
      metadata: { isAnonymous: 'false', donorName: 'Test' },
    });
    mockGetStripe.mockReturnValue(makeStripeInstance(event));

    await handleDonationWebhook(JSON.stringify(event), 'valid-sig');

    expect(mockCreateDonation).toHaveBeenCalledWith(
      expect.objectContaining({ donorEmail: 'fallback@example.com' })
    );
  });

  it('silently returns (no DB call) for duplicate events (createDonation returns null)', async () => {
    const event = makeStripeEvent();
    mockGetStripe.mockReturnValue(makeStripeInstance(event));
    mockCreateDonation.mockResolvedValue(null);

    await expect(handleDonationWebhook(JSON.stringify(event), 'valid-sig')).resolves.toBeUndefined();
    expect(mockGenerateReceipt).not.toHaveBeenCalled();
  });

  it('fires receipt generation and thank-you email after a new donation', async () => {
    const event = makeStripeEvent();
    mockGetStripe.mockReturnValue(makeStripeInstance(event));

    await handleDonationWebhook(JSON.stringify(event), 'valid-sig');

    expect(mockGenerateReceipt).toHaveBeenCalledWith(mockDonation);
    expect(mockSendThankYou).toHaveBeenCalledWith(
      expect.objectContaining({ donation: mockDonation })
    );
  });

  it('resolves even when receipt/email pipeline fails (fire-and-forget)', async () => {
    const event = makeStripeEvent();
    mockGetStripe.mockReturnValue(makeStripeInstance(event));
    mockGenerateReceipt.mockRejectedValue(new Error('PDF generation failed'));

    await expect(handleDonationWebhook(JSON.stringify(event), 'valid-sig')).resolves.toBeUndefined();
  });

  it('silently returns for unrecognised event types', async () => {
    const event = makeStripeEvent({}, 'payment_intent.created');
    mockGetStripe.mockReturnValue(makeStripeInstance(event));

    await expect(handleDonationWebhook(JSON.stringify(event), 'valid-sig')).resolves.toBeUndefined();
    expect(mockCreateDonation).not.toHaveBeenCalled();
  });

  it('throws ServiceError(500) when STRIPE_WEBHOOK_SECRET is missing', async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;

    await expect(handleDonationWebhook('{}', 'sig')).rejects.toMatchObject({
      statusCode: 500,
    });
  });

  it('throws ServiceError(400) when signature verification fails', async () => {
    mockGetStripe.mockReturnValue({
      webhooks: {
        constructEvent: vi.fn().mockImplementation(() => {
          throw new Error('No signatures found matching the expected signature for payload.');
        }),
      },
    });

    await expect(handleDonationWebhook('{}', 'bad-sig')).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it('throws ServiceError(500) when donor email is absent from both metadata and customer_email', async () => {
    const event = makeStripeEvent({
      customer_email: null,
      metadata: { isAnonymous: 'false', donorName: 'Test' }, // no donorEmail key
    });
    mockGetStripe.mockReturnValue(makeStripeInstance(event));

    await expect(handleDonationWebhook(JSON.stringify(event), 'valid-sig')).rejects.toMatchObject({
      statusCode: 500,
    });
    expect(mockCreateDonation).not.toHaveBeenCalled();
  });

  it('throws ServiceError(500) when DB write fails (so Stripe retries)', async () => {
    const event = makeStripeEvent();
    mockGetStripe.mockReturnValue(makeStripeInstance(event));
    mockCreateDonation.mockRejectedValue(new Error('db connection lost'));

    await expect(handleDonationWebhook(JSON.stringify(event), 'valid-sig')).rejects.toMatchObject({
      statusCode: 500,
    });
  });

  it('thrown errors are ServiceError instances', async () => {
    mockGetStripe.mockReturnValue({
      webhooks: {
        constructEvent: vi.fn().mockImplementation(() => {
          throw new Error('bad sig');
        }),
      },
    });

    const err = await handleDonationWebhook('{}', 'bad').catch((e) => e);
    expect(err).toBeInstanceOf(ServiceError);
  });
});
