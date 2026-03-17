---
id: TASK-018
title: '[P6b] Donation page with preset amounts and Stripe Checkout redirect'
status: Done
assignee: []
created_date: '2026-03-15 13:12'
updated_date: '2026-03-15 21:21'
labels:
  - stripe
  - donation
  - P6
  - payment
milestone: m-6
dependencies:
  - TASK-015
references:
  - .kiro/specs/phase-6-stripe-integration.md
  - al-hayaat.webflow/donate.html
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Story Type: PAYMENT

**Story**
As a donor visiting the school website, I want to select a donation amount, provide my information, and be redirected to secure Stripe Checkout, so that I can complete my credit card donation in a trusted payment environment and support Al-Hayaat School.

**Business Context**
The Webflow donate page uses a bare static link to `buy.stripe.com` with no amount selection, no donor data capture, and no integration with school records. The migration builds a custom checkout flow that captures donor details, creates a Stripe Checkout Session with metadata, and stores data for receipt generation — replacing a single static button with a full-featured donation experience.

**Technical Specification**
- Rendering: Client Component for interactive form state (amount selection, form validation); page shell is SSG
- Data: Form state managed with `react-hook-form` + `zod`; POST to `/api/stripe/checkout-session` → server-side creates Stripe session via `lib/stripe.ts`; redirect to Stripe-hosted checkout URL returned in response
- Infrastructure: None new — App Service serves the page; Stripe hosts checkout
- Stack constraints: `shadcn/ui` form primitives (Input, Button, RadioGroup, Checkbox, Label); `react-hook-form` + `zod` validation; `next/image` for any imagery; amount presets and form labels sourced from `src/content/donate.json`; centralized Stripe singleton from `lib/stripe.ts`
- Phase dependencies: TASK-015 (P6a Stripe infrastructure), TASK-002 (Next.js init)
- Spec reference: `.kiro/specs/phase-6-stripe-integration.md`

**Data Contract**
```typescript
// POST /api/stripe/checkout-session
interface CheckoutSessionRequest {
  amount: number;           // CAD dollars (e.g., 50 — not cents)
  donorName: string;        // required
  donorEmail: string;       // required, valid email
  donorAddress?: string;    // optional, included in tax receipt
  isAnonymous: boolean;     // if true, donor name hidden in admin
}

interface CheckoutSessionResponse {
  url: string;              // Stripe-hosted checkout URL — redirect here
}

// Zod schema (server-side validation)
const checkoutSchema = z.object({
  amount: z.number().int().min(1).max(100000),
  donorName: z.string().min(2).max(120),
  donorEmail: z.string().email(),
  donorAddress: z.string().max(300).optional(),
  isAnonymous: z.boolean(),
})
```

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| 422 | Zod validation failed (invalid amount, bad email) | Inline field errors via react-hook-form; form stays mounted |
| 500 | Stripe API unavailable or key misconfigured | Toast: "Payment service temporarily unavailable. Try again or contact finance@alhayaat.ca" |
| 429 | Rate limit exceeded on checkout session creation | Toast: "Too many requests. Please wait a moment and try again." |

**Content Extraction**
- Source file: `al-hayaat.webflow/donate.html`
- Target file: `src/content/donate.json`
- Sections to extract: `donate-hero`, `donate-info`, `donate-payment-methods`, `donate-cta`
- Shared content: Footer CTA "Join Our Community" block → `_shared.json` (already present on other pages)
- Webflow markup patterns: Standard divs with utility classes (`section_donate`, `donate-card is-{color}`, `donate-content-wrapper`) — no `data-w-tab` or `w-slider`; straightforward extraction
- Extraction example:
```json
{
  "hero": {
    "id": "donate-hero",
    "headline": "Donate",
    "arabic_verse": "بِسْمِ اللّهِ الرَّحْمنِ الرَّحِيْمِ...",
    "verse_translation": "The example of those who spend their wealth in the way of Allah is like a seed [of grain] which grows seven spikes...",
    "verse_reference": "(Quran 2:261)"
  },
  "info": {
    "id": "donate-info",
    "subheadline": "Contribute Today For a Brighter Tomorrow",
    "body": "Thank you for considering to donate to Al-Hayaat. Your donations go the long way in making a difference in society...",
    "charity_note": "Al-Hayaat School is a registered charity. All donations made are eligible for an official tax receipt."
  },
  "payment_form": {
    "id": "donate-payment-form",
    "preset_amounts": [25, 50, 100, 250],
    "custom_label": "Custom amount",
    "cta_label": "Donate",
    "anonymous_label": "Make this donation anonymous"
  }
}
```
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the donor visits /donate, when the page renders, then the donation form displays preset amounts ($25, $50, $100, $250) as selectable radio options plus a custom amount input, all labels sourced from src/content/donate.json
- [ ] #2 Given the donor selects $50 and fills in name and email, when they click Donate, then a POST to /api/stripe/checkout-session is made and the browser redirects to the returned Stripe Checkout URL within 2 seconds
- [ ] #3 Given the donor submits the form with an invalid email, when the client validates the input, then an inline error message appears under the email field and no API call is made
- [ ] #4 Given the Stripe API returns a 500 error, when the donor submits the form, then a toast notification displays the error message and the form remains mounted with all values intact
- [ ] #5 Given the user is on a 375px wide screen, when the donate page renders, then preset amount buttons are full-width, the form is single-column, and no horizontal scroll occurs
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
src/app/donate/page.tsx (SSG, Arabic verse, charity info, other payment methods). src/components/donate/DonationForm.tsx (Client Component, preset amounts $25/$50/$100/$250, react-hook-form + zod, anonymous checkbox). POST /api/stripe/checkout-session (Zod validation, Stripe checkout session, CAD). src/content/donate.json sourced from al-hayaat.webflow/donate.html.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 src/content/donate.json created with all sections following {page}-{section}-{element} ID convention
- [ ] #3 All form labels, preset amounts, and page copy sourced from donate.json — no hardcoded strings in JSX
- [ ] #4 POST /api/stripe/checkout-session endpoint created; OpenAPI spec doc via `backlog doc create -t technical "API spec: POST /api/stripe/checkout-session"` — record doc-NNN ID
- [ ] #5 Data contract doc via `backlog doc create -t technical "Data contract: checkout-session"` — record doc-NNN ID
- [ ] #6 Stripe singleton used from lib/stripe.ts — no inline instantiation
- [ ] #7 Zod schema validates server-side; react-hook-form validates client-side
- [ ] #8 Rate limiting applied to /api/stripe/checkout-session (max 10 req/min per IP)
- [ ] #9 Application Insights logs checkout session creation and any 4xx/5xx
- [ ] #10 WCAG 2.1 AA: form labels associated with inputs, error messages announced via aria-live
- [ ] #11 Lighthouse Performance >90, Accessibility >95 on /donate
- [ ] #12 Corresponding [P6a] Verify Stripe Infrastructure task in Backlog.md marked Done before this story starts
<!-- DOD:END -->
