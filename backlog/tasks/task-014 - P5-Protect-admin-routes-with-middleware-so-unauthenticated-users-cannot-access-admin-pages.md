---
id: TASK-014
title: >-
  [P5] Protect admin routes with middleware so unauthenticated users cannot
  access admin pages
status: To Do
assignee: []
created_date: '2026-03-15 13:10'
labels:
  - phase-5
  - admin
  - auth
  - middleware
milestone: m-4
dependencies: []
references:
  - .kiro/specs/phase-5-admin-dashboard.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a school admin, I want all /admin/* pages automatically protected from public access, so that I don't need to add auth checks to every page individually and sensitive data is never accidentally exposed.

**Business Context**
Without middleware-level protection, any unprotected admin page would be publicly accessible if a developer forgets to add a session check. Edge Middleware intercepts requests before rendering, ensuring zero chance of exposing admin data and preserving the `callbackUrl` so admins land on their intended page after logging in.

**Technical Specification**
- Rendering: Next.js Edge Middleware — runs before any route handler or page render; no DB call
- Data: NextAuth session JWT read from cookie — no database query required
- Infrastructure: None — middleware runs at the Edge within Next.js runtime
- Stack constraints: `withAuth` from `next-auth/middleware`; `matcher` config covering `/admin/:path*`; redirect to `/login?callbackUrl=` with encoded path preserved
- Phase dependencies: [P5] NextAuth.js authentication setup (TASK-012)
- Spec reference: `.kiro/specs/phase-5-admin-dashboard.md`

**Data Contract**
```typescript
// middleware.ts
// Reads: NextAuth session JWT from cookie (no DB call)
// On missing/invalid session: 302 → /login?callbackUrl={encodedPath}
// On valid session: request passes through unmodified

export const config = {
  matcher: ['/admin/:path*'],
}
```

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| 302 (no session) | Unauthenticated access to /admin/* | Redirect to /login?callbackUrl=<requested path> |
| 302 (expired) | Session JWT expired | Redirect to /login?expired=1 |

**Acceptance Criteria**
```gherkin
# Happy path
Given the admin has an active session cookie
When the admin navigates to /admin/contacts
Then the page renders normally with no redirect

# Edge case: unauthenticated access
Given no session cookie is present
When a visitor navigates to /admin/donations
Then they are redirected to /login?callbackUrl=%2Fadmin%2Fdonations

# Edge case: expired session
Given the admin's session JWT has expired
When the admin navigates to any /admin/* route
Then they are redirected to /login?expired=1 and the login page shows "Your session has expired"
```

**Recommended Skills**
- `#senior-backend` — Next.js Edge Middleware, NextAuth JWT session, withAuth pattern

**Story Points**: 2
*Sizing rationale: Single focused file (`middleware.ts`) with a well-documented NextAuth withAuth pattern — minimal code, ~3h.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given an active session cookie is present — When the admin navigates to /admin/contacts — Then the page renders normally with no redirect
- [ ] #2 Given no session cookie is present — When a visitor navigates to /admin/donations — Then they are redirected to /login?callbackUrl=%2Fadmin%2Fdonations
- [ ] #3 Given the admin's session JWT has expired — When any /admin/* route is accessed — Then redirect to /login?expired=1 and login page shows 'Your session has expired'
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All `/admin/*` routes confirmed inaccessible without a valid session (manual + automated check)
- [ ] #2 `callbackUrl` preserved on redirect so admin lands on intended page after login
- [ ] #3 Application Insights logs unauthorized access attempts
- [ ] #4 Verification script passes (`scripts/verify/phase-5-admin.ts`)
<!-- DOD:END -->
