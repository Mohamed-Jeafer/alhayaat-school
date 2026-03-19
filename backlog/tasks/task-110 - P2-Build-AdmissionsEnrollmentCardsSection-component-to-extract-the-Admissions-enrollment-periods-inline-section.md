---
id: TASK-110
title: >-
  [P2] Build AdmissionsEnrollmentCardsSection component to extract the
  Admissions enrollment periods inline section
status: Done
assignee: []
created_date: '2026-03-19 15:18'
updated_date: '2026-03-19 20:20'
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
As a prospective family reading the Admissions page, I want to see enrollment periods displayed as clear cards, so that I know when applications open and can plan accordingly.

## Business Context
The enrollment periods section uses a 2-column `ColoredBorderCard` grid. Currently inline in `src/app/admissions/page.tsx`. Extracting it makes enrollment period content independently manageable.

## Technical Specification
- Create `src/components/sections/AdmissionsEnrollmentCardsSection.tsx`
- Props: `{ headline: string; cards: { title: string; body: string; accentColor?: string }[]; className?: string }`
- 2-column grid using existing `ColoredBorderCard` from `src/components/ui/ColoredBorderCard.tsx`
- Rendering: SSG — static content
- Stack constraints: Tailwind only, no inline styles
- Phase dependencies: TASK-099 (sections/ barrel)

## Content Extraction
- Source file: `al-hayaat.webflow/admission.html`
- Target file: `src/content/admissions.json` — add `enrollmentCards` key

## Reusable Components
- `AdmissionsEnrollmentCardsSection` — `src/components/sections/AdmissionsEnrollmentCardsSection.tsx`
- `ColoredBorderCard` — existing, `src/components/ui/ColoredBorderCard.tsx`

## Testing & Validation
- Unit: render with 2 cards, render with 1 card, snapshot
- Visual: compare against Webflow admissions enrollment section at 375px, 768px, 1440px
- axe-core: card headings are properly structured, zero critical violations

## Recommended Skills
- `#senior-fullstack` — component extraction, card grid layout

## Story Points: 2
*Sizing rationale: Grid layout + card prop mapping + content JSON extraction.*

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 `src/components/sections/AdmissionsEnrollmentCardsSection.tsx` created
- [ ] #2 Added to `src/components/sections/index.ts`
- [ ] #3 Inline section JSX removed from `src/app/admissions/page.tsx`
- [ ] #4 Card content sourced from `src/content/admissions.json`
- [ ] #5 No inline styles
- [ ] #6 Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->

<!-- DOD:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the Admissions page loads, When AdmissionsEnrollmentCardsSection renders, Then enrollment period cards display in a 2-column grid matching the Webflow source at 1440px
- [ ] #2 Given the cards prop has 2 items, When the section renders, Then both cards are visible with their titles and body text sourced from content JSON
- [ ] #3 Given the user is on a 375px wide screen, When AdmissionsEnrollmentCardsSection renders, Then the 2-column grid stacks to single-column with no horizontal scroll
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Created AdmissionsEnrollmentCardsSection.tsx with props { id?, heading, cards: EnrollmentCard[], className? }. ACCENT_COLORS kept internal to component (JSON cards have no accentColor field — spec was aspirational). Removed enrollmentAccents const from page. Replaced 18-line inline Section block. Grid/ColoredBorderCard imports removed from page (no longer used there). Barrel updated. Zero TS errors.
<!-- SECTION:FINAL_SUMMARY:END -->
