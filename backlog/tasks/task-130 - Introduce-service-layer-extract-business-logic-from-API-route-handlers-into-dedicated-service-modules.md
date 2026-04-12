---
id: TASK-130
title: >-
  Introduce service layer: extract business logic from API route handlers into
  dedicated service modules
status: To Do
assignee: []
created_date: '2026-04-12 16:05'
labels: []
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
No service layer exists  all 5 API routes (application, contact, newsletter, stripe/checkout-session, stripe/webhook, jobs/apply) mix validation, rate-limiting, DB, file upload, and email logic directly in route.ts handlers. Extract each into a dedicated service file under src/lib/services/ so routes become thin HTTP adapters.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Service files created: application.service.ts, contact.service.ts, newsletter.service.ts, donation.service.ts, job-application.service.ts under src/lib/services/|All route handlers delegate business logic to their service and only handle HTTP concerns (parse, respond, HTTP error codes)|Existing behaviour is preserved  no functional changes
<!-- AC:END -->
