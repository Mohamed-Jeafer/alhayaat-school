---
id: TASK-003
title: >-
  [P0] Deploy database schema so the application has persistent storage for form
  submissions and user data
status: In Progress
assignee:
  - Copilot
created_date: '2026-03-15 10:51'
updated_date: '2026-03-17 12:20'
labels:
  - phase-0
  - database
milestone: m-0
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a developer on the Al-Hayaat project, I want the PostgreSQL schema to match the current Next.js implementation and the public workflows referenced in `al-hayaat.webflow/`, so that form submissions, donations, applications, and admin data views persist reliably without schema drift.

**Business Context**
The project has moved beyond planning: API routes and admin views already depend on PostgreSQL through raw SQL query helpers. Outdated backlog/docs still describe Prisma and a 5-table design, which creates operational risk and can hide runtime failures.

**Technical Specification**
- Rendering: N/A — data layer and schema alignment
- Data: Raw SQL schema, verification SQL, and related docs
- Active persistence workflows: contact, newsletter, Stripe donations, admissions applications, careers/job applications, and admin-user groundwork
- Stack constraints: raw SQL via `pg`, parameterized queries, singleton pool in `src/lib/db.ts`
- Key references: `scripts/db/schema.sql`, `src/lib/db.ts`, `src/lib/db/queries.ts`, `src/app/api/**`, `al-hayaat.webflow/`
- Review requirement: validate whether each table is still needed, whether fields/indexes align with current usage, and whether additional tables/columns should be introduced only where justified by implemented or clearly committed flows

**Current Review Findings**
- Raw SQL via `pg` is the live architecture; Prisma is not in use.
- The schema source of truth is `scripts/db/schema.sql`.
- The careers/job application table definition is out of sync with the live query layer.
- Supporting docs/scripts (`verify.sql`, `seed.sql`, README, backlog stories) need to be brought up to date alongside the schema.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Given the current Next.js app architecture and Webflow reference flows in `al-hayaat.webflow/`, when the database task is reviewed, then the backlog story and technical scope reflect the active raw-SQL `pg` implementation instead of outdated Prisma/5-table assumptions.
When scripts/db/schema.sql is executed
Then all 5 tables are created with correct columns, data types, and constraints
When the developer executes psql $DATABASE_URL -f scripts/db/schema.sql
Then all 5 tables are created in the public schema without errors
- [x] #2 Given `scripts/db/schema.sql` is the schema source of truth, when the schema is aligned with the current application code, then all persisted workflows are represented correctly: contact submissions, newsletter subscribers, donations, admissions applications, career/job applications, and admin-user groundwork.
When a SELECT query runs against each table
Then all tables return 0 rows with no errors
When the developer queries pg_indexes for the public schema
Then 3 indexes exist: idx_contact_created, idx_applications_created, idx_donations_created
- [x] #3 Given the careers application flow is implemented via `src/app/api/jobs/apply/route.ts` and `src/lib/db/queries.ts`, when the schema is updated, then the table/column definitions match the code paths without runtime column mismatches.
When \d+ is used to inspect each table
Then all expected indexes exist on the correct columns
When the developer executes psql $DATABASE_URL -f scripts/db/seed.sql
Then sample data is inserted and SELECT COUNT(*) on each table returns > 0 rows
- [x] #4 Given the local PostgreSQL database is available, when the schema is applied to `alhayaat_db`, then the expected tables, constraints, and indexes are created successfully and the schema remains safe to re-run.
When schema.sql is executed again
Then no error is thrown and all tables remain unchanged (CREATE TABLE IF NOT EXISTS)
When the developer re-runs scripts/db/schema.sql
Then no errors occur and existing data is preserved
- [x] #5 Given the database task is completed, when future engineers review the backlog and docs, then they can see the architecture review rationale, current schema decisions, and references back to `al-hayaat.webflow/` and current app files.
When multiple API routes import from lib/db.ts
Then only one Pool instance exists in memory per process
When multiple concurrent queries execute
Then connections are reused from the pool and no connection limit errors occur
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Reconcile the task with the current app architecture by reviewing `src/lib/db.ts`, `src/lib/db/queries.ts`, the active API routes, and Webflow references in `al-hayaat.webflow/`.
2. Update the task story, technical scope, and acceptance criteria so the task reflects the current raw-SQL `pg` architecture and the actual persisted workflows: contact, newsletter, donations, admissions applications, career applications, and admin-auth groundwork.
3. Align `scripts/db/schema.sql` with the live code paths, especially fixing schema drift between the job/careers application table definition and `createJobApplication()` / `POST /api/jobs/apply`.
4. Add or update supporting verification/documentation assets so the schema can be checked locally after deployment.
5. Apply the schema to the local `alhayaat_db` database and verify the expected tables and indexes exist.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Architecture review completed against current Next.js app and `al-hayaat.webflow/`. Findings: the project uses raw SQL via `pg`, not Prisma; `scripts/db/schema.sql` is the active schema source; backlog/docs are stale; and the careers/job application schema currently drifts from `src/lib/db/queries.ts` and `src/app/api/jobs/apply/route.ts`.

Implemented schema alignment in `scripts/db/schema.sql`, including `pgcrypto`, replay-safe compatibility handling for legacy `job_applications` columns, semantic careers columns that match the live query layer, applicant phone persistence, and indexes for active workflows. Applied the schema locally to `alhayaat_db`, ran `scripts/db/verify.sql`, and seeded deterministic sample rows across all six current tables.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
scripts/db/schema.sql created (5 tables, idempotent IF NOT EXISTS, UUID PKs, donations table Stripe-ready with stripe_session_id UNIQUE). lib/db.ts singleton pg Pool. src/lib/db/queries.ts with typed helpers: createDonation, listDonations, createContactSubmission, upsertNewsletterSubscriber.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 DB client uses singleton from lib/db.ts (no inline instantiation)
- [ ] #3 scripts/db/verify.sql confirms all tables and indexes
- [ ] #4 Verification script passes (scripts/verify/db-check.sh)
- [ ] #5 Corresponding [P0] Verify Database Schema Deployment task in Backlog.md marked Done
- [ ] #6 Data contract doc created via backlog doc create -t technical 'Data contract: DB schema' - record doc-NNN ID here
- [ ] #7 Error dictionary doc created via backlog doc create -t reference 'Error dictionary: ERR_DB_UNREACHABLE, ERR_DB_PERMISSION_DENIED' - record doc-NNN ID here
<!-- DOD:END -->
