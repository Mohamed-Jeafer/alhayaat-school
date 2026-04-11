---
id: TASK-129.11
title: 'PROD-03: Smoke test admin reads and donation receipt on production'
status: To Do
assignee: []
created_date: '2026-04-11 13:25'
labels:
  - production
dependencies:
  - TASK-129.10
parent_task_id: TASK-129
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
After write smoke tests pass, verify the admin reads work correctly on production: dashboard stats, donations list, and PDF receipt download.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 /admin dashboard on production shows correct counts and recent activity
- [ ] #2 /admin/donations lists the test donation with correct data
- [ ] #3 PDF receipt download works for the test donation
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Navigate to https://al-hayaat-prod.azurewebsites.net/admin
2. Verify stats and recent activity reflect data from PROD-02 tests
3. Navigate to /admin/donations
4. Download receipt PDF for the Stripe test donation
5. Check App Insights for any query errors
<!-- SECTION:PLAN:END -->
