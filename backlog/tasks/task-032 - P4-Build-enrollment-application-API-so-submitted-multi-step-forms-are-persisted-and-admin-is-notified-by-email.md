---
id: TASK-032
title: >-
  [P4] Build enrollment application API so submitted multi-step forms are
  persisted and admin is notified by email
status: Done
assignee: []
created_date: '2026-03-15 13:17'
updated_date: '2026-03-16 12:59'
labels:
  - phase-4
  - backend
  - enrollment
milestone: m-5
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a school administrator, I want enrollment application submissions to be stored in the database and trigger an email notification, so that I can review new applications promptly without manually checking the website.

**Business Context**
This API is the backend counterpart to the enrollment form UI. It validates the merged multi-step payload, inserts a row into an applications table, and sends a confirmation to the family and a notification to admin.

**Technical Specification**
- Rendering: N/A - API route only at POST /api/application
- Data: applications table in PostgreSQL (note: schema may need extension beyond TASK-003 - documented as risk in DoD)
- Infrastructure: Resend for confirmation email, Upstash rate limiting, Application Insights for errors
- Stack constraints: applicationSchema from TASK-024, pg Pool singleton from lib/db.ts, raw SQL insert (no ORM), JSONB columns for nested sections
- Phase dependencies: TASK-024 (applicationSchema, email service), TASK-003 (DB schema)
- Spec reference: .kiro/specs/phase-4-database-integration.md

**Data Contract**
| Field | Type | Notes |
|-------|------|-------|
| student.firstName | string | not null |
| student.lastName | string | not null |
| student.dateOfBirth | string | ISO date |
| student.gradeApplyingFor | string | not null |
| guardian.name | string | not null |
| guardian.email | string | valid email |
| guardian.phone | string | E.164 format |
| academic.currentGrade | string | not null |
| academic.languagesSpoken | string array | min 1 item |
| additional.howDidYouHear | string | not null |
| additional.agreeToTerms | boolean | must be true |

| DB Column | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| student_data | jsonb | full student section |
| guardian_data | jsonb | full guardian section |
| academic_data | jsonb | full academic section |
| additional_data | jsonb | full additional section |
| submitted_at | timestamptz | default now() |
| status | text | pending, under_review, accepted, rejected |

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| ERR_VALIDATION_FAILED | applicationSchema rejected | Return 422 with field-level error map |
| ERR_DB_INSERT_FAILED | PostgreSQL error | Log to App Insights, return 500 |
| ERR_EMAIL_SEND_FAILED | Resend failed | Log, return 201 (email non-critical) |
| ERR_RATE_LIMIT_EXCEEDED | Over 5 requests/hour | Return 429 with Retry-After header |

**Recommended Skills**
- `#senior-backend` - JSONB column design, parameterised SQL, error isolation

**Story Points**: 3
*Sizing rationale: API-only story with well-defined schema - complexity is in JSONB column design and graceful email failure handling.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given a valid 4-section payload - When POST /api/application is called - Then a DB row is inserted with all sections and HTTP 201 is returned with the new application ID
- [ ] #2 Given the payload fails applicationSchema validation - When POST /api/application is called - Then HTTP 422 is returned with a field-level error map matching the nested structure
- [ ] #3 Given the DB insert succeeds - When the row is committed - Then a confirmation email is sent to the guardian and an admin notification is sent to the school inbox
- [ ] #4 Given the confirmation email fails to send - When the email throws - Then the error is logged to Application Insights but the API still returns 201
- [ ] #5 Edge case: agreeToTerms is false - When applicationSchema validates - Then validation fails with a field-level error on additional.agreeToTerms
- [ ] #6 Edge case: rate limit - Given an IP submits 6 times in one hour - When the 6th request reaches the API - Then HTTP 429 is returned with a Retry-After header
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 Data contract doc created via backlog doc create -t technical 'Data contract: POST /api/application' - record doc-NNN ID here
- [ ] #3 Error dictionary doc created via backlog doc create -t reference 'Error dictionary: application API' - record doc-NNN ID here
- [ ] #4 RISK documented: verify applications table exists in TASK-003 schema or raise schema extension task
- [ ] #5 Email send failure does not cause 500 - error is caught and logged only
- [ ] #6 Application Insights logs ERR_DB_INSERT_FAILED and ERR_RATE_LIMIT_EXCEEDED with request metadata
<!-- DOD:END -->
