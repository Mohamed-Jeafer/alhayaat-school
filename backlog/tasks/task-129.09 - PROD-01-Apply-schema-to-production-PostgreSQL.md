---
id: TASK-129.09
title: 'PROD-01: Apply schema to production PostgreSQL'
status: To Do
assignee: []
created_date: '2026-04-11 13:24'
labels:
  - production
dependencies:
  - TASK-129.07
  - TASK-129.08
parent_task_id: TASK-129
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Apply scripts/db/schema.sql to the production PostgreSQL server al-hayaat-prod-psql.postgres.database.azure.com. This is a prerequisite for the app to function in production - without this, all form submissions will crash.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 schema.sql runs against production alhayaat_db with no errors
- [ ] #2 verify.sql passes against production DB - shows 6 tables and 8 indexes
- [ ] #3 No existing data is lost (schema is idempotent with IF NOT EXISTS)
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Retrieve DATABASE_URL from Key Vault: az keyvault secret show --vault-name al-hayaat-prod-kv --name DATABASE-URL --query value -o tsv
2. Run: psql <DATABASE_URL> -f scripts/db/schema.sql
3. Run: psql <DATABASE_URL> -v ON_ERROR_STOP=1 -f scripts/db/verify.sql
4. Confirm 'Schema verification passed' in output
<!-- SECTION:PLAN:END -->
