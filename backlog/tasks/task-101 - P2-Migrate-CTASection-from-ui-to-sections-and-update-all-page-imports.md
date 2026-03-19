---
id: TASK-101
title: '[P2] Migrate CTASection from ui/ to sections/ and update all page imports'
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
As a developer, I want `CTASection` to live in `src/components/sections/` with its imports updated across all pages, so that all section-level components share one canonical location.

## Business Context
`CTASection` is the most widely used section component — it appears as the final section on virtually every page. Moving it to `sections/` is high-value because it is the most visible candidate for the new canonical pattern.

## Technical Specification
- Move `src/components/ui/CTASection.tsx` → `src/components/sections/CTASection.tsx`
- Remove from `src/components/ui/index.ts` and add to `src/components/sections/index.ts`
- Update import paths in all pages that consume CTASection (Home, About, Admissions, Careers, Contact, Curriculum, Donate, School Plan)
- No logic changes — pure file move + import update
- Rendering: SSG — static content, no change
- Stack constraints: TypeScript, Next.js App Router
- Phase dependencies: TASK-099 (sections/ barrel must exist first)
- Spec reference: `docs/plans/2026-03-19-section-componentization-design.md`

## Content Extraction
- No content changes — existing content JSON wires correctly
- Shared content: CTASection content is sourced from `src/content/_shared.json` for cross-page reuse

## Reusable Components
- `CTASection` — migrated to `src/components/sections/CTASection.tsx`

## Testing & Validation
- Unit: render CTASection with green/primary/secondary variants; snapshot each variant
- Visual: confirm all pages render CTASection identically before and after move at 375px, 768px, 1440px
- Lighthouse targets: Performance >90, Accessibility >95
- axe-core: zero critical violations

## Recommended Skills
- `#senior-fullstack` — import path refactoring across multiple pages

## Story Points: 2
*Sizing rationale: File move + updating imports across 8 pages.*

## Definition of Done
- [ ] File moved to `src/components/sections/CTASection.tsx`
- [ ] Removed from `src/components/ui/index.ts`
- [ ] Added to `src/components/sections/index.ts`
- [ ] All 8 page imports updated — zero TypeScript errors
- [ ] All pages render CTASection identically post-move
- [ ] Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given any page that uses CTASection loads, When the CTA section renders, Then it is visually identical to pre-migration at 1440px desktop
- [ ] #2 Given the developer imports CTASection from '@/components/sections', When they use it with green/primary/secondary variants, Then TypeScript compiles and all variants render correctly
- [ ] #3 Given a user is on a 375px wide screen, When CTASection renders on any page, Then the layout stacks correctly, the CTA button is accessible, and no horizontal scroll occurs
- [ ] #4 Given the developer searches src/components/ui/, When they look for CTASection, Then it is no longer present there — the canonical location is sections/ only
<!-- AC:END -->
