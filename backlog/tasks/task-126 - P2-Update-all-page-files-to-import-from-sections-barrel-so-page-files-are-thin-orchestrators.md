---
id: TASK-126
title: >-
  [P2] Update all page files to import from sections/ barrel so page files are
  thin orchestrators
status: In Progress
assignee: []
created_date: '2026-03-19 15:24'
updated_date: '2026-03-19 20:31'
labels:
  - UI_COMPONENT
  - section-componentization
  - refactor
  - integration
milestone: m-2
dependencies:
  - TASK-099
  - TASK-100
  - TASK-101
  - TASK-102
  - TASK-103
  - TASK-104
  - TASK-105
  - TASK-106
  - TASK-107
  - TASK-108
  - TASK-109
  - TASK-110
  - TASK-111
  - TASK-112
  - TASK-113
  - TASK-114
  - TASK-115
  - TASK-116
  - TASK-117
  - TASK-118
  - TASK-119
  - TASK-120
  - TASK-121
references:
  - docs/plans/2026-03-19-section-componentization-design.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Story
As a developer, I want all page files to import their sections from `@/components/sections`, so that every page file is a thin orchestrator with no inline section JSX — enabling plug-and-play section replacement across the entire site.

## Business Context
This is the integration story that closes the section componentization effort. Once all individual section components (TASK-099 through TASK-125) are complete, this task does the final wiring: confirms all page files exclusively import from `@/components/sections`, removes any remaining inline section JSX, and verifies all 8 pages render correctly.

## Technical Specification
- Audit all 8 pages: `src/app/page.tsx`, `about/`, `admissions/`, `careers/`, `contact/`, `curriculum/`, `donate/`, `school-plan/`
- Confirm each section is imported from `@/components/sections` (not inline JSX)
- Remove any residual inline section markup
- Confirm all props are wired from the corresponding `src/content/{page}.json`
- Rendering: SSG — all sections are static
- Stack constraints: TypeScript, Next.js App Router
- Phase dependencies: TASK-099 through TASK-125 (all section components must exist)
- Spec reference: `docs/plans/2026-03-19-section-componentization-design.md`

## Reusable Components
- All 28 section components from `src/components/sections/`

## Testing & Validation
- Build verification: `next build` passes with zero TypeScript errors
- Visual: all 8 pages render correctly at 375px, 768px, 1440px — compare against Webflow source for any regressions
- Lighthouse targets: Performance >90, Accessibility >95, SEO >90 across all pages
- axe-core: zero critical violations across all pages

## Recommended Skills
- `#senior-fullstack` — cross-page audit, import path verification

## Story Points: 3
*Sizing rationale: Auditing 8 pages + final import cleanup + build verification across entire site.*

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All 8 page files contain zero inline section JSX — only section component imports
- [ ] #2 All section imports resolve from `@/components/sections`
- [ ] #3 `next build` passes with zero TypeScript errors
- [ ] #4 All 8 pages render correctly at 375px, 768px, 1440px
- [ ] #5 No raw `<img>` tags in any page file
- [ ] #6 No inline styles in any page file
- [ ] #7 Lighthouse scores meet targets on all pages
- [ ] #8 Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->
<!-- DOD:END -->



## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given all section components are implemented, When a developer opens any page file, Then the file contains only section component imports from @/components/sections and no inline section JSX
- [ ] #2 Given all page files are updated, When next build runs, Then it completes with zero TypeScript errors and zero build warnings
- [ ] #3 Given the Home page loads after wiring, When all sections render, Then the page is visually identical to the Webflow source at 1440px desktop with no regressions
- [ ] #4 Given the About page loads after wiring, When all sections render, Then the page is visually identical to the Webflow source at 1440px desktop with no regressions
- [ ] #5 Given any of the 8 pages loads on a 375px wide screen, When all sections render, Then each section stacks correctly with no horizontal scroll and no layout breakage
- [ ] #6 Given a developer wants to swap out a section, When they replace the section import with a new component in the page file, Then only that section changes and all other sections are unaffected
<!-- AC:END -->
