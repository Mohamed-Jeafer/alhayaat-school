---
id: TASK-112
title: >-
  [P2] Build AdmissionsRequirementsSection component to extract the Admissions
  requirements inline section
status: Done
assignee: []
created_date: '2026-03-19 15:18'
updated_date: '2026-03-19 20:23'
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
As a prospective family on the Admissions page, I want to see downloadable application forms, required documents, and fees in one section, so that I can prepare everything needed before submitting.

## Business Context
The requirements section combines a download forms grid, a required documents list, and a fees checklist. Currently inline in `src/app/admissions/page.tsx`. Extracting it to a single component makes the requirements independently maintainable.

## Technical Specification
- Create `src/components/sections/AdmissionsRequirementsSection.tsx`
- Props: `{ headline: string; forms: { label: string; href: string }[]; documents: string[]; fees: string[]; className?: string }`
- Download form links rendered as anchor tags
- Documents and fees rendered as styled lists
- Rendering: SSG — static content
- Stack constraints: Tailwind only, no inline styles
- Phase dependencies: TASK-099 (sections/ barrel)

## Content Extraction
- Source file: `al-hayaat.webflow/admission.html`
- Target file: `src/content/admissions.json` — add `requirements` key

## Reusable Components
- `AdmissionsRequirementsSection` — `src/components/sections/AdmissionsRequirementsSection.tsx`

## Testing & Validation
- Unit: render with all props, render with empty forms array, snapshot
- Visual: compare against Webflow admissions requirements at 375px, 768px, 1440px
- axe-core: download links have descriptive text, lists are semantically correct

## Recommended Skills
- `#senior-fullstack` — component extraction

## Story Points: 2
*Sizing rationale: Three sub-lists + download links + content JSON extraction.*

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 `src/components/sections/AdmissionsRequirementsSection.tsx` created
- [ ] #2 Added to `src/components/sections/index.ts`
- [ ] #3 Inline section JSX removed from `src/app/admissions/page.tsx`
- [ ] #4 All content sourced from `src/content/admissions.json`
- [ ] #5 No inline styles
- [ ] #6 Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->
<!-- DOD:END -->



## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the Admissions page loads, When AdmissionsRequirementsSection renders, Then forms, documents, and fees all display matching the Webflow source at 1440px
- [ ] #2 Given the forms prop has items, When the section renders, Then each form renders as a downloadable link with a descriptive label
- [ ] #3 Given the forms prop is empty, When the section renders, Then the download forms area is hidden or shows an empty state without breaking the layout
- [ ] #4 Given the user is on a 375px wide screen, When AdmissionsRequirementsSection renders, Then all lists are readable and no horizontal scroll occurs
<!-- AC:END -->
