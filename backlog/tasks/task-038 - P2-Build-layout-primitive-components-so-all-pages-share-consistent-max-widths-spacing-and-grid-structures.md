---
id: TASK-038
title: >-
  [P2] Build layout primitive components so all pages share consistent
  max-widths, spacing, and grid structures
status: Done
assignee: []
created_date: '2026-03-15 13:20'
updated_date: '2026-03-16 05:04'
labels:
  - phase-2
  - layout
  - primitives
milestone: m-2
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a frontend developer building pages for the Al-Hayaat School site, I want layout primitive components (Container, Section, Grid, PageHeader, Layout), so that all pages use consistent spacing, max-widths, and grid structures without repeating Tailwind classes.

**Business Context**
Without layout primitives, each page component would duplicate the same max-width, padding, and grid patterns, causing visual inconsistency across the site. These primitives are consumed by every page component built in Phase 2 and Phase 3.

**Technical Specification**
- Rendering: All Server Components - no client-side interactivity needed
- Data: N/A - structural/presentational only
- Infrastructure: N/A
- Stack constraints: Tailwind CSS only, no inline styles, all spacing from design tokens established in Phase 1
- Phase dependencies: None - these are the foundational building blocks
- Spec reference: .kiro/specs/phase-2-component-library.md, docs/COMPONENT-LIBRARY-SPEC.md

**Component Props**
| Component | Key Props |
|-----------|-----------|
| Container | children, className?, maxWidth?: 'sm' or 'md' or 'lg' or 'xl' or '7xl' |
| Section | children, background?: 'white' or 'gray' or 'primary', padding?: 'sm' or 'md' or 'lg' |
| Grid | children, columns?: 1-4, gap?: 'sm' or 'md' or 'lg', className? |
| PageHeader | title, subtitle?, breadcrumbs?: BreadcrumbItem[], className? |
| Layout | children - wraps Navigation + Footer |

**Reusable Components**
- Container, src/components/ui/Container.tsx
- Section, src/components/ui/Section.tsx
- Grid, src/components/ui/Grid.tsx
- PageHeader, src/components/ui/PageHeader.tsx
- Layout, src/components/layout/Layout.tsx (wraps Navigation + Footer from TASK-037)

**Testing & Validation**
- Unit: Container with maxWidth xl - verify max-w-xl Tailwind class is applied
- Unit: Grid with columns=3 at 1440px - verify 3-column grid, at 375px - verify single column
- Unit: PageHeader with breadcrumbs - verify all crumbs render and the last is aria-current page
- Visual: spot-check against Phase 1 design token spec

**Recommended Skills**
- `#senior-fullstack` - Tailwind design tokens, TypeScript props interfaces
- `#frontend-design` - layout system consistency

**Story Points**: 3
*Sizing rationale: Five pure-presentational components with no state or API calls - straightforward Tailwind composition.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given a Container is rendered - When the viewport is 1440px wide - Then the content is capped at max-w-7xl and horizontally centred
- [ ] #2 Given a Grid is rendered with columns prop - When the viewport is 375px - Then the grid collapses to a single column
- [ ] #3 Given a PageHeader is rendered with title and breadcrumb props - When the component renders - Then the heading level, title, subtitle, and breadcrumb trail are all visible
- [ ] #4 Given a Section is rendered with a background variant - When the component renders - Then the correct background colour from design tokens is applied
- [ ] #5 Edge case: empty Grid children - Given Grid receives no children - When it renders - Then no layout errors occur and an empty container is shown without console warnings
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 Container, Section, Grid, PageHeader, and Layout components exported from src/components/ui/index.ts
- [ ] #3 All spacing values use Tailwind design tokens from Phase 1 - no hardcoded px values
- [ ] #4 TypeScript props interfaces exported alongside each component
- [ ] #5 Storybook stories created for each component with size and variant knobs
<!-- DOD:END -->
