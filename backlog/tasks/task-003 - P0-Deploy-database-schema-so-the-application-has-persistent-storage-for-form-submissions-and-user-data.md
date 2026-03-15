---
id: TASK-003
title: >-
  [P0] Deploy database schema so the application has persistent storage for form
  submissions and user data
status: To Do
assignee: []
created_date: '2026-03-15 10:51'
updated_date: '2026-03-15 12:55'
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
As a developer on the Al-Hayaat project, I want the PostgreSQL database schema deployed with all 5 tables, indexes, and seed data, so that API routes and form submissions have a tested, production-ready data layer to write against.

**Business Context**
The Webflow site stores form submissions in Webflow's proprietary CMS with no export capability and no relational integrity. Migrating to PostgreSQL with a well-defined schema enables structured queries, data exports, and integration with the admin dashboard (P5) and Stripe donations (P6).

**Technical Specification**
- Rendering: N/A — database-only task
- Data: Raw SQL schema file creating 5 tables with parameterized indexes; seed data for dev testing
- Infrastructure: Azure PostgreSQL Flexible Server (B1ms for dev, D2s_v3 for prod)
- Stack constraints: Raw SQL only (no ORM), pg library for connections, parameterized queries ($1, $2), connection pooling via `lib/db.ts` singleton
- Phase dependencies: TASK-006 (Azure infrastructure must be deployed for PostgreSQL server to exist)
- Spec reference: `.kiro/specs/phase-0-infrastructure-setup.md`

**Data Contract**
```sql
-- Tables
contact_submissions (id SERIAL PK, name VARCHAR(255), email VARCHAR(255), phone VARCHAR(50), message TEXT, created_at TIMESTAMPTZ DEFAULT NOW())
job_applications (id SERIAL PK, name VARCHAR(255), email VARCHAR(255), position VARCHAR(255), resume_url TEXT, created_at TIMESTAMPTZ DEFAULT NOW())
newsletter_subscribers (id SERIAL PK, email VARCHAR(255) UNIQUE, subscribed_at TIMESTAMPTZ DEFAULT NOW(), active BOOLEAN DEFAULT TRUE)
donations (id SERIAL PK, amount DECIMAL(10,2), donor_name VARCHAR(255), donor_email VARCHAR(255), stripe_session_id VARCHAR(255), created_at TIMESTAMPTZ DEFAULT NOW())
users (id SERIAL PK, email VARCHAR(255) UNIQUE, password_hash VARCHAR(255), role VARCHAR(50) DEFAULT 'admin', created_at TIMESTAMPTZ DEFAULT NOW())
```

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| Connection refused | PostgreSQL server unreachable | Verify firewall rules allow client IP; check DATABASE_URL in Key Vault |
| Duplicate table | Schema already applied | Schema is idempotent (CREATE TABLE IF NOT EXISTS) — safe to re-run |
| Permission denied | DB user lacks CREATE privilege | Grant privileges via Azure Portal or psql admin connection |

**Recommended Skills**
- `#senior-backend` — database schema design, PostgreSQL optimization, raw SQL patterns

**Story Points**: 3
*Sizing rationale: 5 tables with indexes plus seed data — moderate complexity but well-defined schema.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the PostgreSQL Flexible Server is running in dev - When scripts/db/schema.sql executes - Then all 5 tables are created with correct columns, data types, and constraints
When scripts/db/schema.sql is executed
Then all 5 tables are created with correct columns, data types, and constraints
When the developer executes psql $DATABASE_URL -f scripts/db/schema.sql
Then all 5 tables are created in the public schema without errors
- [ ] #2 Given the schema is deployed - When a SELECT query runs against each table - Then all tables return 0 rows with no errors
When a SELECT query runs against each table
Then all tables return 0 rows with no errors
When the developer queries pg_indexes for the public schema
Then 3 indexes exist: idx_contact_created, idx_applications_created, idx_donations_created
- [ ] #3 Given the schema is deployed - When each table is inspected with \d+ - Then all expected indexes exist on the correct columns
When \d+ is used to inspect each table
Then all expected indexes exist on the correct columns
When the developer executes psql $DATABASE_URL -f scripts/db/seed.sql
Then sample data is inserted and SELECT COUNT(*) on each table returns > 0 rows
- [ ] #4 Edge case: idempotent re-run - Given the schema was already deployed - When schema.sql runs again - Then no error is thrown and all tables remain unchanged (CREATE TABLE IF NOT EXISTS)
When schema.sql is executed again
Then no error is thrown and all tables remain unchanged (CREATE TABLE IF NOT EXISTS)
When the developer re-runs scripts/db/schema.sql
Then no errors occur and existing data is preserved
- [ ] #5 Edge case: connection pooling - Given lib/db.ts exports a singleton pg Pool - When multiple routes import from lib/db.ts - Then only one Pool instance exists in memory per process
When multiple API routes import from lib/db.ts
Then only one Pool instance exists in memory per process
When multiple concurrent queries execute
Then connections are reused from the pool and no connection limit errors occur
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Deploy
```bash
psql $DATABASE_URL -f scripts/db/schema.sql
```

## Tables
- contact_submissions (id, name, email, phone, message, created_at)
- job_applications (id, name, email, position, resume_url, created_at)
- newsletter_subscribers (id, email, subscribed_at, active)
- donations (id, amount, donor_name, donor_email, stripe_session_id, created_at)
- users (id, email, password_hash, role, created_at)
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 Data contract doc created in docs/database-schema.md
- [ ] #3 Error dictionary entries added: ERR_DB_UNREACHABLE, ERR_DB_PERMISSION_DENIED
- [ ] #4 DB client uses singleton from lib/db.ts (no inline instantiation)
- [ ] #5 scripts/db/verify.sql confirms all tables and indexes
- [ ] #6 Verification script passes (scripts/verify/db-check.sh)
- [ ] #7 Corresponding [P0] Verify Database Schema Deployment task in Backlog.md marked Done
<!-- DOD:END -->
