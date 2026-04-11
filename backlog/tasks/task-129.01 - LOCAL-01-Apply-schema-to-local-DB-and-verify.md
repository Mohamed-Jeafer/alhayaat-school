---
id: TASK-129.01
title: 'LOCAL-01: Apply schema to local DB and verify'
status: To Do
assignee: []
created_date: '2026-04-11 13:21'
labels:
  - local
dependencies: []
parent_task_id: TASK-129
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Prerequisite for all local tests. Apply schema.sql to local alhayaat_db and confirm all 6 tables and 8 indexes exist.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 psql runs schema.sql with no errors (idempotent - safe to re-run)
- [ ] #2 verify.sql exits with 'Schema verification passed' and lists 6 tables: contact_submissions, job_applications, newsletter_subscribers, donations, applications, users
- [ ] #3 8 indexes confirmed present
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Ensure local PostgreSQL is running
2. Run: psql $DATABASE_URL -f scripts/db/schema.sql
3. Run: psql $DATABASE_URL -v ON_ERROR_STOP=1 -f scripts/db/verify.sql
4. Confirm output shows all tables and indexes
<!-- SECTION:PLAN:END -->
