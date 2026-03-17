import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getStripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import type { Donation } from '@/lib/db/queries';
import donateContent from '@/content/donate.json';
import { logger } from '@/lib/logger';

export const metadata: Metadata = {
  title: 'Thank You | Al-Hayaat School',
  description: 'Your donation to Al-Hayaat School has been received.',
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string; error?: string }>;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function getDonationBySession(sessionId: string): Promise<Donation | null> {
  try {
    const { rows } = await db.query<Donation>(
      `SELECT id, stripe_session_id AS "stripeSessionId", amount_cad AS "amountCad",
              donor_name AS "donorName", donor_email AS "donorEmail",
              donor_address AS "donorAddress", is_anonymous AS "isAnonymous",
              status, created_at AS "createdAt"
       FROM   donations
       WHERE  stripe_session_id = $1`,
      [sessionId]
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export default async function DonateSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    redirect('/donate?error=invalid-session');
  }

  let sessionAmount: number | null = null;
  let sessionDonorName: string | null = null;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    sessionAmount = session.amount_total ? session.amount_total / 100 : null;
    const isAnon = session.metadata?.isAnonymous === 'true';
    sessionDonorName = isAnon ? 'Anonymous Donor' : (session.metadata?.donorName ?? null);
  } catch (err) {
    logger.error('Failed to retrieve Stripe session', err, 'donate/success');
    redirect('/donate?error=session-not-found');
  }

  const donation = await getDonationBySession(sessionId);

  const { success } = donateContent.sections;
  const displayName = donation?.isAnonymous
    ? 'Anonymous Donor'
    : (donation?.donorName ?? sessionDonorName ?? 'Donor');
  const displayAmount = donation?.amountCad ?? sessionAmount;
  const displayDate = donation?.createdAt ? formatDate(donation.createdAt) : formatDate(new Date());

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm">
        {/* Success icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          {success.headline}
        </h1>

        {/* Donation summary */}
        <div className="my-6 rounded-lg bg-blue-50 px-6 py-4 text-center">
          {displayName && (
            <p className="text-sm text-gray-600">
              Thank you, <span className="font-semibold">{displayName}</span>
            </p>
          )}
          {displayAmount !== null && (
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {formatAmount(displayAmount)}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">{displayDate}</p>
        </div>

        {/* Body */}
        <p className="mb-6 text-center leading-relaxed text-gray-600">
          {success.body}
        </p>

        {/* Webhook race condition: donation not yet in DB */}
        {!donation && (
          <div
            className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-center"
            role="status"
          >
            <p className="text-sm text-amber-800">
              Your receipt is being prepared. Check your email shortly — it will arrive within a few
              minutes.
            </p>
          </div>
        )}

        {/* CTAs */}
        <div className="space-y-3">
          {donation && (
            <a
              href={`/api/stripe/receipt?session_id=${sessionId}`}
              className="flex w-full items-center justify-center rounded-md bg-green-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-800"
              aria-label="Download your official PDF tax receipt"
            >
              {success.receipt_cta}
            </a>
          )}
          <Link
            href="/"
            className="flex w-full items-center justify-center rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            {success.home_cta}
          </Link>
        </div>
      </div>
    </main>
  );
}
