---
id: TASK-010
title: '[P0] Verify Database Schema Deployment'
status: To Do
assignee: []
created_date: '2026-03-15 10:52'
updated_date: '2026-03-15 10:58'
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
Run SQL verification queries to confirm all tables, columns, and indexes were created correctly in the dev database.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 psql $DATABASE_URL -f scripts/db/verify.sql exits with code 0
- [ ] #2 Query confirms 5 tables exist in public schema
- [ ] #3 Query confirms all expected columns present on each table
- [ ] #4 Query confirms 3 indexes exist (idx_contact_created, idx_applications_created, idx_donations_created)
- [ ] #5 psql $DATABASE_URL -f scripts/db/seed.sql runs without error
- [ ] #6 SELECT COUNT(*) on each seeded table returns > 0 rows
<!-- AC:END -->
