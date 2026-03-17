---
id: TASK-020
title: >-
  [P6c] Stripe webhook handler with signature verification and donation
  persistence
status: Done
assignee: []
created_date: '2026-03-15 13:12'
updated_date: '2026-03-15 21:21'
labels:
  - stripe
  - webhook
  - backend
  - P6
milestone: m-6
dependencies:
  - TASK-015
references:
  - .kiro/specs/phase-6-stripe-integration.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Story Type: PAYMENT

**Story**
As a payment processing system, I want Stripe webhook events verified and donation records persisted to the database, so that every completed payment is durably recorded and available for receipt generation and admin reporting.

**Business Context**
The existing Webflow integration has no server-side payment confirmation — donations are processed externally and never captured in school systems. This webhook handler is the authoritative record of every donation: it provides the data source for PDF receipts, admin dashboard totals, and tax reporting.

**Technical Specification**
- Rendering: N/A — API Route handler only
- Data: Raw body passed to `stripe.webhooks.constructEvent()`; on `checkout.session.completed` event → call `createDonation()` in `lib/db/queries.ts` using pool from `lib/db.ts`; SQL: `INSERT INTO donations ... ON CONFLICT (stripe_session_id) DO NOTHING`
- Infrastructure: App Service receives inbound webhook from Stripe; DB write to PostgreSQL Flexible Server
- Stack constraints: Stripe singleton from `lib/stripe.ts`; DB pool singleton from `lib/db.ts`; raw body parsing via `await req.text()` (must NOT use `req.json()` — body must be raw for signature verification); `export const dynamic = 'force-dynamic'` on route
- Phase dependencies: TASK-015 (P6a Stripe infrastructure), TASK-003 (DB schema)
- Spec reference: `.kiro/specs/phase-6-stripe-integration.md`

**Data Contract**
```typescript
// Donations table (SQL DDL)
CREATE TABLE donations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT NOT NULL UNIQUE,
  amount_cad       NUMERIC(10,2) NOT NULL,
  donor_name       TEXT,            -- NULL if is_anonymous
  donor_email      TEXT NOT NULL,
  donor_address    TEXT,
  is_anonymous     BOOLEAN NOT NULL DEFAULT FALSE,
  status           TEXT NOT NULL DEFAULT 'completed',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_donations_created_at ON donations (created_at DESC);

// lib/db/queries.ts
interface CreateDonationInput {
  stripeSessionId: string;
  amountCad: number;
  donorName: string | null;
  donorEmail: string;
  donorAddress?: string;
  isAnonymous: boolean;
}

interface Donation {
  id: string;
  stripeSessionId: string;
  amountCad: number;
  donorName: string | null;
  donorEmail: string;
  donorAddress: string | null;
  isAnonymous: boolean;
  status: string;
  createdAt: Date;
}

export async function createDonation(input: CreateDonationInput): Promise<Donation>
```

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| 400 | Invalid Stripe signature | Log ERR_STRIPE_INVALID_SIGNATURE; no DB write; Stripe does not retry |
| 500 | DB write failed | Log ERR_DB_WRITE_FAILED with session_id; Stripe retries up to 3× over 24h |
| 200 | Duplicate event (idempotent) | CONFLICT on stripe_session_id → DO NOTHING; return `{ received: true }` |
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given Stripe sends a checkout.session.completed event to /api/stripe/webhook, when the handler verifies the signature with STRIPE_WEBHOOK_SECRET, then the request is accepted and donation data is persisted to the donations table via lib/db.ts
- [ ] #2 Given an inbound webhook request has an invalid or missing stripe-signature header, when the handler attempts signature verification, then it returns HTTP 400 and logs ERR_STRIPE_INVALID_SIGNATURE to Application Insights without processing the event
- [ ] #3 Given the donation is persisted successfully, when createDonation completes, then the donations table row contains: stripe_session_id, amount_cad, donor_name (null if anonymous), donor_email, donor_address, status='completed', created_at
- [ ] #4 Given the database is unavailable during webhook processing, when createDonation throws, then the webhook returns HTTP 500 so Stripe retries, and the error is logged with full context to Application Insights (idempotency key included)
- [ ] #5 Given the same checkout.session.completed event is delivered twice (Stripe retry), when the handler processes it, then the duplicate is detected via stripe_session_id unique constraint and no duplicate donation row is created
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
POST /api/stripe/webhook with req.text() raw body parsing, stripe.webhooks.constructEvent signature verification, checkout.session.completed handler, createDonation via lib/db.ts singleton, idempotent via ON CONFLICT (stripe_session_id) DO NOTHING, non-blocking email fire-and-forget. Build clean.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 POST /api/stripe/webhook created with raw body parsing (no JSON body parser — required for signature verification)
- [ ] #3 Stripe signature verified using stripe.webhooks.constructEvent before any DB write
- [ ] #4 donations table created in DB with columns: id, stripe_session_id (UNIQUE), amount_cad, donor_name, donor_email, donor_address, is_anonymous, status, created_at
- [ ] #5 lib/db.ts singleton used for all DB operations — no inline Pool instantiation
- [ ] #6 Idempotency enforced via UNIQUE constraint on stripe_session_id; duplicate events silently accepted (HTTP 200) without creating duplicate rows
- [ ] #7 Data contract doc via `backlog doc create -t technical "Data contract: donations-table"` — record doc-NNN ID
- [ ] #8 Error dictionary doc via `backlog doc create -t reference "Error dictionary: stripe-webhook"` with codes: ERR_STRIPE_INVALID_SIGNATURE, ERR_DB_WRITE_FAILED, ERR_WEBHOOK_DUPLICATE
- [ ] #9 Application Insights structured log on each event received (event_type, session_id, amount, status)
- [ ] #10 Unit tests: valid signature + DB write, invalid signature returns 400, duplicate session returns 200 no-op, DB error returns 500
- [ ] #11 Webhook endpoint excluded from CSRF middleware
<!-- DOD:END -->
