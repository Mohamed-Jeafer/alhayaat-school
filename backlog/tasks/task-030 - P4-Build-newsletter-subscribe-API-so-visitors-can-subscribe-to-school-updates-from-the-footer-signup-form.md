---
id: TASK-030
title: >-
  [P4] Build newsletter subscribe API so visitors can subscribe to school
  updates from the footer signup form
status: Done
assignee: []
created_date: '2026-03-15 13:17'
updated_date: '2026-03-16 11:59'
labels:
  - phase-4
  - backend
  - newsletter
milestone: m-5
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a visitor to the Al-Hayaat School website, I want to subscribe to the school newsletter by entering my email in the footer form, so that I receive updates about events, news, and announcements without checking the website manually.

**Business Context**
The Webflow footer has an email signup field that does nothing. Wiring it to a POST /api/newsletter/subscribe endpoint persists subscribers in the newsletter_subscribers table and sends a confirmation email, making the feature fully functional from Phase 4.

**Technical Specification**
- Rendering: N/A - API route only at POST /api/newsletter/subscribe; the footer form UI is in P2 Navigation/Footer component
- Data: newsletter_subscribers table in PostgreSQL (TASK-003)
- Infrastructure: Resend for confirmation email, Upstash rate limiting
- Stack constraints: newsletterSchema from TASK-024 (email only), pg Pool singleton from lib/db.ts, idempotent insert
- Phase dependencies: TASK-024 (newsletterSchema, email service), TASK-003 (newsletter_subscribers table)
- Spec reference: .kiro/specs/phase-4-database-integration.md

**Data Contract**
| Field | Type | Notes |
|-------|------|-------|
| email | string | required, valid email |

| DB Column | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| email | text | unique, not null |
| subscribed_at | timestamptz | default now() |
| is_active | boolean | default true |

Response: HTTP 201 on new subscriber, HTTP 200 on duplicate (idempotent)

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| ERR_VALIDATION_FAILED | Invalid email format | Footer form shows inline error |
| ERR_RATE_LIMIT_EXCEEDED | Over 5 requests/hour | Footer form shows rate limit message |
| ERR_DB_FAILED | PostgreSQL error | Log to App Insights, return 500 |

**Recommended Skills**
- `#senior-backend` - idempotent insert, minimal API design

**Story Points**: 2
*Sizing rationale: Minimal endpoint - single field, one table, idempotent insert, no file handling.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given a valid email - When POST /api/newsletter/subscribe is called - Then a row is inserted in newsletter_subscribers and a confirmation email is sent
- [ ] #2 Given the same email is submitted twice - When the second POST arrives - Then HTTP 200 is returned and no duplicate row is created
- [ ] #3 Given an invalid email format is submitted - When newsletterSchema validates - Then HTTP 422 is returned with a clear error message
- [ ] #4 Edge case: rate limit - Given an IP submits 6 times in one hour - When the 6th request reaches the API - Then HTTP 429 is returned
- [ ] #5 Edge case: email confirmation fails - Given the email send throws - When the error is caught - Then the error is logged to Application Insights and HTTP 201 is still returned
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 ON CONFLICT DO NOTHING implemented so duplicate emails return 200 not 500
- [ ] #3 Confirmation email sent on new subscription only - not on duplicate
- [ ] #4 Application Insights logs ERR_DB_FAILED and ERR_RATE_LIMIT_EXCEEDED
- [ ] #5 Endpoint verified against footer form in P2 Navigation component
<!-- DOD:END -->
