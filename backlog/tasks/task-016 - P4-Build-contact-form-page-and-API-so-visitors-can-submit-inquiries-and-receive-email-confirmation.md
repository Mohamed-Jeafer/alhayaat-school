---
id: TASK-016
title: >-
  [P4] Build contact form page and API so visitors can submit inquiries and
  receive email confirmation
status: Done
assignee: []
created_date: '2026-03-15 13:11'
updated_date: '2026-03-16 12:17'
labels:
  - phase-4
  - backend
  - forms
  - email
milestone: m-5
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a parent or community member on the Al-Hayaat School contact page, I want to submit an inquiry via an accessible form and receive an immediate email confirmation, so that I know my message was received and can expect a response from the school.

**Business Context**
The Webflow contact page submits to Webflow's native form handler with no admin notification, no confirmation email, no spam prevention, and no database record. The Next.js implementation saves every submission to PostgreSQL, fires admin and user confirmation emails via Resend, and applies rate limiting — giving the school a full audit trail and reducing spam.

**Technical Specification**
- Rendering: SSR — page uses a Client Component form with server action, pre-rendered shell
- Data: POST to `/api/contact/route.ts`, INSERT into `contact_submissions` via `lib/db.ts` singleton, email via `lib/email/client.ts` singleton
- Infrastructure: Azure PostgreSQL (contact_submissions table), Azure Key Vault (RESEND_API_KEY, UPSTASH_REDIS_REST_URL)
- Stack constraints: react-hook-form + Zod `contactSchema` from `lib/validations/forms.ts`, shadcn/ui `Toast` for submission feedback, rate limiter from `lib/rate-limit.ts`, honeypot field for spam prevention, `lib/api-client.ts` for client fetch — no hardcoded base URLs
- Phase dependencies: P4 shared service layer task (email, rate-limit, validation), P2 form components (Form, Input, Textarea, SubmitButton), P3 contact page static shell
- Spec reference: `.kiro/specs/phase-4-database-integration.md`

**Data Contract**
```typescript
// POST /api/contact
interface ContactRequest {
  name: string           // min 2 chars
  email: string          // valid email
  phone?: string
  message: string        // min 10 chars
  honeypot?: string      // must be empty — bot trap
}

interface ContactResponse {
  success: boolean
  message: string
}

// DB insert
// INSERT INTO contact_submissions (name, email, phone, message) VALUES ($1, $2, $3, $4)
```

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| ERR_VALIDATION_FAILED | Required field missing or invalid | Inline field error beneath each input, form stays open |
| ERR_RATE_LIMIT_EXCEEDED | Too many submissions from same IP | Toast: "Too many requests. Please try again later." |
| ERR_DB_UNREACHABLE | PostgreSQL connection failed | Toast: "Something went wrong. Please try again." Log to App Insights |
| ERR_EMAIL_SEND_FAILED | Resend rejected email | Submission still saved to DB, warning logged, user shown success message |

**Content Extraction**
- Source file: `al-hayaat.webflow/contact.html`
- Target file: `src/content/contact.json`
- Sections to extract: `contact-hero`, `contact-info` (address, phone, email, hours), `contact-form-labels`
- Shared content: Contact info (phone, email, address) also appears in footer — extract to `_shared.json`
- Webflow markup patterns: `.contact-form` with `w-form` wrapper, `.contact-info-block` for location/hours details

**Reusable Components**
- `Form` — react-hook-form wrapper (reuse from P2), `src/components/forms/Form.tsx`
- `Input` — validated text input (reuse from P2), `src/components/forms/Input.tsx`
- `Textarea` — multi-line input (reuse from P2), `src/components/forms/Textarea.tsx`
- `SubmitButton` — loading-aware submit (reuse from P2), `src/components/forms/SubmitButton.tsx`
- `Toast` — shadcn/ui notification (reuse from P2), `src/components/ui/Toast.tsx`

**Testing & Validation**
- Unit: submit valid form data — expect 200 and DB row inserted
- Unit: submit with missing name — expect 422 with name field error
- Unit: submit 6 times in 1 hour — expect 429 on 6th request
- Unit: submit with honeypot filled — expect silent 200 with no DB insert
- Visual: verify form layout against Webflow contact page at 375px, 768px, 1440px
- Lighthouse targets: Performance >90, Accessibility >95
- axe-core: zero critical violations, all inputs have visible labels

**Recommended Skills**
- `#senior-backend` — API route design, raw SQL parameterised queries, rate limiting, email delivery
- `#senior-fullstack` — react-hook-form integration, Server Actions vs API routes decision, error state UX

**Story Points**: 5
*Sizing rationale: Full-stack form story covering UI, API, DB insert, dual email send, rate limiting, and spam prevention.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given a visitor fills all required fields correctly - When they submit the contact form - Then a 200 response is returned, a row is inserted into contact_submissions, and two emails are sent (admin notification and user confirmation)
- [ ] #2 Given the contact form is submitted - When the API responds with success - Then a success Toast notification appears and the form fields are cleared
- [ ] #3 Given a visitor leaves the message field empty - When they submit - Then an inline error appears beneath the message field and no API call is made
- [ ] #4 Given an IP has submitted 5 times in the last hour - When a 6th submission is attempted - Then the API returns 429 and a rate-limit Toast is shown to the user
- [ ] #5 Edge case: DB unreachable - Given the PostgreSQL connection fails - When a valid form is submitted - Then a generic error Toast appears, the error is logged to App Insights, and no confirmation email is sent
- [ ] #6 Edge case: honeypot triggered - Given the hidden honeypot field contains a value - When the form is submitted - Then the API returns 200 silently but no DB row is inserted and no email is sent
- [ ] #7 Edge case: mobile viewport - Given the user is on a 375px screen - When the contact form renders - Then all inputs are full-width, labels are visible, and the submit button is reachable without horizontal scroll
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented POST /api/contact route with full validation pipeline (Zod, honeypot trap, rate limiting, DB insert, fire-and-forget emails). Converted static ContactForm into a live react-hook-form + zodResolver component with toast feedback, field-level 422 error mapping, 429/500 error handling. Also fixed a pre-existing Zod v4 type incompatibility in admissions/apply/page.tsx. Build passes clean.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 Data contract doc created via backlog doc create -t technical 'Data contract: POST /api/contact' — record doc-NNN ID here
- [ ] #3 Error dictionary doc created via backlog doc create -t reference 'Error dictionary: contact API' — record doc-NNN ID here
- [ ] #4 src/content/contact.json created with contact-hero and contact-info sections
- [ ] #5 Contact info (phone, email, address) extracted to src/content/_shared.json
- [ ] #6 All form labels and copy sourced from content JSON — no hardcoded strings in JSX
- [ ] #7 DB client uses singleton from lib/db.ts — no inline instantiation
- [ ] #8 Rate limiter applied via lib/rate-limit.ts — no inline Upstash instantiation
- [ ] #9 Honeypot field present and validated server-side
- [ ] #10 Both admin and user confirmation emails send on successful submission
- [ ] #11 Application Insights logging enabled for all ERR_* codes
- [ ] #12 WCAG 2.1 AA checked — all inputs have visible, associated labels
- [ ] #13 Lighthouse Accessibility >95
<!-- DOD:END -->
