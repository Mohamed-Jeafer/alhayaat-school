---
id: TASK-025
title: '[P6e] Donation success confirmation page with receipt download'
status: Done
assignee: []
created_date: '2026-03-15 13:14'
updated_date: '2026-03-15 21:21'
labels:
  - stripe
  - success-page
  - P6
  - payment
milestone: m-6
dependencies:
  - TASK-020
  - TASK-023
references:
  - .kiro/specs/phase-6-stripe-integration.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Story Type: PAYMENT

**Story**
As a donor who has completed a payment on Stripe Checkout, I want to see a confirmation page with my donation details and a receipt download link, so that I have immediate confirmation my donation was received and can access my tax receipt on demand.

**Business Context**
After completing payment on Stripe, donors currently land on an unbranded Stripe success page with no school context, no receipt download, and no next steps. This story builds the branded `/donate/success` page that confirms the donation, provides the downloadable PDF tax receipt, and guides donors toward further engagement with the school community.

**Technical Specification**
- Rendering: Server Component (SSR) — `session_id` query param used to retrieve Stripe session server-side; prevents client-side exposure of session details
- Data: `session_id` from `searchParams`; `stripe.checkout.sessions.retrieve(sessionId)` via `lib/stripe.ts` singleton; receipt download via `GET /api/stripe/receipt?session_id=xxx` which fetches from DB and calls `generateReceipt()`; page copy from `src/content/donate.json`
- Infrastructure: None new
- Stack constraints: Server Component; `shadcn/ui` Button and Alert; `next/link` for CTAs; `next/image` for any imagery; all copy from content JSON
- Phase dependencies: TASK-020 (P6c webhook), TASK-023 (P6d receipt generation)
- Spec reference: `.kiro/specs/phase-6-stripe-integration.md`

**Data Contract**
```typescript
// GET /api/stripe/receipt?session_id=cs_xxx
// Response: application/pdf with header:
//   Content-Disposition: attachment; filename="receipt-{id}.pdf"

// Server Component data retrieval
interface SuccessPageData {
  donorName: string;
  amountCad: number;
  donationDate: string;        // ISO 8601
  receiptDownloadUrl: string;  // /api/stripe/receipt?session_id=xxx
}
```

**Content Extraction**
- Source file: N/A — success page is new (no Webflow equivalent)
- Target file: `src/content/donate.json` (add `donate-success` section)
- Sections to add: `donate-success-headline`, `donate-success-body`, `donate-success-receipt-cta`, `donate-success-home-cta`
- Extraction example:
```json
{
  "success": {
    "id": "donate-success",
    "headline": "Thank You for Your Donation!",
    "body": "Your generous contribution helps shape the next generation. A tax receipt has been emailed to you.",
    "receipt_cta": "Download Receipt",
    "home_cta": "Return to Home"
  }
}
```

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| Missing session_id | URL navigated to directly without Stripe redirect | Redirect to /donate?error=invalid-session |
| Stripe session not found | session_id expired or invalid | Redirect to /donate?error=session-not-found |
| DB donation not found | Webhook not yet processed (race) | Show "Your receipt is being prepared. Check your email shortly." (no download button) |
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given Stripe redirects the donor to /donate/success?session_id=cs_xxx, when the success page server-renders, then the donor's name, donation amount in CAD, and a formatted date are displayed, all sourced from the Stripe session retrieved server-side via lib/stripe.ts
- [ ] #2 Given the donor lands on the success page, when the page renders, then a 'Download Receipt' button is visible that triggers a GET to /api/stripe/receipt?session_id=cs_xxx and downloads the PDF receipt
- [ ] #3 Given a session_id is missing or invalid in the query string, when the page attempts to retrieve the session, then the user is redirected to /donate with a query param `?error=invalid-session` and a toast error message
- [ ] #4 Given the success page renders, when the user clicks 'Return to Home', then they are navigated to / using Next.js Link (no full page reload)
- [ ] #5 Given the user is on a 375px wide screen, when the success page renders, then all text is readable, the Download Receipt button is full-width, and no horizontal scroll occurs
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
src/app/donate/success/page.tsx (Server Component): retrieves Stripe session server-side, queries DB by stripe_session_id, displays donor name + formatted CAD amount + date, receipt download button (only when DB record exists), amber notice on webhook race condition, redirects on missing/invalid session_id.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 app/donate/success/page.tsx created as Server Component; Stripe session retrieved server-side using getStripe() singleton
- [ ] #3 GET /api/stripe/receipt?session_id=xxx endpoint created; fetches donation from DB by stripe_session_id, calls generateReceipt, returns PDF with Content-Disposition: attachment
- [ ] #4 All page text (thank-you message, CTA labels) sourced from src/content/donate.json (donate-success section)
- [ ] #5 Missing/invalid session_id redirects to /donate with error param — no unhandled 500
- [ ] #6 Data contract doc via `backlog doc create -t technical "API spec: GET /api/stripe/receipt"` — record doc-NNN ID
- [ ] #7 WCAG 2.1 AA: receipt download button has descriptive aria-label, success heading is H1
- [ ] #8 Lighthouse Performance >90, Accessibility >95 on /donate/success
- [ ] #9 Visual comparison against design spec at 375px, 768px, 1440px
<!-- DOD:END -->
