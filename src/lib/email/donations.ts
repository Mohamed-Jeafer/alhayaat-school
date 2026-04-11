import { render } from '@react-email/render';
import { sendMail } from './client';
import { DonationThankYouEmail } from './templates/donation-thank-you';
import type { Donation } from '@/lib/db/queries';
import donateContent from '@/content/donate.json';

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

  await sendMail({
    to: donation.donorEmail,
    subject: `Thank you for your donation to Al-Hayaat School`,
    html,
    attachments: [
      {
        filename: `receipt-${donation.id.substring(0, 8)}.pdf`,
        content: receiptPdf,
        contentType: 'application/pdf',
      },
    ],
  });
}
