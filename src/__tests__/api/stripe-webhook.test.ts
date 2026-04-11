import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import type Stripe from 'stripe';

vi.mock('@/lib/db/queries', () => ({
  createDonation: vi.fn(),
}));
vi.mock('@/lib/email/donations', () => ({
  sendThankYouEmail: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/lib/pdf/receipt', () => ({
  generateReceipt: vi.fn().mockResolvedValue(Buffer.from('%PDF-mock')),
}));

// Mock getStripe so we control signature verification
vi.mock('@/lib/stripe', () => ({
  getStripe: vi.fn(),
}));

import { POST } from '@/app/api/stripe/webhook/route';
import { createDonation } from '@/lib/db/queries';
import { getStripe } from '@/lib/stripe';

const mockCreateDonation = createDonation as ReturnType<typeof vi.fn>;
const mockGetStripe = getStripe as ReturnType<typeof vi.fn>;
const URL = 'http://localhost:3000/api/stripe/webhook';

// A realistic Stripe checkout.session.completed event payload (captured shape)
function makeStripeEvent(overrides: Partial<Stripe.Checkout.Session> = {}): Stripe.Event {
  const session: Partial<Stripe.Checkout.Session> = {
    id: 'cs_test_abc123',
    object: 'checkout.session',
    amount_total: 10000, // $100.00 CAD in cents
    currency: 'cad',
    customer_email: 'donor@example.com',
    metadata: {
      donorName: 'Sara Hassan',
      donorEmail: 'sara@example.com',
      donorAddress: '123 Main St, Ottawa',
      isAnonymous: 'false',
    },
    payment_status: 'paid',
    status: 'complete',
    ...overrides,
  };

  return {
    id: 'evt_test_123',
    object: 'event',
    type: 'checkout.session.completed',
    data: { object: session as Stripe.Checkout.Session },
    api_version: '2026-02-25.clover',
    created: 1712841600,
    livemode: false,
    pending_webhooks: 1,
    request: null,
  } as Stripe.Event;
}

function makeStripeInstance(event: Stripe.Event) {
  return {
    webhooks: {
      constructEvent: vi.fn().mockReturnValue(event),
    },
  };
}

function webhookRequest(body: string, signature = 'valid-sig'): NextRequest {
  return new NextRequest(URL, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
      'stripe-signature': signature,
    },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/stripe/webhook', () => {
  it('returns 400 when stripe-signature header is missing', async () => {
    const req = new NextRequest(URL, {
      method: 'POST',
      body: '{}',
      headers: { 'Content-Type': 'application/json' },
      // no stripe-signature
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(mockCreateDonation).not.toHaveBeenCalled();
  });

  it('returns 400 when signature verification fails', async () => {
    mockGetStripe.mockReturnValue({
      webhooks: {
        constructEvent: vi.fn().mockImplementation(() => {
          throw new Error('No signatures found matching the expected signature for payload.');
        }),
      },
    });

    const res = await POST(webhookRequest('{}'));
    expect(res.status).toBe(400);
    expect(mockCreateDonation).not.toHaveBeenCalled();
  });

  it('returns 200 and saves donation for checkout.session.completed', async () => {
    const event = makeStripeEvent();
    mockGetStripe.mockReturnValue(makeStripeInstance(event));
    mockCreateDonation.mockResolvedValue({
      id: 'don-uuid-1',
      stripeSessionId: 'cs_test_abc123',
      amountCad: 100.00,
      donorName: 'Sara Hassan',
      donorEmail: 'sara@example.com',
      isAnonymous: false,
      status: 'completed',
      createdAt: new Date(),
    });

    const res = await POST(webhookRequest(JSON.stringify(event)));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
    expect(mockCreateDonation).toHaveBeenCalledWith(
      expect.objectContaining({
        stripeSessionId: 'cs_test_abc123',
        amountCad: 100.00,
        donorEmail: 'sara@example.com',
        isAnonymous: false,
      })
    );
  });

  it('calculates amountCad by dividing amount_total by 100', async () => {
    const event = makeStripeEvent({ amount_total: 5000 }); // $50.00
    mockGetStripe.mockReturnValue(makeStripeInstance(event));
    mockCreateDonation.mockResolvedValue({ id: 'x', amountCad: 50, donorEmail: 'a@b.com' });

    await POST(webhookRequest(JSON.stringify(event)));

    expect(mockCreateDonation).toHaveBeenCalledWith(
      expect.objectContaining({ amountCad: 50 })
    );
  });

  it('returns 200 without calling createDonation again for a duplicate session (idempotent)', async () => {
    const event = makeStripeEvent();
    mockGetStripe.mockReturnValue(makeStripeInstance(event));
    mockCreateDonation.mockResolvedValue(null); // ON CONFLICT DO NOTHING → null

    const res = await POST(webhookRequest(JSON.stringify(event)));

    expect(res.status).toBe(200);
    expect(mockCreateDonation).toHaveBeenCalledOnce(); // still called once, but no email sent
  });

  it('sets donorName to null for anonymous donations', async () => {
    const event = makeStripeEvent({
      metadata: {
        donorEmail: 'anon@example.com',
        isAnonymous: 'true',
        donorName: 'Hidden Name',
      },
    });
    mockGetStripe.mockReturnValue(makeStripeInstance(event));
    mockCreateDonation.mockResolvedValue(null);

    await POST(webhookRequest(JSON.stringify(event)));

    expect(mockCreateDonation).toHaveBeenCalledWith(
      expect.objectContaining({ donorName: null, isAnonymous: true })
    );
  });

  it('returns 500 when donor email is missing from session', async () => {
    const event = makeStripeEvent({
      customer_email: null,
      metadata: { isAnonymous: 'false' }, // no donorEmail in metadata either
    });
    mockGetStripe.mockReturnValue(makeStripeInstance(event));

    const res = await POST(webhookRequest(JSON.stringify(event)));
    expect(res.status).toBe(500);
    expect(mockCreateDonation).not.toHaveBeenCalled();
  });

  it('returns 500 when DB throws so Stripe retries the webhook', async () => {
    const event = makeStripeEvent();
    mockGetStripe.mockReturnValue(makeStripeInstance(event));
    mockCreateDonation.mockRejectedValue(new Error('db down'));

    const res = await POST(webhookRequest(JSON.stringify(event)));
    expect(res.status).toBe(500); // must be 5xx so Stripe retries
  });

  it('returns 200 for unhandled event types (not checkout.session.completed)', async () => {
    const event = { ...makeStripeEvent(), type: 'payment_intent.created' } as Stripe.Event;
    mockGetStripe.mockReturnValue(makeStripeInstance(event));

    const res = await POST(webhookRequest(JSON.stringify(event)));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
    expect(mockCreateDonation).not.toHaveBeenCalled();
  });
});
