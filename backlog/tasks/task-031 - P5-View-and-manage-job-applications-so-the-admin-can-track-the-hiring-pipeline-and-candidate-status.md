---
id: TASK-031
title: >-
  [P5] View and manage job applications so the admin can track the hiring
  pipeline and candidate status
status: To Do
assignee: []
created_date: '2026-03-15 13:17'
labels:
  - phase-5
  - admin
  - applications
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
As a school admin, I want to view job applications in a paginated table with position filtering, status tracking, resume download, and CSV export, so that I can manage the hiring pipeline efficiently.

**Business Context**
Job applications submitted via the careers page currently have no tracking mechanism. An admin table with a status workflow (new → reviewed → contacted) and resume download reduces hiring coordination overhead and ensures qualified candidates are not overlooked.

**Technical Specification**
- Rendering: SSR for initial page load; Client Component for filter controls, status update dropdown, and CSV export
- Data: Raw SQL via lib/db.ts — paginated SELECT with optional WHERE position = $1 filter; UPDATE status with $1 $2 placeholders; resume files retrieved from Azure Blob Storage via pre-signed URL
- Infrastructure: Azure Blob Storage for resume file retrieval (pre-signed URL generation)
- Stack constraints: shadcn/ui Table + Select + Badge + Button + Dialog; lib/db.ts singleton; lib/utils/csv-export.ts (shared — not duplicated)
- Phase dependencies: TASK-022 (admin dashboard overview)
- Spec reference: `.kiro/specs/phase-5-admin-dashboard.md`

**Data Contract**
```typescript
interface JobApplication {
  id: string;
  applicantName: string;
  email: string;
  position: string;
  resumeUrl: string | null; // Azure Blob pre-signed URL
  status: 'new' | 'reviewed' | 'contacted';
  createdAt: string;
}

interface ApplicationsPageParams {
  page?: number;
  pageSize?: number; // default 10
  position?: string; // optional position filter
  status?: 'new' | 'reviewed' | 'contacted';
}

// SQL (via lib/db.ts):
// SELECT * FROM job_applications WHERE ($1::text IS NULL OR position = $1) ORDER BY created_at DESC LIMIT $2 OFFSET $3;
// UPDATE job_applications SET status = $1 WHERE id = $2;
```

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| 500 | DB query failure on page load | "Unable to load applications" error state with retry |
| 404 | Resume file not found in Blob Storage | "Resume unavailable" label; log to App Insights |
| 422 | Invalid status value in update | Toast: "Invalid status update" |

**Acceptance Criteria**
```gherkin
# Happy path
Given 15 job applications exist across 3 positions
When the admin visits /admin/applications
Then a paginated table shows 10 rows with Applicant, Email, Position, Status, Date, and Actions columns

# Edge case: filter by position
Given 15 applications exist and 4 for "Math Teacher"
When the admin selects "Math Teacher" from the position filter dropdown
Then only those 4 applications appear in the table

# Edge case: status update
Given an application with status "new" exists
When the admin changes its status to "reviewed" via the dropdown
Then the badge updates immediately and the change persists on page refresh
```

**Testing & Validation**
- Unit: render table with applications; render empty state; simulate position filter; simulate status update
- Visual: compare table layout at 768px and 1440px
- Lighthouse targets: Accessibility >95
- axe-core: zero critical violations

**Recommended Skills**
- `#senior-backend` — parameterized SQL with optional filters; Azure Blob pre-signed URLs
- `#senior-fullstack` — shadcn/ui Select + Badge; status workflow UI; shared CSV utility

**Story Points**: 5
*Sizing rationale: Paginated table with multi-filter, status workflow update, Blob Storage resume integration, and shared CSV export — ~4h.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given 15 job applications exist across 3 positions — When admin visits /admin/applications — Then paginated table shows 10 rows with Applicant/Email/Position/Status/Date/Actions columns
- [ ] #2 Given 15 applications exist and 4 for 'Math Teacher' — When admin selects 'Math Teacher' from position filter — Then only those 4 applications appear in the table
- [ ] #3 Given an application with status 'new' exists — When admin changes status to 'reviewed' via the dropdown — Then badge updates immediately and change persists on page refresh
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Data contract doc created: 'Data contract: job applications API' — record doc-NNN ID
- [ ] #2 lib/db.ts singleton used — no inline pg.Pool instantiation
- [ ] #3 All SQL queries parameterized using numbered placeholders — no string interpolation
- [ ] #4 lib/utils/csv-export.ts reused — not duplicated from contacts page
- [ ] #5 Azure Blob pre-signed URL used for resume downloads — no raw storage URLs exposed to client
- [ ] #6 Application Insights logs 404 resume-not-found errors
- [ ] #7 Verification script passes: scripts/verify/phase-5-admin.ts
<!-- DOD:END -->
