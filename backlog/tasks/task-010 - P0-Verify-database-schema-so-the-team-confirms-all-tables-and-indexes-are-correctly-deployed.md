---
id: TASK-010
title: >-
  [P0] Verify database schema so the team confirms all tables and indexes are
  correctly deployed
status: To Do
assignee: []
created_date: '2026-03-15 10:52'
updated_date: '2026-03-15 12:56'
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
As a developer on the Al-Hayaat project, I want to run SQL verification queries against the dev database, so that I can confirm all 5 tables, columns, indexes, and seed data are correctly deployed before building API routes that depend on them.

**Business Context**
A missing table or index in the database silently breaks API routes and form submissions in later phases. Verification catches schema drift early and ensures the data layer matches the documented contract in docs/database-schema.md.

**Technical Specification**
- Rendering: N/A — database verification only
- Data: SQL verification queries against PostgreSQL dev database
- Infrastructure: Azure PostgreSQL Flexible Server (dev environment)
- Stack constraints: `psql` CLI with $DATABASE_URL from Key Vault, raw SQL verification queries
- Phase dependencies: TASK-003 (schema must be deployed), TASK-006 (PostgreSQL server must be provisioned)
- Spec reference: `.kiro/specs/phase-0-infrastructure-setup.md`

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| Connection refused | PostgreSQL unreachable from client | Verify firewall rules allow client IP |
| Table not found | Schema not deployed | Re-run scripts/db/schema.sql |
| Index missing | Index creation failed silently | Check schema.sql for CREATE INDEX statements |

**Recommended Skills**
- `#senior-backend` — database verification, PostgreSQL administration

**Story Points**: 1
*Sizing rationale: Single verification script with SQL queries — minimal complexity.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given TASK-003 is complete - When scripts/db/verify.sql executes - Then all 5 tables exist with correct column names and data types confirmed
When the developer runs psql $DATABASE_URL -f scripts/db/verify.sql
Then the script exits with code 0 and confirms all checks pass
- [ ] #2 Given the schema is deployed - When psql inspects each table - Then correct columns and constraints appear for all 5 tables
When the developer queries information_schema.tables for the public schema
Then exactly 5 tables are returned
- [ ] #3 Given the tables exist - When indexes are listed - Then all expected indexes are present on the correct columns
When the developer queries each table's column list
Then all expected columns are present with correct data types
- [ ] #4 Given the schema includes index definitions - When scripts/db/seed.sql is executed - Then each table has at least 1 row confirmed by SELECT COUNT(*)
When the developer queries pg_indexes
Then 3 indexes exist: idx_contact_created, idx_applications_created, idx_donations_created
- [ ] #5 Edge case: seed data - Given seed.sql is executed - When SELECT COUNT(*) runs on each table - Then each table returns a row count greater than 0
When the developer runs SELECT COUNT(*) on each seeded table
Then each table returns > 0 rows
- [ ] #6 Edge case: missing table - Given the donations table was not created - When verify.sql runs - Then it prints FAIL for the donations table check and exits with code 1
When the verification script runs
Then it reports FAIL for donations table with the expected CREATE TABLE statement
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 scripts/db/verify.sql exits with code 0
- [ ] #2 All 5 tables confirmed with correct columns
- [ ] #3 All 3 indexes confirmed present
- [ ] #4 Seed data verified with row counts > 0
- [ ] #5 TASK-003 confirmed complete
<!-- DOD:END -->
