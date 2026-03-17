---
id: TASK-026
title: >-
  [P5] View donation history so the admin can track and report on fundraising
  activity
status: To Do
assignee: []
created_date: '2026-03-15 13:15'
labels:
  - phase-5
  - admin
  - donations
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
As a school admin, I want to view a paginated donations table with date-range filtering, running totals, and CSV export, so that I can track and report on fundraising activity.

**Business Context**
Donation records will flow from Stripe webhooks (Phase 6) and need an admin interface for financial reporting. Date-range filtering and total calculations allow the school administrator to produce monthly fundraising summaries without accessing Stripe directly.

**Technical Specification**
- Rendering: SSR for initial table load; Client Component for date-range picker and CSV export trigger
- Data: Raw SQL via `lib/db.ts` — paginated SELECT with optional date-range filter on created_at; SUM aggregate for total within range; Stripe session ID displayed for reference only (no Stripe API call)
- Infrastructure: None — reads from donations table populated by Stripe webhooks (Phase 6); table must be built to render empty state gracefully before Phase 6 ships
- Stack constraints: shadcn/ui Table, Button, DatePickerWithRange; lib/db.ts singleton; lib/utils/csv-export.ts; amounts displayed in CAD using Intl.NumberFormat
- Phase dependencies: TASK-022 (admin dashboard overview); Phase 6 Stripe Integration (m-6) provides records — build now with empty state
- Spec reference: `.kiro/specs/phase-5-admin-dashboard.md`

**Data Contract**
```typescript
interface Donation {
  id: string;
  donorName: string | null;
  donorEmail: string | null;
  amountCad: number;
  stripeSessionId: string;
  status: 'completed' | 'refunded';
  createdAt: string;
}

interface DonationsPageParams {
  page?: number;
  pageSize?: number; // default 10
  startDate?: string; // ISO 8601
  endDate?: string;   // ISO 8601
}

// SQL signatures (via lib/db.ts):
// SELECT * FROM donations WHERE ($1::date IS NULL OR created_at >= $1) AND ($2::date IS NULL OR created_at <= $2) ORDER BY created_at DESC LIMIT $3 OFFSET $4;
// SELECT COALESCE(SUM(amount), 0) total FROM donations WHERE status = 'completed' AND ($1::date IS NULL OR created_at >= $1) AND ($2::date IS NULL OR created_at <= $2);
```

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| 500 | DB query failure on page load | "Unable to load donations" error state with retry button |
| 422 | Invalid date range (end before start) | Inline validation message on date picker |

**Acceptance Criteria**
```gherkin
# Happy path
Given 20 completed donations totalling $4500 CAD exist
When the admin visits /admin/donations
Then paginated table shows donations with Donor, Amount, Stripe Session ID, Status, and Date columns plus a "Total: $4,500.00 CAD" summary

# Edge case: date-range filter
Given donations exist across January and February 2026
When the admin sets the date range to February 1–28 2026
Then only February donations appear and the total updates to reflect the filtered range

# Edge case: no donations yet
Given no records exist in the donations table
When the admin visits /admin/donations
Then empty state shows "No donations recorded yet" and total shows "$0.00 CAD"
```

**Testing & Validation**
- Unit: render table with donations; render empty state; simulate date-range filter; verify CAD formatting with Intl.NumberFormat
- Visual: compare table layout at 768px and 1440px
- Lighthouse targets: Accessibility >95
- axe-core: zero critical violations

**Recommended Skills**
- `#senior-backend` — parameterized date-range SQL; SUM aggregate query
- `#senior-fullstack` — shadcn/ui DatePickerWithRange; Intl.NumberFormat for currency; shared CSV utility

**Story Points**: 3
*Sizing rationale: Standard paginated table with optional date-range filter and aggregate total — no complex writes, ~3h.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given 20 completed donations totalling $4500 CAD exist — When admin visits /admin/donations — Then paginated table shows donations with Donor/Amount/Stripe Session ID/Status/Date columns and 'Total: $4500.00 CAD' summary
- [ ] #2 Given donations exist across January and February 2026 — When admin sets date range to February 1-28 2026 — Then only February donations appear and the total updates to reflect the filtered range
- [ ] #3 Given no records exist in the donations table — When admin visits /admin/donations — Then empty state shows 'No donations recorded yet' and total shows '$0.00 CAD'
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Data contract doc created via `backlog doc create -t technical` for 'Data contract: donations history API' — record doc-NNN ID
- [ ] #2 `lib/db.ts` singleton used — no inline pg.Pool instantiation
- [ ] #3 All SQL queries parameterized using $1 $2 placeholders — no string interpolation
- [ ] #4 `lib/utils/csv-export.ts` reused — not duplicated
- [ ] #5 Amounts formatted as CAD using Intl.NumberFormat — no hardcoded currency strings in JSX
- [ ] #6 Empty state renders gracefully before Phase 6 ships — no crashes on empty donations table
- [ ] #7 Verification script passes (`scripts/verify/phase-5-admin.ts`)
<!-- DOD:END -->
