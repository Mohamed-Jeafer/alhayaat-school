---
id: TASK-100
title: '[P2] Migrate WhySection from ui/ to sections/ and update all page imports'
status: To Do
assignee: []
created_date: '2026-03-19 15:14'
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
As a developer, I want `WhySection` to live in `src/components/sections/` with its imports updated across all pages, so that all section-level components share one canonical location.

## Business Context
`WhySection` is already a well-formed reusable component used on the Home and About pages. Moving it to `sections/` completes its classification and sets the pattern for the 3-migration story batch.

## Technical Specification
- Move `src/components/ui/WhySection.tsx` → `src/components/sections/WhySection.tsx`
- Remove from `src/components/ui/index.ts` and add to `src/components/sections/index.ts`
- Update all import paths in pages that consume WhySection (`src/app/page.tsx`, `src/app/about/page.tsx`)
- No logic changes — pure file move + import update
- Rendering: SSG — static content, no change to rendering strategy
- Stack constraints: TypeScript, Next.js App Router
- Phase dependencies: TASK-099 (sections/ barrel must exist first)
- Spec reference: `docs/plans/2026-03-19-section-componentization-design.md`

## Content Extraction
- Source file: `al-hayaat.webflow/index.html`, `al-hayaat.webflow/about.html`
- No content changes in this story — existing content JSON already wires correctly
- Shared content: `WhySection` content lives in `src/content/home.json` and `src/content/about.json` respectively

## Reusable Components
- `WhySection` — migrated to `src/components/sections/WhySection.tsx`

## Testing & Validation
- Unit: render WhySection with full props, render with minimum required props
- Visual: confirm Home and About pages render identically before and after move at 375px, 768px, 1440px
- Lighthouse targets: Performance >90, Accessibility >95
- axe-core: zero critical violations

## Recommended Skills
- `#senior-fullstack` — import path refactoring, barrel export maintenance

## Story Points: 1
*Sizing rationale: Pure file move and import update — no logic changes.*

## Definition of Done
- [ ] File moved to `src/components/sections/WhySection.tsx`
- [ ] Removed from `src/components/ui/index.ts`
- [ ] Added to `src/components/sections/index.ts`
- [ ] All page imports updated — zero TypeScript errors
- [ ] Home and About pages render identically post-move
- [ ] Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the Home page loads, When WhySection renders, Then it is visually identical to pre-migration at 1440px desktop
- [ ] #2 Given the About page loads, When WhySection renders, Then it is visually identical to pre-migration at 1440px desktop
- [ ] #3 Given the developer imports from '@/components/sections', When they use WhySection, Then TypeScript compiles without errors
- [ ] #4 Given the user is on a 375px wide screen, When WhySection renders on the Home page, Then the layout stacks correctly and all content is readable with no horizontal scroll
<!-- AC:END -->
