---
id: TASK-017
title: >-
  [P5] Build admin login page so authenticated users can access the admin
  dashboard
status: To Do
assignee: []
created_date: '2026-03-15 13:11'
labels:
  - phase-5
  - admin
  - auth
  - ui
milestone: m-4
dependencies: []
references:
  - .kiro/specs/phase-5-admin-dashboard.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a school admin, I want a secure login page at /login with email and password fields, so that I can authenticate and access the admin dashboard.

**Business Context**
A purpose-built login page with client-side validation and clear error messaging ensures admins authenticate quickly without confusion. Credential errors must not reveal whether an email exists in the system — a standard security requirement for production auth flows.

**Technical Specification**
- Rendering: Client Component — form requires local state for validation feedback and loading state; NextAuth signIn() handles credential submission
- Data: signIn('credentials', { email, password, redirect: false }) from next-auth/react; on success redirect to /admin
- Infrastructure: None — auth handled by NextAuth.js route handler (TASK-012)
- Stack constraints: shadcn/ui Form, Input, Button, Alert primitives; react-hook-form + zod for client validation; no raw img tags; login copy sourced from src/content/_shared.json
- Phase dependencies: [P5] NextAuth.js authentication setup (TASK-012)
- Spec reference: `.kiro/specs/phase-5-admin-dashboard.md`

**Data Contract**
```typescript
interface LoginFormValues {
  email: string;    // required, valid email format
  password: string; // required, min 8 characters
  rememberMe: boolean;
}
// On success: redirect to /admin with active session cookie
// On failure: NextAuth CredentialsSignin error → "Invalid email or password"
```

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| CredentialsSignin | Wrong email or password | Inline Alert: "Invalid email or password" |
| SessionRequired | Accessing /login while already authenticated | Redirect to /admin |
| 500 | NextAuth server error | Alert: "Something went wrong. Please try again." |

**Acceptance Criteria**
```gherkin
# Happy path
Given the admin is on /login
When the admin enters valid credentials and clicks Sign In
Then the admin is redirected to /admin with an active session

# Edge case: invalid credentials
Given the admin is on /login
When the admin submits a wrong password
Then inline Alert "Invalid email or password" appears and the admin remains on /login

# Edge case: empty form submission
Given the admin is on /login with empty fields
When the admin clicks Sign In
Then zod validation errors appear under each required field and the form is not submitted
```

**Reusable Components**
- LoginForm — email/password form with zod validation, /src/components/admin/LoginForm.tsx
- Button — shadcn/ui button with loading state variant, /src/components/ui/button.tsx

**Testing & Validation**
- Unit: render LoginForm, submit valid values, submit invalid values (zod errors), simulate CredentialsSignin error response
- Visual: compare layout at 375px and 1440px
- Lighthouse targets: Accessibility >95
- axe-core: zero critical violations on login form

**Recommended Skills**
- `#senior-backend` — NextAuth.js signIn, session management
- `#senior-fullstack` — react-hook-form + zod, shadcn/ui form primitives, App Router client component patterns

**Story Points**: 3
*Sizing rationale: Single login page, known shadcn/ui components, client validation with zod — no new DB work, ~4h.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the admin is on /login — When valid credentials are entered and Sign In is clicked — Then the admin is redirected to /admin with an active session
- [ ] #2 Given the admin is on /login — When an incorrect password is submitted — Then inline Alert 'Invalid email or password' appears and the admin remains on /login
- [ ] #3 Given the admin is on /login with empty fields — When Sign In is clicked — Then zod validation errors appear under each required field and the form is not submitted
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Login page copy sourced from src/content/_shared.json — no hardcoded strings in JSX
- [ ] #2 shadcn/ui primitives used — no custom form styling outside Tailwind design tokens
- [ ] #3 No raw img tags — next/image used exclusively
- [ ] #4 Application Insights logging enabled for failed login attempts
- [ ] #5 Verification script passes (scripts/verify/phase-5-admin.ts)
<!-- DOD:END -->
