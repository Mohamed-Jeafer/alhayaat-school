---
id: TASK-121
title: >-
  [P2] Build SchoolPlanCardsSection component to extract the School Plan page
  cards inline section
status: To Do
assignee: []
created_date: '2026-03-19 15:22'
labels:
  - UI_COMPONENT
  - section-componentization
  - refactor
milestone: m-2
dependencies:
  - TASK-099
references:
  - docs/plans/2026-03-19-section-componentization-design.md
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Story
As a school visitor reading the School Plan page, I want to see the Opening Plan and Community Plan as clear cards, so that I can understand the school's growth strategy at a glance.

## Business Context
The school plan cards section is a 2-column `ColoredBorderCard` grid. Currently inline in `src/app/school-plan/page.tsx`. Extracting it makes the plan cards independently editable.

## Technical Specification
- Create `src/components/sections/SchoolPlanCardsSection.tsx`
- Props: `{ cards: { title: string; body: string; accentColor?: string }[]; className?: string }`
- 2-column grid using existing `ColoredBorderCard`
- Rendering: SSG — static content
- Stack constraints: Tailwind only, no inline styles
- Phase dependencies: TASK-099 (sections/ barrel)

## Content Extraction
- Source file: `al-hayaat.webflow/school-plans.html`
- Target file: `src/content/school-plan.json` — add `planCards` key

## Reusable Components
- `SchoolPlanCardsSection` — `src/components/sections/SchoolPlanCardsSection.tsx`
- `ColoredBorderCard` — existing

## Testing & Validation
- Unit: render with 2 cards, render with 1 card, snapshot
- Visual: compare against Webflow school plan cards at 375px, 768px, 1440px
- axe-core: card headings structured correctly, zero critical violations

## Recommended Skills
- `#senior-fullstack` — component extraction

## Story Points: 2
*Sizing rationale: Card grid + content JSON extraction.*

## Definition of Done
- [ ] `src/components/sections/SchoolPlanCardsSection.tsx` created
- [ ] Added to `src/components/sections/index.ts`
- [ ] Inline section JSX removed from `src/app/school-plan/page.tsx`
- [ ] Card content sourced from `src/content/school-plan.json`
- [ ] No inline styles
- [ ] Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the School Plan page loads, When SchoolPlanCardsSection renders, Then both plan cards display with titles and body text matching the Webflow source at 1440px
- [ ] #2 Given the cards prop has 2 items, When the section renders, Then both cards are visible in a 2-column grid sourced from content JSON
- [ ] #3 Given the user is on a 375px wide screen, When SchoolPlanCardsSection renders, Then the 2-column grid stacks to single-column with no horizontal scroll
<!-- AC:END -->
