---
id: TASK-129.03
title: 'LOCAL-03: Test newsletter signup saves and deduplicates'
status: To Do
assignee: []
created_date: '2026-04-11 13:22'
labels:
  - local
dependencies:
  - TASK-129.01
parent_task_id: TASK-129
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
User subscribes to newsletter  POST /api/newsletter/subscribe  upserted in newsletter_subscribers. Re-subscribing with same email should not create duplicate.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Subscribe with a new email  row inserted with active=true
- [ ] #2 Subscribe with same email again  no duplicate row, existing row updated with active=true
- [ ] #3 API returns 200 both times
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. POST to /api/newsletter/subscribe with {email: 'test@example.com'}
2. SELECT * FROM newsletter_subscribers WHERE email='test@example.com';
3. POST again with same email
4. COUNT(*) should still be 1
<!-- SECTION:PLAN:END -->
