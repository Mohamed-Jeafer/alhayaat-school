---
id: TASK-102
title: >-
  [P2] Migrate SupportMissionSection from ui/ to sections/ and update all page
  imports
status: Done
assignee: []
created_date: '2026-03-19 15:15'
updated_date: '2026-03-19 17:14'
labels:
  - UI_COMPONENT
  - section-componentization
  - refactor
milestone: m-2
dependencies:
  - TASK-099
references:
  - docs/plans/2026-03-19-section-componentization-design.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Story
As a developer, I want `SupportMissionSection` to live in `src/components/sections/` with its imports updated across all pages, so that all section-level components share one canonical location.

## Business Context
`SupportMissionSection` is used on Home, Careers, and School Plan pages. It already accepts a `contentOverride` prop for per-page content variation. Moving it to `sections/` completes the three-migration batch and unblocks the barrel export.

## Technical Specification
- Move `src/components/ui/SupportMissionSection.tsx` → `src/components/sections/SupportMissionSection.tsx`
- Remove from `src/components/ui/index.ts` and add to `src/components/sections/index.ts`
- Update import paths in all pages: `src/app/page.tsx`, `src/app/careers/page.tsx`, `src/app/school-plan/page.tsx`
- No logic changes — pure file move + import update
- Rendering: SSG — static content
- Stack constraints: TypeScript, Next.js App Router
- Phase dependencies: TASK-099 (sections/ barrel must exist first)
- Spec reference: `docs/plans/2026-03-19-section-componentization-design.md`

## Content Extraction
- No content changes — existing content JSON wires correctly
- Shared content: Default content sourced from `src/content/home.json`; override content per page via `contentOverride` prop

## Reusable Components
- `SupportMissionSection` — migrated to `src/components/sections/SupportMissionSection.tsx`

## Testing & Validation
- Unit: render with default content, render with contentOverride, snapshot both
- Visual: confirm Home, Careers, and School Plan pages render identically before and after move at 375px, 768px, 1440px
- Lighthouse targets: Performance >90, Accessibility >95
- axe-core: zero critical violations

## Recommended Skills
- `#senior-fullstack` — import path refactoring

## Story Points: 1
*Sizing rationale: File move + updating imports across 3 pages.*

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 File moved to `src/components/sections/SupportMissionSection.tsx`
- [ ] #2 Removed from `src/components/ui/index.ts`
- [ ] #3 Added to `src/components/sections/index.ts`
- [ ] #4 All 3 page imports updated — zero TypeScript errors
- [ ] #5 Home, Careers, School Plan render identically post-move
- [ ] #6 Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->

<!-- DOD:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the Home page loads, When SupportMissionSection renders with default content, Then it is visually identical to pre-migration at 1440px
- [ ] #2 Given the Careers page loads, When SupportMissionSection renders with contentOverride, Then the overridden content displays correctly
- [ ] #3 Given the developer imports SupportMissionSection from '@/components/sections', When they compile, Then TypeScript reports zero errors
- [ ] #4 Given the user is on a 375px wide screen, When SupportMissionSection renders, Then the blue card layout stacks correctly with no horizontal scroll
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Migrated SupportMissionSection from src/components/ui/ to src/components/sections/. Updated internal FadeIn import to absolute path. Added SupportMissionSection and SupportMissionContent exports to src/components/sections/index.ts. Removed SupportMissionSection export from src/components/ui/index.ts. Updated import paths in all 3 consuming pages: page.tsx, careers/page.tsx, school-plan/page.tsx. npx tsc --noEmit exits with code 0.
<!-- SECTION:FINAL_SUMMARY:END -->
