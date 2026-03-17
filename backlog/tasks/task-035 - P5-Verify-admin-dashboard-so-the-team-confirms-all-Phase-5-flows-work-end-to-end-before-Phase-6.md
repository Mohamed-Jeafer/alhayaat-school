---
id: TASK-035
title: >-
  [P5] Verify admin dashboard so the team confirms all Phase 5 flows work
  end-to-end before Phase 6
status: To Do
assignee: []
created_date: '2026-03-15 13:18'
labels:
  - phase-5
  - admin
  - verification
milestone: m-4
dependencies:
  - TASK-019
  - TASK-017
  - TASK-014
  - TASK-022
  - TASK-029
  - TASK-031
  - TASK-033
  - TASK-026
references:
  - .kiro/specs/phase-5-admin-dashboard.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a developer, I want a verification script that confirms all Phase 5 admin flows — authentication, route protection, data tables, status updates, and CSV exports — work end-to-end, so that the team can confidently close Phase 5 and proceed to Phase 6.

**Business Context**
Without a structured verification step, Phase 5 admin features could ship with broken auth redirects, unprotected routes, or silent DB query failures. A dedicated verify task forces explicit sign-off on every admin feature before any Stripe integration work begins.

**Technical Specification**
- Rendering: N/A — Playwright E2E verification script
- Data: Reads test fixtures from DB; no production data modified; uses scripts/create-admin.ts to seed test admin user
- Infrastructure: Runs against dev environment (Azure App Service dev slot)
- Stack constraints: Playwright for E2E browser tests; seed test admin user via scripts/create-admin.ts before running
- Phase dependencies: TASK-019 (auth); TASK-014 (middleware); TASK-017 (login page); TASK-022 (dashboard); TASK-029 (contacts); TASK-031 (applications); TASK-033 (newsletter); TASK-026 (donations)
- Spec reference: `.kiro/specs/phase-5-admin-dashboard.md`

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| E2E test failure | Admin flow broken | Block Phase 6 start; fix failing story |
| Seed script failure | Test admin user creation failed | Review DB connection and users table schema |

**Acceptance Criteria**
```gherkin
# Happy path
Given all P5 stories are merged to develop and deployed to dev environment
When the verification script runs
Then all checks pass: login works, /admin is protected, all 4 data tables render, CSV exports download, and status updates persist

# Edge case: unauthenticated route check
Given the verification script runs without an active session
When it attempts to access /admin/contacts
Then it receives a 302 redirect to /login (not a 200 or 500)

# Edge case: empty tables
Given the dev DB has no records in any submission table
When the verification script visits each admin data page
Then each page renders an empty state with no 500 errors
```

**Recommended Skills**
- `#senior-fullstack` — Playwright E2E test patterns; Next.js dev environment verification

**Story Points**: 2
*Sizing rationale: Verification-only story — Playwright scripts against existing features, no new feature code, ~2h.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given all P5 stories are merged to develop and deployed to dev environment — When the verification script runs — Then all checks pass: login works + /admin is protected + all 4 data tables render + CSV exports download
- [ ] #2 Given the verification script runs without an active session — When it accesses /admin/contacts — Then it receives a 302 redirect to /login (not a 200 or 500)
- [ ] #3 Given the dev DB has no records in any submission table — When the verification script visits each admin data page — Then each page renders an empty state with no 500 errors
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 scripts/verify/phase-5-admin.ts Playwright script created and passes against dev environment
- [ ] #2 All P5 stories (TASK-019 through TASK-033) confirmed working via script
- [ ] #3 Test admin user creation script (scripts/create-admin.ts) documented in README
- [ ] #4 Application Insights confirms no unhandled errors in dev environment post-deploy
- [ ] #5 All P5 tasks in Backlog.md marked Done before Phase 6 begins
<!-- DOD:END -->
