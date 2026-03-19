---
id: TASK-117
title: >-
  [P2] Build CareersOpeningsSection component to extract the Careers page job
  openings inline section
status: To Do
assignee: []
created_date: '2026-03-19 15:20'
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
As a prospective educator browsing the Careers page, I want to see current job openings as styled cards with role details, so that I can identify positions that match my qualifications.

## Business Context
The openings section renders job cards conditionally — only if open positions exist. Currently inline in `src/app/careers/page.tsx`. Extracting it to `CareersOpeningsSection` isolates the conditional rendering logic and makes job card layout independently testable.

## Technical Specification
- Create `src/components/sections/CareersOpeningsSection.tsx`
- Props: `{ headline: string; positions: { title: string; type: string; description: string; href: string }[]; className?: string }`
- Renders nothing (or a null section) if `positions` is empty
- Each position card has a green bottom border
- Rendering: SSG — static content (positions from content JSON)
- Stack constraints: Tailwind only, no inline styles
- Phase dependencies: TASK-099 (sections/ barrel)

## Content Extraction
- Source file: `al-hayaat.webflow/careers.html`
- Target file: `src/content/careers.json` — add `openings` key with positions array

## Reusable Components
- `CareersOpeningsSection` — `src/components/sections/CareersOpeningsSection.tsx`

## Testing & Validation
- Unit: render with positions array, render with empty positions (verify nothing renders), snapshot
- Visual: compare against Webflow careers openings at 375px, 768px, 1440px
- axe-core: position links have descriptive text, cards use article semantics

## Recommended Skills
- `#senior-fullstack` — conditional rendering, component extraction

## Story Points: 2
*Sizing rationale: Conditional rendering + card layout + content JSON extraction.*

## Definition of Done
- [ ] `src/components/sections/CareersOpeningsSection.tsx` created
- [ ] Added to `src/components/sections/index.ts`
- [ ] Inline section JSX removed from `src/app/careers/page.tsx`
- [ ] Positions sourced from `src/content/careers.json`
- [ ] Section renders null when positions array is empty
- [ ] No inline styles
- [ ] Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the Careers page loads with positions in content JSON, When CareersOpeningsSection renders, Then all job cards display with title, type, and description matching the Webflow source at 1440px
- [ ] #2 Given the positions prop is empty, When CareersOpeningsSection renders, Then the section is not visible in the DOM and no empty card containers are shown
- [ ] #3 Given a position card is rendered, When the user clicks the card or apply link, Then they are navigated to the correct href
- [ ] #4 Given the user is on a 375px wide screen, When CareersOpeningsSection renders with positions, Then cards stack to single-column with no horizontal scroll
<!-- AC:END -->
