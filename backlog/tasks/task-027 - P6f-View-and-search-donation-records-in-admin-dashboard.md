---
id: TASK-027
title: '[P6f] View and search donation records in admin dashboard'
status: Done
assignee: []
created_date: '2026-03-15 13:15'
updated_date: '2026-03-15 21:21'
labels:
  - admin
  - donations
  - P6
milestone: m-6
dependencies:
  - TASK-020
references:
  - .kiro/specs/phase-6-stripe-integration.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Story Type: ADMIN

**Story**
As a school administrator, I want to view and search all donation records in the admin dashboard, so that I can monitor fundraising progress, identify donors for follow-up, and regenerate receipts when requested.

**Business Context**
Currently there is no school-side record of donations — the finance team relies on manual Stripe dashboard access to track contributions. Integrating the donations table into the admin dashboard provides a single operational view for school staff without requiring Stripe access, and enables receipt regeneration for donors who report not receiving their email.

**Technical Specification**
- Rendering: Server Component (SSR) — paginated SQL query server-side; no client-side data fetching for the initial table render
- Data: `SELECT id, stripe_session_id, amount_cad, donor_name, donor_email, is_anonymous, status, created_at FROM donations ORDER BY created_at DESC LIMIT $1 OFFSET $2` via `lib/db.ts` singleton; optional search filter via ILIKE; pagination via `searchParams`
- Infrastructure: None new — reads from existing PostgreSQL Flexible Server
- Stack constraints: `shadcn/ui` Table, Input, Button, Pagination primitives; `next/link` for pagination; Server Component with `searchParams`; admin route gated by P5 auth middleware
- Phase dependencies: TASK-020 (P6c webhook + DB schema), P5 admin auth tasks
- Spec reference: `.kiro/specs/phase-6-stripe-integration.md`

**Data Contract**
```typescript
// SQL query (lib/db/queries.ts)
interface ListDonationsInput {
  page: number;     // 1-based
  perPage: number;  // default: 25
  search?: string;  // ILIKE filter on donor_name OR donor_email
}

interface ListDonationsResult {
  donations: Donation[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export async function listDonations(input: ListDonationsInput): Promise<ListDonationsResult>

// SQL
SELECT id, stripe_session_id, amount_cad, donor_name, donor_email,
       is_anonymous, status, created_at
FROM   donations
WHERE  ($3::text IS NULL OR donor_name ILIKE '%' || $3 || '%'
                          OR donor_email ILIKE '%' || $3 || '%')
ORDER  BY created_at DESC
LIMIT  $1 OFFSET ($2 - 1) * $1
```

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| 401 | Unauthenticated admin access | Redirect to /admin/login |
| 500 | DB query failed | Show error alert: "Unable to load donations. Please try again." with App Insights log |
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the admin navigates to /admin/donations, when the page loads, then a paginated table displays all donations sorted by created_at DESC with columns: Date, Donor Name (or 'Anonymous'), Amount (CAD), Email, Status, Stripe Session ID
- [ ] #2 Given the admin enters a search term in the filter input, when they submit, then the donations table filters to show only rows where donor_name or donor_email contains the search term (server-side SQL ILIKE)
- [ ] #3 Given the admin clicks 'Download Receipt' on any row, when the click is processed, then a GET to /api/stripe/receipt?session_id=xxx is made and the PDF is downloaded without navigating away from the admin page
- [ ] #4 Given the admin views the donations table, when there are 0 donations, then an empty-state message 'No donations recorded yet' is displayed
- [ ] #5 Given there are 150 donations in the database, when the admin loads /admin/donations, then only 25 rows are shown per page with pagination controls that load the next page via server action
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
src/app/admin/donations/page.tsx (Server Component, paginated 25/page, listDonations SQL with ILIKE search). DonationsSearchForm.tsx (client search). DonationsPagination.tsx (Link-based, no full reload). Anonymous donors shown as 'Anonymous Donor'. Receipt download per row via /api/stripe/receipt.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 app/admin/donations/page.tsx created as Server Component; uses lib/db.ts singleton for paginated SQL query
- [ ] #3 SQL query: SELECT ... FROM donations ORDER BY created_at DESC LIMIT $1 OFFSET $2 with search filter via ILIKE on donor_name and donor_email
- [ ] #4 Table renders with shadcn/ui Table primitive; no custom table HTML
- [ ] #5 Donation amounts display as '$X.XX CAD' formatted string
- [ ] #6 is_anonymous=true rows display 'Anonymous Donor' in Donor Name column; email still shown to admin
- [ ] #7 Data contract doc via `backlog doc create -t technical "Data contract: admin-donations-query"` — record doc-NNN ID
- [ ] #8 Admin route protected by existing auth middleware (P5 TASK dependency); unauthenticated access redirects to /admin/login
- [ ] #9 Application Insights logs admin donation page view (admin_user_id, page, query)
- [ ] #10 WCAG 2.1 AA: table has proper headers with scope, pagination controls keyboard-navigable
<!-- DOD:END -->
