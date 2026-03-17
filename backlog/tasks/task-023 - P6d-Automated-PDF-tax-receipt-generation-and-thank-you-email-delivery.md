---
id: TASK-023
title: '[P6d] Automated PDF tax receipt generation and thank-you email delivery'
status: Done
assignee: []
created_date: '2026-03-15 13:13'
updated_date: '2026-03-15 21:21'
labels:
  - stripe
  - email
  - pdf
  - receipt
  - P6
milestone: m-6
dependencies:
  - TASK-020
references:
  - .kiro/specs/phase-6-stripe-integration.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Story Type: PAYMENT

**Story**
As a donor who has completed a donation, I want to receive an automated thank-you email with an official PDF tax receipt attached, so that I have the documentation I need to claim my charitable donation with the CRA.

**Business Context**
Al-Hayaat School is a registered charity — tax receipts are a legal obligation, not a nice-to-have. The current Webflow flow issues no automated receipts; the finance team manually emails receipts. Automating this via PDF generation (react-pdf) and Resend email delivery eliminates manual work and ensures every donor receives their receipt within seconds of completing payment.

**Technical Specification**
- Rendering: N/A — server-side PDF generation and email dispatch triggered from webhook handler
- Data: `Donation` record from `lib/db/queries.ts`; PDF generated via `lib/pdf/receipt.tsx` using `@react-pdf/renderer`; email sent via `lib/email/donations.ts` using Resend SDK with React Email template in `lib/email/templates/donation-thank-you.tsx`; email body copy from `src/content/donate.json`
- Infrastructure: Resend transactional email (from address: noreply@alhayaat.ca); `RESEND_API_KEY` in Azure Key Vault; no new Azure services required
- Stack constraints: `npm install @react-pdf/renderer resend @react-email/components`; email send must be non-blocking (fire-and-handle-error) to prevent Stripe retry on email failure; all email copy sourced from content JSON
- Phase dependencies: TASK-020 (P6c webhook handler), TASK-015 (P6a Stripe infrastructure)
- Spec reference: `.kiro/specs/phase-6-stripe-integration.md`

**Data Contract**
```typescript
// lib/pdf/receipt.tsx
interface ReceiptData {
  id: string;              // Receipt number (donation UUID)
  donorName: string;       // "Anonymous Donor" if is_anonymous
  donorAddress: string | null;
  amountCad: number;
  createdAt: Date;
  charityRegNumber: string; // CRA charity registration number
}

export async function generateReceipt(donation: Donation): Promise<Buffer>

// lib/email/donations.ts
interface ThankYouEmailInput {
  to: string;              // donor_email
  donorName: string;       // "Anonymous Donor" if is_anonymous
  amountCad: number;
  receiptPdf: Buffer;
  receiptNumber: string;   // donation.id
}

export async function sendThankYouEmail(input: ThankYouEmailInput): Promise<void>
```

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| ERR_PDF_GENERATION_FAILED | react-pdf render threw | Log to App Insights with donation_id; webhook returns 200 (don't retry for PDF failure) |
| ERR_EMAIL_SEND_FAILED | Resend API unavailable or rejected | Log to App Insights with donation_id and resend error; webhook returns 200; admin can regenerate manually |
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given a donation is persisted by the webhook handler, when generateReceipt is called with the donation record, then a PDF is produced containing: school name, charity registration number, receipt number (donation.id), date, donor name, donor address, amount in CAD, and a CRA-compliant tax receipt statement
- [ ] #2 Given a PDF receipt is generated, when sendThankYouEmail is called, then Resend delivers an email to donor_email with the PDF attached, subject 'Thank you for your donation to Al-Hayaat School', and the body copy sourced from src/content/donate.json
- [ ] #3 Given the donor marked is_anonymous=true, when the receipt PDF is generated, then the donor name field displays 'Anonymous Donor' and the receipt is still emailed to donor_email
- [ ] #4 Given Resend is unavailable when the email is sent, when sendThankYouEmail throws, then the error is caught, logged to Application Insights with ERR_EMAIL_SEND_FAILED, and the webhook still returns HTTP 200 (email failure does not cause Stripe retry)
- [ ] #5 Given a receipt is generated for a $100 donation on 2026-03-15, when the PDF renders, then the amount displays as '$100.00 CAD' and the date displays as 'March 15, 2026'
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
src/lib/pdf/receipt.tsx (A4 PDF via @react-pdf/renderer, CRA-compliant fields). src/lib/email/templates/donation-thank-you.tsx (React Email template). src/lib/email/donations.ts (Resend with PDF attachment, non-blocking). GET /api/stripe/receipt (downloads PDF by session_id). Webhook updated with fire-and-forget email chain.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 lib/pdf/receipt.tsx created using @react-pdf/renderer; DonationReceipt component renders A4 page with all CRA-required fields
- [ ] #3 lib/email/donations.ts created using Resend SDK; RESEND_API_KEY stored in Azure Key Vault
- [ ] #4 lib/email/templates/donation-thank-you.tsx React Email template created; all copy sourced from src/content/donate.json (thank-you email section)
- [ ] #5 Resend API key stored in Azure Key Vault as RESEND_API_KEY — not in source code
- [ ] #6 Email send is non-blocking for webhook response (fire-and-handle-error pattern, not await-and-fail)
- [ ] #7 Error dictionary doc via `backlog doc create -t reference "Error dictionary: donation-email"` with ERR_EMAIL_SEND_FAILED, ERR_PDF_GENERATION_FAILED
- [ ] #8 Data contract doc via `backlog doc create -t technical "Data contract: donation-receipt"` — record doc-NNN ID
- [ ] #9 Application Insights logs: receipt generated (donation_id, pdf_size_kb), email sent (to, donation_id, resend_id), or failure with full context
- [ ] #10 Unit test: generateReceipt returns Buffer with valid PDF headers; sendThankYouEmail calls Resend with correct params; email failure does not throw (webhook safe)
<!-- DOD:END -->
