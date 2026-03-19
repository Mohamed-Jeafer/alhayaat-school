---
id: TASK-111
title: >-
  [P2] Build AdmissionsHowToApplySection component to extract the Admissions
  how-to-apply inline section
status: To Do
assignee: []
created_date: '2026-03-19 15:18'
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
As a prospective family on the Admissions page, I want to see a clear numbered step-by-step application process, so that I know exactly what actions to take to apply.

## Business Context
The How to Apply section is a two-column layout: intro text on the left, numbered steps list on the right. Currently inline in `src/app/admissions/page.tsx`. Extracting it makes the steps independently editable without touching the page file.

## Technical Specification
- Create `src/components/sections/AdmissionsHowToApplySection.tsx`
- Props: `{ headline: string; intro: string; steps: { number: number; title: string; body: string }[]; className?: string }`
- Two-column layout: intro on left, numbered steps on right
- Rendering: SSG — static content
- Stack constraints: Tailwind only, no inline styles
- Phase dependencies: TASK-099 (sections/ barrel)

## Content Extraction
- Source file: `al-hayaat.webflow/admission.html`
- Target file: `src/content/admissions.json` — add `howToApply` key with steps array

## Reusable Components
- `AdmissionsHowToApplySection` — `src/components/sections/AdmissionsHowToApplySection.tsx`

## Testing & Validation
- Unit: render with steps array, render with single step, snapshot
- Visual: compare against Webflow admissions how-to section at 375px, 768px, 1440px
- axe-core: ordered list is semantically correct, zero critical violations

## Recommended Skills
- `#senior-fullstack` — component extraction
- `#frontend-design` — two-column layout with numbered steps

## Story Points: 2
*Sizing rationale: Two-column layout + numbered steps list + content JSON extraction.*

## Definition of Done
- [ ] `src/components/sections/AdmissionsHowToApplySection.tsx` created
- [ ] Added to `src/components/sections/index.ts`
- [ ] Inline section JSX removed from `src/app/admissions/page.tsx`
- [ ] Steps content sourced from `src/content/admissions.json`
- [ ] No inline styles
- [ ] Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the Admissions page loads, When AdmissionsHowToApplySection renders, Then the two-column layout with intro and numbered steps matches the Webflow source at 1440px
- [ ] #2 Given the steps prop is populated, When the section renders, Then each step displays its number, title, and body text sourced from content JSON
- [ ] #3 Given the user is on a 375px wide screen, When AdmissionsHowToApplySection renders, Then the two-column layout collapses to single-column and all steps are readable with no horizontal scroll
<!-- AC:END -->
