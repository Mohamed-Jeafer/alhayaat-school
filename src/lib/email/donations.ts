import { Resend } from 'resend';
import { render } from '@react-email/render';
import { DonationThankYouEmail } from './templates/donation-thank-you';
import type { Donation } from '@/lib/db/queries';
import donateContent from '@/content/donate.json';

let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('ERR_EMAIL_NOT_CONFIGURED: RESEND_API_KEY is not set');
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

export interface ThankYouEmailInput {
  donation: Donation;
  receiptPdf: Buffer;
}

export async function sendThankYouEmail({ donation, receiptPdf }: ThankYouEmailInput): Promise<void> {
  const donorDisplayName = donation.isAnonymous
    ? 'Anonymous Donor'
    : (donation.donorName ?? 'Donor');

  const donationDate = new Date(donation.createdAt).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const successContent = donateContent.sections.success;

  const html = await render(
    DonationThankYouEmail({
      donorName: donorDisplayName,
      amountCad: donation.amountCad,
      receiptNumber: donation.id.toUpperCase(),
      donationDate,
      bodyText: successContent.body,
      charityNote: donateContent.sections.info.charity_note,
    })
  );

  await getResend().emails.send({
    from: 'Al-Hayaat School <noreply@alhayaat.ca>',
    to: donation.donorEmail,
    subject: `Thank you for your donation to Al-Hayaat School`,
    html,
    attachments: [
      {
        filename: `receipt-${donation.id.substring(0, 8)}.pdf`,
        content: receiptPdf,
      },
    ],
  });
}
