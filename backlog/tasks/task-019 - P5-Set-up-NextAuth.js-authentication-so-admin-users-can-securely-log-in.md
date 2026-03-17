---
id: TASK-019
title: '[P5] Set up NextAuth.js authentication so admin users can securely log in'
status: To Do
assignee: []
created_date: '2026-03-15 13:12'
labels:
  - phase-5
  - admin
  - auth
  - backend
milestone: m-4
dependencies: []
references:
  - .kiro/specs/phase-5-admin-dashboard.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a school admin, I want to authenticate with my email and password using NextAuth.js, so that only authorized users can access sensitive admin data.

**Business Context**
The current Webflow site has no admin interface or authentication layer. Establishing a secure credentials-based auth system with bcrypt-hashed passwords and server-side sessions protects contact submissions, job applications, and donation records from unauthorized access from day one.

**Technical Specification**
- Rendering: Server-side route handler (`app/api/auth/[...nextauth]/route.ts`) — credentials never exposed to client
- Data: Raw SQL via `lib/db.ts` singleton — `SELECT id, email, password_hash, role FROM users WHERE email = $1`; bcrypt compare with `bcryptjs`; session stored as JWT
- Infrastructure: NEXTAUTH_SECRET and NEXTAUTH_URL stored in Azure Key Vault; referenced via App Service Key Vault references per environment
- Stack constraints: next-auth v5 credentials provider; bcryptjs for hash comparison; lib/db.ts singleton (no inline pg.Pool); env vars via Key Vault
- Phase dependencies: Phase 4 Database Integration (m-5) — users table must exist
- Spec reference: `.kiro/specs/phase-5-admin-dashboard.md`

**Data Contract**
```typescript
interface AdminCredentials {
  email: string;
  password: string;
}

interface AdminSession {
  user: { id: string; email: string; role: 'admin' };
  expires: string;
}

// SQL (via lib/db.ts singleton):
// SELECT id, email, password_hash, role FROM users WHERE email = $1
```

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| 401 | Invalid credentials | Login form shows "Invalid email or password" |
| 500 | DB unreachable during auth | Login page shows "Service unavailable, try again" |
| ERR_AUTH_EXPIRED | Session token expired | Redirect to /login?expired=1 |

**Acceptance Criteria**
```gherkin
# Happy path
Given a user with email admin@alhayaat.ca and a valid bcrypt-hashed password exists in the users table
When the admin submits correct credentials on /login
Then NextAuth creates a session cookie and redirects the admin to /admin

# Edge case: wrong password
Given the admin email exists in the database
When the admin submits an incorrect password
Then a 401 is returned and the login page shows "Invalid email or password" without revealing whether the email exists

# Edge case: DB unreachable
Given the PostgreSQL server is unreachable
When the admin attempts to authenticate
Then the error is caught logged to Application Insights with ERR_DB_UNREACHABLE and login page shows "Service unavailable"
```

**Recommended Skills**
- `#senior-backend` — NextAuth.js credentials provider, bcrypt, JWT session management, Key Vault secret binding

**Story Points**: 5
*Sizing rationale: Backend-only auth wiring (NextAuth config, DB query, bcrypt, Key Vault integration) — no UI, ~6h scope.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given admin@alhayaat.ca with valid bcrypt-hashed password exists in users table — When correct credentials submitted — Then NextAuth creates session cookie and redirects to /admin
- [ ] #2 Given admin email exists in DB — When incorrect password is submitted — Then 401 returned and login page shows 'Invalid email or password' without revealing whether email exists
- [ ] #3 Given PostgreSQL is unreachable — When admin attempts to authenticate — Then error is caught logged to App Insights (ERR_DB_UNREACHABLE) and login page shows 'Service unavailable'
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Data contract doc created via `backlog doc create -t technical` for 'Data contract: NextAuth credentials auth' — record doc-NNN ID
- [ ] #2 Error dictionary doc created via `backlog doc create -t reference` for 'Error dictionary: auth service' — record doc-NNN ID
- [ ] #3 `lib/db.ts` singleton used — no inline `pg.Pool` instantiation anywhere in auth flow
- [ ] #4 `NEXTAUTH_SECRET` sourced from Azure Key Vault — not hardcoded in any environment file
- [ ] #5 `scripts/create-admin.ts` script created with bcrypt hashing and documented in README
- [ ] #6 Application Insights logging enabled for ERR_AUTH_EXPIRED auth failures
- [ ] #7 Application Insights logging enabled for ERR_DB_UNREACHABLE auth failures
- [ ] #8 Verification script passes (`scripts/verify/phase-5-admin.ts`)
<!-- DOD:END -->
