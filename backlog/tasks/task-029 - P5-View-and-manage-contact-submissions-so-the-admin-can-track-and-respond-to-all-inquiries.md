---
id: TASK-029
title: >-
  [P5] View and manage contact submissions so the admin can track and respond to
  all inquiries
status: To Do
assignee: []
created_date: '2026-03-15 13:16'
labels:
  - phase-5
  - admin
  - submissions
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
As a school admin, I want to view, search, paginate, mark as read, and export contact form submissions, so that I can respond to all inquiries without losing track of any message.

**Business Context**
Contact form submissions currently land in an email inbox with no tracking, no search, and no read/unread status. A structured admin table with pagination, search, and CSV export ensures no inquiry falls through the cracks and provides an audit trail for school communications.

**Technical Specification**
- Rendering: SSR for initial table page (fresh data on load); Client Component for search input (debounced) and CSV export trigger
- Data: Raw SQL via lib/db.ts — paginated SELECT with optional ILIKE filter on name and email; UPDATE for read_at; all queries use parameterized $1 $2 placeholders
- Infrastructure: None beyond existing PostgreSQL
- Stack constraints: shadcn/ui Table + Dialog + Input + Badge + Button; pagination via URL search params; lib/utils/csv-export.ts for CSV generation; no inline pg.Pool
- Phase dependencies: TASK-022 (admin dashboard overview)
- Spec reference: `.kiro/specs/phase-5-admin-dashboard.md`

**Data Contract**
```typescript
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  readAt: string | null;
  createdAt: string;
}

interface ContactsPageParams {
  page?: number;      // default 1
  pageSize?: number;  // default 10
  search?: string;    // ILIKE on name or email
  sort?: 'asc' | 'desc'; // on created_at
}

// SQL (via lib/db.ts):
// SELECT * FROM contact_submissions WHERE (name ILIKE $1 OR email ILIKE $1) ORDER BY created_at DESC LIMIT $2 OFFSET $3;
// UPDATE contact_submissions SET read_at = NOW() WHERE id = $1;
```

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| 500 | DB query failure | "Unable to load submissions" error state with retry button |
| 422 | Invalid pagination params | Default to page 1 silently |

**Acceptance Criteria**
```gherkin
# Happy path
Given 25 contact submissions exist in the database
When the admin visits /admin/contacts
Then a paginated table shows 10 rows on page 1 with Name, Email, Message (truncated), Date, and Status columns

# Edge case: search
Given 25 submissions exist with 3 matching email "parent@"
When the admin types "parent@" in the search box
Then the table updates to show only those 3 matching submissions

# Edge case: mark as read
Given 5 unread submissions exist
When the admin clicks "Mark as read" on one submission
Then its badge changes from "Unread" to "Read" and the change persists on page refresh
```

**Testing & Validation**
- Unit: render table with 10 rows; render empty state; simulate search filter; simulate mark-as-read; simulate CSV export
- Visual: compare table layout at 768px and 1440px
- Lighthouse targets: Accessibility >95
- axe-core: zero critical violations on table and modal

**Recommended Skills**
- `#senior-backend` — paginated SQL with parameterized ILIKE queries
- `#senior-fullstack` — shadcn/ui Table + Dialog; URL search params pagination; CSV export utility

**Story Points**: 5
*Sizing rationale: Paginated table with search, sort, modal detail view, read-status update, and CSV export — 4 distinct interaction patterns.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given 25 contact submissions exist — When admin visits /admin/contacts — Then paginated table shows 10 rows with Name/Email/Message/Date/Status columns
- [ ] #2 Given 25 submissions exist and 3 matching 'parent@' in email — When admin types 'parent@' in search — Then only 3 matching submissions appear
- [ ] #3 Given 5 unread submissions exist — When admin clicks 'Mark as read' on one — Then badge changes to 'Read' and persists on page refresh
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Data contract doc created: 'Data contract: contact submissions API' — record doc-NNN ID
- [ ] #2 lib/db.ts singleton used — no inline pg.Pool instantiation
- [ ] #3 All SQL queries parameterized using numbered placeholders — no string interpolation
- [ ] #4 lib/utils/csv-export.ts utility created and reused across admin pages — not duplicated per-page
- [ ] #5 No raw img tags — next/image used exclusively
- [ ] #6 No hardcoded strings in JSX — copy from src/content/_shared.json
- [ ] #7 Verification script passes: scripts/verify/phase-5-admin.ts
<!-- DOD:END -->
