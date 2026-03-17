---
id: TASK-010
title: >-
  [P0] Verify database schema so the team confirms all tables and indexes are
  correctly deployed
status: In Progress
assignee:
  - Copilot
created_date: '2026-03-15 10:52'
updated_date: '2026-03-17 12:20'
labels:
  - phase-0
  - database
  - verification
milestone: m-0
dependencies:
  - TASK-003
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a developer on the Al-Hayaat project, I want a repeatable verification workflow for the current PostgreSQL schema, so that the team can confirm the deployed tables, columns, and indexes match the active application code before building more database-dependent features.

**Business Context**
Verification must now validate the real application contract instead of an outdated planning snapshot. Without current verification, schema drift can break submissions, donations, and admin pages silently.

**Technical Specification**
- Rendering: N/A — database verification only
- Data: verification SQL and documented verification commands against local PostgreSQL
- Scope: validate the actual current table set and critical columns/indexes used by `src/lib/db/queries.ts` and the active API/admin surfaces
- Stack constraints: `psql` against the active `DATABASE_URL` / local `alhayaat_db`
- References: `scripts/db/schema.sql`, `scripts/db/verify.sql`, `src/lib/db/queries.ts`, `src/app/api/**`, `al-hayaat.webflow/`
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Given the current schema contract, when verification runs, then it confirms the actual expected table set and key columns used by the implemented app routes rather than an outdated 5-table snapshot.
When the developer runs psql $DATABASE_URL -f scripts/db/verify.sql
Then the script exits with code 0 and confirms all checks pass
- [x] #2 Given local PostgreSQL access is now working, when the verification workflow is executed against `alhayaat_db`, then it confirms all required tables and indexes exist with no schema drift against the current code paths.
When the developer queries information_schema.tables for the public schema
Then exactly 5 tables are returned
- [x] #3 Given the schema may evolve as more admin features are implemented, when verification documentation is updated, then it clearly identifies which checks validate active production-critical workflows versus future/planned tables.
When the developer queries each table's column list
Then all expected columns are present with correct data types
When the developer queries pg_indexes
Then 3 indexes exist: idx_contact_created, idx_applications_created, idx_donations_created
When the developer runs SELECT COUNT(*) on each seeded table
Then each table returns > 0 rows
When the verification script runs
Then it reports FAIL for donations table with the expected CREATE TABLE statement
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define verification around the current schema, not the stale 5-table contract.
2. Add/refresh a verification script or documented verification commands for local PostgreSQL using the active `DATABASE_URL` / `psql` workflow.
3. Verify the final table set, key columns, and indexes required by the implemented app routes and admin queries.
4. Capture the verification outcome and any follow-up schema recommendations in the task notes and linked documentation.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
TASK-010 is being advanced together with TASK-003 because the existing verification story is based on an outdated 5-table assumption and must be updated to validate the actual current schema surface.

Updated `scripts/db/verify.sql` to assert the current six-table contract, critical columns, and required indexes. Verified the script passes locally against `alhayaat_db` after schema application and seed insertion.

Verification workflow now reflects the real six-table contract and passes locally after schema application.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 scripts/db/verify.sql exits with code 0
- [ ] #2 All 5 tables confirmed with correct columns
- [ ] #3 All 3 indexes confirmed present
- [ ] #4 Seed data verified with row counts > 0
- [ ] #5 TASK-003 confirmed complete
- [ ] #6 scripts/db/verify.sql exits with code 0
- [ ] #7 All 5 tables confirmed with correct columns
- [ ] #8 All 3 indexes confirmed present
- [ ] #9 Seed data verified with row counts > 0
- [ ] #10 TASK-003 confirmed complete
<!-- DOD:END -->
