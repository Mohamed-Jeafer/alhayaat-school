---
id: TASK-129.10
title: 'PROD-02: Smoke test all write flows on production'
status: To Do
assignee: []
created_date: '2026-04-11 13:24'
updated_date: '2026-04-19 13:05'
labels:
  - production
dependencies:
  - TASK-129.09
parent_task_id: TASK-129
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
After schema is applied to production, do a smoke test of all 5 write flows against al-hayaat-prod.azurewebsites.net to confirm data is persisted end-to-end in Azure.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Contact form submitted on production site  row in production DB
- [ ] #2 Newsletter signup on production site  row in production DB
- [ ] #3 Job application submitted on production site  row in production DB, resume in Azure Blob
- [ ] #4 Enrollment application submitted on production site  row in production DB
- [ ] #5 Stripe test donation completed  webhook fires  row in production donations table
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Use al-hayaat-prod.azurewebsites.net for all tests
2. For Stripe: use Stripe test mode keys and CLI: stripe listen --forward-to https://al-hayaat-prod.azurewebsites.net/api/stripe/webhook
3. After each test, query production DB to verify row was created
4. Check App Insights logs for any errors
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Production blockers tracked separately: TASK-131 (AZURE_STORAGE_CONNECTION_STRING for careers resume upload), TASK-132 (Key Vault reference errors on App Service). Close those before expecting PROD AC #3 and Stripe-related checks to pass.
<!-- SECTION:NOTES:END -->
