---
id: TASK-033
title: >-
  [P5] View and manage newsletter subscribers so the admin can maintain the
  mailing list and honour unsubscribe requests
status: To Do
assignee: []
created_date: '2026-03-15 13:17'
labels:
  - phase-5
  - admin
  - newsletter
  - backend
milestone: m-4
dependencies:
  - TASK-022
references:
  - .kiro/specs/phase-5-admin-dashboard.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a school admin, I want to view, search, manually unsubscribe, and export newsletter subscribers, so that I can manage the mailing list and honour unsubscribe requests promptly in compliance with CASL.

**Business Context**
Newsletter subscriber data currently has no admin interface. CASL (Canada's Anti-Spam Law) requires unsubscribe requests be honoured within 10 business days. A dedicated admin view with one-click unsubscribe confirmation and email search ensures compliance and keeps the mailing list clean.

**Technical Specification**
- Rendering: SSR for initial list load; Client Component for search input and unsubscribe action
- Data: Raw SQL via lib/db.ts — SELECT with ILIKE search on email (parameterized); UPDATE unsubscribed_at = NOW() WHERE id = $1 for manual unsubscribe
- Infrastructure: None beyond existing PostgreSQL
- Stack constraints: shadcn/ui Table + Input + Button + AlertDialog (confirm before unsubscribe); lib/db.ts singleton; lib/utils/csv-export.ts (shared — not duplicated)
- Phase dependencies: TASK-022 (admin dashboard overview)
- Spec reference: `.kiro/specs/phase-5-admin-dashboard.md`

**Data Contract**
```typescript
interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  unsubscribedAt: string | null;
}

// SQL (via lib/db.ts):
// SELECT * FROM newsletter_subscribers WHERE unsubscribed_at IS NULL AND email ILIKE $1 ORDER BY subscribed_at DESC;
// UPDATE newsletter_subscribers SET unsubscribed_at = NOW() WHERE id = $1;
```

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| 500 | DB query failure on page load | "Unable to load subscribers" error state with retry |
| 500 | Unsubscribe update fails | Toast: "Unsubscribe failed — please try again"; log to App Insights |

**Acceptance Criteria**
```gherkin
# Happy path
Given 50 active subscribers exist
When the admin visits /admin/newsletter
Then a table shows all 50 active subscribers with Email and Subscribed Date columns and an Export CSV button

# Edge case: search
Given 50 subscribers exist and 3 with "@hotmail.com" emails
When the admin types "@hotmail.com" in the search box
Then only those 3 subscribers appear in the table

# Edge case: manual unsubscribe
Given subscriber "parent@example.com" is active
When the admin clicks "Unsubscribe" and confirms in the AlertDialog
Then the subscriber is removed from the active list and unsubscribed_at timestamp is set in the database
```

**Testing & Validation**
- Unit: render subscriber table; render empty state; simulate search filter; simulate unsubscribe confirmation
- Visual: compare table layout at 768px and 1440px
- Lighthouse targets: Accessibility >95
- axe-core: zero critical violations

**Recommended Skills**
- `#senior-backend` — parameterized SQL; CASL compliance considerations
- `#senior-fullstack` — shadcn/ui AlertDialog confirmation pattern; shared CSV utility

**Story Points**: 3
*Sizing rationale: Simpler than contacts/applications — no status workflow, no file downloads, straightforward read + soft-delete, ~2h.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given 50 active subscribers exist — When admin visits /admin/newsletter — Then table shows all 50 subscribers with Email and Subscribed Date columns plus an Export CSV button
- [ ] #2 Given 50 subscribers exist and 3 with '@hotmail.com' emails — When admin types '@hotmail.com' in search — Then only those 3 subscribers appear
- [ ] #3 Given subscriber 'parent@example.com' is active — When admin clicks 'Unsubscribe' and confirms in the AlertDialog — Then subscriber is removed from the active list and unsubscribed_at timestamp is set in DB
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Data contract doc created: 'Data contract: newsletter subscribers API' — record doc-NNN ID
- [ ] #2 lib/db.ts singleton used — no inline pg.Pool instantiation
- [ ] #3 All SQL queries parameterized using numbered placeholders — no string interpolation
- [ ] #4 lib/utils/csv-export.ts reused — not duplicated
- [ ] #5 shadcn/ui AlertDialog used for unsubscribe confirmation — no accidental one-click unsubscribe
- [ ] #6 Application Insights logs all manual unsubscribe events
- [ ] #7 Verification script passes: scripts/verify/phase-5-admin.ts
<!-- DOD:END -->
