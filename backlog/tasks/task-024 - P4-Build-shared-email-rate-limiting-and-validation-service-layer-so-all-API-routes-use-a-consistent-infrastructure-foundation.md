---
id: TASK-024
title: >-
  [P4] Build shared email, rate-limiting, and validation service layer so all
  API routes use a consistent infrastructure foundation
status: Done
assignee: []
created_date: '2026-03-15 13:13'
updated_date: '2026-03-16 11:53'
labels:
  - phase-4
  - backend
  - infrastructure
milestone: m-5
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a developer building interactive API routes on the Al-Hayaat School website, I want centralised email (Resend), rate limiting (Upstash Redis), and Zod validation schemas available as singletons, so that every API route uses the same service layer without duplicating configuration.

**Business Context**
Without a shared service layer, each API route would instantiate its own email client and define its own validation rules, causing configuration drift. A single lib/ service layer enforces the singleton pattern and ensures rate limiting is applied uniformly across all public endpoints.

**Technical Specification**
- Rendering: N/A - library modules only, no UI
- Data: N/A - utility and config files
- Infrastructure: Upstash Redis for rate limiting, Resend API for email, Key Vault for secrets
- Stack constraints: Resend singleton from lib/email/client.ts, Upstash ratelimit singleton from lib/rate-limit.ts, Zod schemas in lib/validations/forms.ts
- Phase dependencies: TASK-003 (DB schema), TASK-006 (Key Vault for new secrets)
- Spec reference: .kiro/specs/phase-4-database-integration.md

**Data Contract**
| Module | Export | Signature |
|--------|--------|-----------|
| lib/email/client.ts | resend | Resend singleton |
| lib/email/templates.ts | sendContactConfirmation | (name, email, message) => Promise |
| lib/email/templates.ts | sendAdminNotification | (formType, name, email) => Promise |
| lib/rate-limit.ts | checkRateLimit | (id: string) => Promise of success+remaining |
| lib/validations/forms.ts | contactSchema | ZodObject for name, email, message, honeypot |
| lib/validations/forms.ts | jobApplicationSchema | ZodObject for name, email, position, resume |
| lib/validations/forms.ts | applicationSchema | ZodObject for student, guardian, academic, additional |
| lib/validations/forms.ts | newsletterSchema | ZodObject for email |

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| ERR_EMAIL_SEND_FAILED | Resend API rejected | Log to App Insights, return 500 |
| ERR_RATE_LIMIT_EXCEEDED | Over 5 requests/hour | Return 429 with Retry-After header |
| ERR_VALIDATION_FAILED | Zod schema rejected input | Return 422 with field-level error map |

**Recommended Skills**
- `#senior-backend` — singleton patterns, Zod schema design, rate limiting strategy

**Story Points**: 3
*Sizing rationale: Four library files with no UI - well-defined interfaces, moderate setup for Upstash and Resend.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given no email client exists - When lib/email/client.ts is imported by multiple routes - Then only one Resend instance exists per process
- [ ] #2 Given the rate limiter is configured - When an IP submits more than 5 times in 1 hour - Then checkRateLimit returns success: false and the caller returns HTTP 429
- [ ] #3 Given contactSchema is defined - When an object with a missing required field is validated - Then Zod returns a field-level error map identifying the failing field
- [ ] #4 Edge case: missing env var - Given RESEND_API_KEY is absent - When the email module loads - Then a descriptive startup error is thrown before any request is handled
- [ ] #5 Edge case: honeypot field - Given the honeypot field is non-empty - When contactSchema validates - Then validation fails and the submission is silently rejected
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented the shared P4 service layer:

**Files created:**
- `src/lib/email/client.ts` — `getResend()` singleton, same pattern as `getStripe()`
- `src/lib/email/templates.ts` — 7 async send functions (contact confirmation/admin, newsletter, application confirmation/admin, job-application confirmation/admin)
- `src/lib/email/templates/contact-confirmation.tsx` — React Email template
- `src/lib/email/templates/admin-notification.tsx` — generic admin notification template (accepts formType, name, email, details)
- `src/lib/email/templates/newsletter-confirmation.tsx` — React Email template
- `src/lib/email/templates/application-confirmation.tsx` — React Email template
- `src/lib/email/templates/job-application-confirmation.tsx` — React Email template
- `src/lib/rate-limit.ts` — `checkRateLimit(identifier)` using Upstash in prod, in-memory Map fallback in dev (5 req/hour)
- `src/lib/validations/forms.ts` — Zod schemas: `contactSchema`, `newsletterSchema`, `applicationSchema`, `jobApplicationSchema`

Build passed cleanly with no TypeScript or ESLint errors.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 Data contract doc created via backlog doc create -t technical 'Data contract: email and rate-limit service layer' - record doc-NNN ID here
- [ ] #3 Error dictionary doc created via backlog doc create -t reference 'Error dictionary: ERR_EMAIL_SEND_FAILED, ERR_RATE_LIMIT_EXCEEDED, ERR_VALIDATION_FAILED' - record doc-NNN ID here
- [ ] #4 All service modules export singletons - no inline instantiation in API routes
- [ ] #5 RESEND_API_KEY and UPSTASH_REDIS_REST_URL added to Key Vault and .env.local.example
- [ ] #6 All Zod schemas cover client-side and server-side validation paths
- [ ] #7 Application Insights logging enabled for all ERR_* codes
<!-- DOD:END -->
