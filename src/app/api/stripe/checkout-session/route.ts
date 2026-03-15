import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripe } from '@/lib/stripe';

const checkoutSchema = z.object({
  amount: z.number().int().min(1).max(100000),
  donorName: z.string().min(2).max(120),
  donorEmail: z.string().email(),
  donorAddress: z.string().max(300).optional(),
  isAnonymous: z.boolean(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const result = checkoutSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: result.error.flatten() },
      { status: 422 }
    );
  }

  const { amount, donorName, donorEmail, donorAddress, isAnonymous } = result.data;

  const appUrl = process.env.NEXT_PUBLIC_URL;
  if (!appUrl) {
    console.error('[checkout-session] NEXT_PUBLIC_URL is not set');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'Donation to Al-Hayaat School',
              description: 'Your donation supports academic excellence and spiritual development.',
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/donate`,
      customer_email: donorEmail,
      metadata: {
        donorName: isAnonymous ? 'Anonymous' : donorName,
        donorEmail,
        donorAddress: donorAddress ?? '',
        isAnonymous: String(isAnonymous),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout-session] Stripe error:', err);
    return NextResponse.json(
      { error: 'Payment service temporarily unavailable.' },
      { status: 500 }
    );
  }
}
