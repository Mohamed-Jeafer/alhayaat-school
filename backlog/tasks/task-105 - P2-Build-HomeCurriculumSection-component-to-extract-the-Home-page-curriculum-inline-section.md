---
id: TASK-105
title: >-
  [P2] Build HomeCurriculumSection component to extract the Home page curriculum
  inline section
status: Done
assignee: []
created_date: '2026-03-19 15:16'
updated_date: '2026-03-19 19:24'
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
As a prospective parent browsing the school website, I want to see a clear overview of the curriculum with subject icons and an enroll CTA, so that I understand what subjects my child will study before clicking through to the full curriculum page.

## Business Context
The curriculum section on the Home page is a two-column layout with a heading, intro text, a subject icon list, and a CTA button. Currently it is inline JSX in `src/app/page.tsx`. Extracting it to `HomeCurriculumSection` makes it independently replaceable and testable.

## Technical Specification
- Create `src/components/sections/HomeCurriculumSection.tsx`
- Props: `{ headline: string; intro: string; subjects: { icon: string; label: string }[]; cta: { label: string; href: string }; className?: string }`
- Two-column layout: text+CTA on left, subject icons grid on right
- Uses existing `SubjectIcons` from `src/components/ui/icons/SubjectIcons.tsx`
- All images via `next/image`
- Rendering: SSG — static content
- Stack constraints: Tailwind only, no inline styles
- Phase dependencies: TASK-099 (sections/ barrel)
- Spec reference: `docs/plans/2026-03-19-section-componentization-design.md`

## Content Extraction
- Source file: `al-hayaat.webflow/index.html`
- Target file: `src/content/home.json` — add `curriculum` key
- Sections to extract: `home-curriculum-section`
- Shared content: Subject list may be shared with curriculum page — evaluate for `_shared.json`

## Reusable Components
- `HomeCurriculumSection` — `src/components/sections/HomeCurriculumSection.tsx`

## Testing & Validation
- Unit: render with full subjects array, render with empty subjects array, snapshot
- Visual: compare against Webflow home curriculum section at 375px, 768px, 1440px
- Lighthouse targets: Performance >90, Accessibility >95
- axe-core: subject icons have alt text, zero critical violations

## Recommended Skills
- `#senior-fullstack` — component extraction, icon grid layout
- `#frontend-design` — two-column layout fidelity

## Story Points: 2
*Sizing rationale: Two-column layout with icon grid, content JSON extraction.*

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 `src/components/sections/HomeCurriculumSection.tsx` created with typed props
- [ ] #2 Added to `src/components/sections/index.ts`
- [ ] #3 Inline curriculum JSX removed from `src/app/page.tsx`
- [ ] #4 All text sourced from `src/content/home.json`
- [ ] #5 No inline styles, no raw `<img>` tags
- [ ] #6 Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->

<!-- DOD:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the Home page loads, When HomeCurriculumSection renders, Then the two-column layout with heading, intro text, subject icons, and CTA button matches the Webflow source at 1440px
- [ ] #2 Given the subjects prop is populated, When HomeCurriculumSection renders, Then each subject icon renders with a visible label and accessible alt text
- [ ] #3 Given the subjects prop is an empty array, When HomeCurriculumSection renders, Then the section renders without errors and shows no broken icon slots
- [ ] #4 Given the user is on a 375px wide screen, When HomeCurriculumSection renders, Then the two-column layout collapses to single-column and no horizontal scroll occurs
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Extracted home-curriculum-section (~22 lines) from page.tsx into HomeCurriculumSection. Props: id?, heading, intro, subjects (string[]), cta, className?. Uses subjectIconList internally indexed by position to match existing behaviour. Removed SUBJECT_ICONS constant and subjectIconList import from page.tsx. Barrel updated. Zero TS errors. page.tsx is shorter.
<!-- SECTION:FINAL_SUMMARY:END -->
