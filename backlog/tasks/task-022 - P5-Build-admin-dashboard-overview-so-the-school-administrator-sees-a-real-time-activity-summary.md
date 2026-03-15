---
id: TASK-022
title: >-
  [P5] Build admin dashboard overview so the school administrator sees a
  real-time activity summary
status: To Do
assignee: []
created_date: '2026-03-15 13:13'
labels:
  - phase-5
  - admin
  - dashboard
  - backend
milestone: m-4
dependencies:
  - TASK-019
  - TASK-014
  - TASK-017
references:
  - .kiro/specs/phase-5-admin-dashboard.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a school admin, I want a dashboard overview page showing live counts of contact submissions, job applications, newsletter subscribers, and total donations, so that I can quickly assess school engagement and intake at a glance.

**Business Context**
Without a central view, the admin must check each data source separately to understand current intake. A single overview page surfaces unread counts and recent activity, reducing response time to inquiries and improving operational awareness across all submission channels.

**Technical Specification**
- Rendering: SSR — stats must reflect real-time counts on every visit; no stale cache acceptable
- Data: 4 parallel raw SQL queries via `lib/db.ts` singleton: COUNT on contact_submissions (with unread), job_applications (with new count), newsletter_subscribers (active only), donations (completed with SUM); plus UNION query for recent activity (last 10 rows across tables)
- Infrastructure: Azure Application Insights for page load telemetry
- Stack constraints: shadcn/ui Card for stat tiles; Promise.all for parallel DB queries; raw SQL with parameterized queries only; no inline pg.Pool; no ORM
- Phase dependencies: TASK-019 (NextAuth auth setup); TASK-014 (middleware); Phase 4 Database Integration (m-5)
- Spec reference: `.kiro/specs/phase-5-admin-dashboard.md`

**Data Contract**
```typescript
interface DashboardStats {
  contactSubmissions: { total: number; unread: number };
  jobApplications: { total: number; newCount: number };
  newsletterSubscribers: { total: number };
  donations: { total: number; totalAmountCad: number };
  recentActivity: Array<{
    type: 'contact' | 'application' | 'donation';
    id: string;
    summary: string;
    createdAt: string;
  }>;
}

// SQL signatures (via lib/db.ts):
// SELECT COUNT(*) total, COUNT(*) FILTER (WHERE read_at IS NULL) unread FROM contact_submissions;
// SELECT COUNT(*) total, COUNT(*) FILTER (WHERE status = 'new') new_count FROM job_applications;
// SELECT COUNT(*) total FROM newsletter_subscribers WHERE unsubscribed_at IS NULL;
// SELECT COUNT(*) total, COALESCE(SUM(amount),0) total_amount FROM donations WHERE status = 'completed';
```

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| 500 | Individual DB query failure | Show error state on that stat card only; log to App Insights |
| 403 | Session missing (middleware bypass) | Redirect to /login |

**Acceptance Criteria**
```gherkin
# Happy path
Given 5 contact submissions (3 unread) and 2 applications and 10 subscribers and $500 in donations exist
When the admin visits /admin
Then 4 stat cards display the correct counts and the recent activity list shows the latest 10 entries

# Edge case: empty database
Given no records exist in any table
When the admin visits /admin
Then all stat cards show 0 and the recent activity section shows "No recent activity"

# Edge case: one query fails
Given the donations table query throws an error
When the admin visits /admin
Then the other 3 stat cards render correctly, donations card shows an error state, and failure is logged to Application Insights
```

**Testing & Validation**
- Unit: render DashboardStats with mock data; render with empty data; render with partial error state on one card
- Visual: compare stat card layout at 375px, 768px, 1440px
- Lighthouse targets: Performance >90, Accessibility >95
- axe-core: zero critical violations on dashboard page

**Recommended Skills**
- `#senior-backend` — parallel SQL queries, App Insights telemetry
- `#senior-fullstack` — SSR server component, shadcn/ui Card layout

**Story Points**: 5
*Sizing rationale: SSR page with 4 parallel SQL queries, stat card components, recent activity aggregation — ~6h scope.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given 5 contact submissions (3 unread) and 2 applications and 10 subscribers and $500 in donations exist — When admin visits /admin — Then 4 stat cards show correct counts and recent activity lists the latest 10 entries
- [ ] #2 Given no records exist in any table — When admin visits /admin — Then all stat cards show 0 and recent activity shows 'No recent activity'
- [ ] #3 Given the donations table query throws an error — When admin visits /admin — Then the other 3 stat cards render correctly and the donations card shows an error state logged to Application Insights
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Data contract doc created via `backlog doc create -t technical` for 'Data contract: admin dashboard stats' — record doc-NNN ID
- [ ] #2 `lib/db.ts` singleton used for all 4 SQL queries — no inline pool instantiation
- [ ] #3 Promise.all used for parallel query execution — no sequential awaits
- [ ] #4 No hardcoded strings in JSX — all copy sourced from src/content/_shared.json
- [ ] #5 No raw `img` tags — next/image used exclusively
- [ ] #6 Application Insights logging enabled for individual query errors
- [ ] #7 Verification script passes (`scripts/verify/phase-5-admin.ts`)
<!-- DOD:END -->
