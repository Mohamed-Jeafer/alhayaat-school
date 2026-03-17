# Database Scripts

The current database layer uses raw SQL via `pg` (`src/lib/db.ts` and `src/lib/db/queries.ts`).
Use `al-hayaat.webflow/` as the public-site reference when validating why each table exists.

## Apply schema

```bash
psql $DATABASE_URL -f scripts/db/schema.sql
```

## Seed dev data

```bash
psql $DATABASE_URL -f scripts/db/seed.sql
```

## Verify schema

```bash
psql $DATABASE_URL -v ON_ERROR_STOP=1 -f scripts/db/verify.sql
```

## Current tables

| Table | Purpose | Current usage |
|-------|---------|---------------|
| `contact_submissions` | Contact form submissions from `/contact` | `src/app/api/contact/route.ts` |
| `job_applications` | Careers application submissions from `/careers/apply` | `src/app/api/jobs/apply/route.ts` |
| `newsletter_subscribers` | Footer newsletter sign-ups | `src/app/api/newsletter/subscribe/route.ts` |
| `donations` | Stripe-backed donations and receipt generation | `src/app/api/stripe/webhook/route.ts`, `src/app/admin/donations/page.tsx` |
| `applications` | Admissions / enrollment applications | `src/app/api/application/route.ts` |
| `users` | Admin/auth groundwork | planned admin authentication work |

## Notes

- `job_applications` intentionally uses semantic column names such as `applicant_name` and `resume_blob_url` to match the live code.
- `verify.sql` checks the active table set, critical columns, and required indexes.
- `seed.sql` inserts deterministic sample rows for each active workflow so local verification is easy to repeat.
