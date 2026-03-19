---
id: TASK-116
title: >-
  [P2] Build CareersWhyJoinSection component to extract the Careers page
  why-join inline section
status: Done
assignee: []
created_date: '2026-03-19 15:20'
updated_date: '2026-03-19 20:27'
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
As a prospective educator browsing the Careers page, I want to see a clear list of reasons to join the school's team, so that I can quickly evaluate whether the school's values align with mine.

## Business Context
The why-join section uses a heading and a bullet list with custom bullet image backgrounds. Currently inline in `src/app/careers/page.tsx`. Extracting it makes the benefits list independently manageable.

## Technical Specification
- Create `src/components/sections/CareersWhyJoinSection.tsx`
- Props: `{ headline: string; items: string[]; className?: string }`
- Custom bullet uses `next/image` for the bullet icon background
- Rendering: SSG — static content
- Stack constraints: Tailwind only, no inline styles
- Phase dependencies: TASK-099 (sections/ barrel)

## Content Extraction
- Source file: `al-hayaat.webflow/careers.html`
- Target file: `src/content/careers.json` — add `whyJoin` key with items array

## Reusable Components
- `CareersWhyJoinSection` — `src/components/sections/CareersWhyJoinSection.tsx`

## Testing & Validation
- Unit: render with items array, render with single item, snapshot
- Visual: compare against Webflow careers why-join at 375px, 768px, 1440px
- axe-core: list is semantically correct, bullet images have aria-hidden, zero critical violations

## Recommended Skills
- `#senior-fullstack` — component extraction
- `#frontend-design` — custom bullet list layout

## Story Points: 2
*Sizing rationale: Styled list with custom bullets + content JSON extraction.*

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 `src/components/sections/CareersWhyJoinSection.tsx` created
- [ ] #2 Added to `src/components/sections/index.ts`
- [ ] #3 Inline section JSX removed from `src/app/careers/page.tsx`
- [ ] #4 Items sourced from `src/content/careers.json`
- [ ] #5 No inline styles
- [ ] #6 Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->
<!-- DOD:END -->



## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the Careers page loads, When CareersWhyJoinSection renders, Then the headline and all benefit items display matching the Webflow source at 1440px
- [ ] #2 Given the items prop is populated, When the section renders, Then each item renders with the custom bullet style and text sourced from content JSON
- [ ] #3 Given the user is on a 375px wide screen, When CareersWhyJoinSection renders, Then all items are readable in a single-column list with no horizontal scroll
<!-- AC:END -->
