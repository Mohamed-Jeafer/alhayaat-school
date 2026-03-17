---
id: doc-003
title: Database architecture review
type: other
created_date: '2026-03-17 12:14'
updated_date: '2026-03-17 12:20'
---
# Database architecture review

## Current architecture
- Runtime stack uses Next.js App Router with raw SQL via `pg` (`src/lib/db.ts`) rather than Prisma.
- Query helpers live in `src/lib/db/queries.ts`.
- Persisted flows currently implemented in the app are contact, newsletter, admissions application, careers/job application, Stripe donations, and admin donation listing.
- The public-site review is anchored to `al-hayaat.webflow/` as requested.

## Webflow reference basis
The review uses `al-hayaat.webflow/` as the public-site source of truth for the original user-facing flows, especially:
- `contact.html`
- `donate.html`
- `admission.html`
- `application.html`
- `careers.html`
- `detail_blog.html`

## Current schema sources
- Active schema source: `scripts/db/schema.sql`
- Supporting code: `src/lib/db.ts`, `src/lib/db/queries.ts`, `src/app/api/**`
- Drift sources: backlog/database tasks and older docs that still mention Prisma and a 5-table contract.

## Table-by-table review
### `contact_submissions`
- Keep.
- Benefit: captures direct school inquiries for future admin review/export.
- Current code path: `src/app/api/contact/route.ts` -> `createContactSubmission()`.
- Reference: `al-hayaat.webflow/contact.html`.
- Decision: keep optional `phone` support in the schema for parity/future flexibility, even though the current Next.js contact form only submits name/email/message.

### `job_applications`
- Keep, but align to the implemented careers flow.
- Benefit: stores structured hiring submissions and resume links for school staff review.
- Current code path: `src/app/api/jobs/apply/route.ts` -> `createJobApplication()`.
- Reference: `al-hayaat.webflow/application.html` and `al-hayaat.webflow/careers.html`.
- Decision: use semantic columns that match the live app (`applicant_name`, `applicant_email`, `applicant_phone`, `position_title`, `resume_blob_url`, `cover_letter`, `submitted_at`).
- Why: this removes the runtime drift between the SQL schema and the deployed route/query layer.

### `newsletter_subscribers`
- Keep.
- Benefit: stores footer sign-ups with soft reactivation via `active`.
- Current code path: `src/app/api/newsletter/subscribe/route.ts`.
- Reference: newsletter signup pattern across Webflow pages.
- Decision: keep the unique email constraint and avoid adding redundant extra indexing beyond what is needed.

### `donations`
- Keep.
- Benefit: powers Stripe webhook persistence, receipts, donor reporting, and the current admin donations screen.
- Current code paths: `src/app/api/stripe/webhook/route.ts`, `src/app/api/stripe/receipt/route.ts`, `src/app/admin/donations/page.tsx`.
- Reference: `al-hayaat.webflow/donate.html`.
- Decision: keep the current donation structure and donor email/date indexes.

### `applications`
- Keep.
- Benefit: persists the admissions workflow without forcing a brittle relational model for a nested multi-step form.
- Current code path: `src/app/api/application/route.ts`.
- Reference: `al-hayaat.webflow/admission.html` and `al-hayaat.webflow/application.html`.
- Decision: keep JSONB sections and add status/date indexes for future admin filtering.

### `users`
- Keep as groundwork.
- Benefit: preserves a clear place for admin-auth persistence once the auth work lands.
- Current status: not actively used by the app yet.
- Decision: keep the table minimal for now rather than over-designing auth fields before the final auth strategy is implemented.

## What was added or changed
- Enabled `pgcrypto` in `scripts/db/schema.sql` so `gen_random_uuid()` works reliably.
- Added compatibility logic so older `job_applications` columns can be reconciled on re-run.
- Added applicant phone persistence for the careers flow because the current form captures phone.
- Added indexes that support active or near-term workflows:
  - `idx_contact_created`
  - `idx_contact_email`
  - `idx_job_applications_submitted`
  - `idx_job_applications_status_submitted`
  - `idx_donations_created`
  - `idx_donations_email`
  - `idx_applications_submitted`
  - `idx_applications_status_submitted`
- Updated `scripts/db/verify.sql`, `scripts/db/seed.sql`, and `scripts/db/README.md` to reflect the current contract.

## What was intentionally not added yet
- No `blog_posts` table yet. `detail_blog.html` exists in Webflow, but blog persistence is not implemented in the current app.
- No `job_postings` table yet. Careers content currently lives in `src/content/careers.json`, so introducing a dynamic postings table now would be speculative scope.
- No expanded auth/session tables yet. `users` stays as groundwork until the auth implementation is finalized.
- No subject column was added to `contact_submissions`; the current submitted contact payload does not use one, even though some content/config files suggest earlier experimentation.

## Local verification outcome
- Schema applied successfully to local `alhayaat_db`.
- Verification script passed against the live local database.
- Seed data inserted successfully across the current six-table set.

## Recommended next actions
1. Decide whether the team wants admin screens for contact, admissions, careers, and newsletter data next; if yes, build those against the now-aligned schema.
2. Resolve separate non-database lint debt already present in the repository so green validation is easier to trust.
3. Keep backlog/database stories synchronized with future auth and CMS decisions to avoid repeating this drift.
