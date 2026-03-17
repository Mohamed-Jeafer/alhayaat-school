---
id: TASK-043
title: >-
  [P2] Build data display components so admin tables, empty states, and loading
  skeletons render accessibly across all pages
status: Done
assignee: []
created_date: '2026-03-15 13:23'
updated_date: '2026-03-16 05:04'
labels:
  - phase-2
  - ui-components
  - data-display
milestone: m-2
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a frontend developer building data-heavy admin and listing pages for the Al-Hayaat School site, I want data display components (Table, DataCard, EmptyState, LoadingSpinner, Skeleton, Pagination), so that tabular data, loading states, and empty states render consistently with correct accessibility patterns.

**Business Context**
Admin pages (Phase 5) display application and submission data in tables with pagination. Public listing pages (careers, programs) need EmptyState for empty arrays and Skeleton for loading states. Without these shared components, each page would implement its own table and loading pattern.

**Technical Specification**
- Rendering: Server Components for Table, DataCard, EmptyState; Client Components for Pagination (needs click handlers) and Skeleton (animation via Tailwind)
- Data: Props-driven - all data passed from parent page or admin route
- Infrastructure: N/A
- Stack constraints: shadcn/ui Table for Table component, shadcn Skeleton, Tailwind animate-pulse for Skeleton, lucide-react for EmptyState illustrations, React pagination state in parent
- Phase dependencies: TASK-038 (layout primitives), TASK-039 (core UI - Badge reused in DataCard)
- Spec reference: .kiro/specs/phase-2-component-library.md, docs/COMPONENT-LIBRARY-SPEC.md

**Component Props**
| Component | Key Props |
|-----------|-----------|
| Table | columns: ColumnDef[], data: object[], caption? |
| DataCard | label, value, trend?: 'up' or 'down', trendValue?: string |
| EmptyState | heading, body?, cta?: LinkProps, illustration?: ReactNode |
| LoadingSpinner | size?: 'sm' or 'md' or 'lg', label?: string |
| Skeleton | className?, height?, width?, count?: number |
| Pagination | total: number, page: number, perPage: number, onPageChange: (page: number) => void |

**Reusable Components**
- Table, src/components/ui/Table.tsx (wraps shadcn Table)
- DataCard, src/components/ui/DataCard.tsx
- EmptyState, src/components/ui/EmptyState.tsx
- LoadingSpinner, src/components/ui/LoadingSpinner.tsx
- Skeleton, src/components/ui/Skeleton.tsx (wraps shadcn Skeleton)
- Pagination, src/components/ui/Pagination.tsx

**Testing & Validation**
- Unit: Table with columns and data - verify th scope=col on all headers
- Unit: Table with empty data - verify EmptyState renders inside table area
- Unit: Pagination - verify aria-current=page on current page button
- Unit: EmptyState with cta - verify CTA button renders and links correctly
- Lighthouse Accessibility >95, axe-core zero critical violations

**Recommended Skills**
- `#senior-fullstack` - accessible table patterns, pagination state management

**Story Points**: 3
*Sizing rationale: Six display-only components - Table and Pagination require ARIA attention but shadcn base handles most of the complexity.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given a Table with rows - When the component renders - Then column headers are th elements with scope=col, and row cells are td elements correctly associated
- [ ] #2 Given a DataCard renders with stats - When the component renders - Then the label, value, and optional trend indicator are all visible
- [ ] #3 Given an EmptyState renders - When the data array passed to it is empty - Then the illustration, heading, and optional CTA button are visible
- [ ] #4 Given a Skeleton renders - When isLoading is true - Then animated placeholder shapes appear in place of the real content
- [ ] #5 Edge case: Table with zero rows - Given Table receives an empty data array - When it renders - Then an EmptyState component is shown within the table area
- [ ] #6 Edge case: mobile viewport - Given Table renders on a 375px screen - When the layout responds - Then the table scrolls horizontally inside a container rather than breaking the page layout
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 Table, DataCard, EmptyState, LoadingSpinner, Skeleton, and Pagination components exported from src/components/ui/index.ts
- [ ] #3 Table renders th with scope=col for all column headers
- [ ] #4 Pagination uses aria-label=Pagination and aria-current=page on current page button
- [ ] #5 Skeleton animation uses Tailwind animate-pulse - no custom CSS keyframes
- [ ] #6 TypeScript props interfaces exported alongside each component
<!-- DOD:END -->
