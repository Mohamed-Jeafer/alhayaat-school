---
id: TASK-119
title: >-
  [P2] Build DonateVerseSection component to extract the Donate page Quranic
  verse inline section
status: In Progress
assignee: []
created_date: '2026-03-19 15:21'
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
As a school supporter visiting the Donate page, I want to see a prominent Quranic verse in Arabic with English translation, so that I feel spiritually motivated to contribute before seeing the donation form.

## Business Context
The verse section is a centered block with Arabic text, English translation, and reference citation. Currently inline in `src/app/donate/page.tsx`. Extracting it to `DonateVerseSection` makes the spiritual framing independently swappable and the verse text sourced from content JSON.

## Technical Specification
- Create `src/components/sections/DonateVerseSection.tsx`
- Props: `{ arabic: string; translation: string; reference: string; className?: string }`
- Centered layout, Arabic text in RTL direction (`dir="rtl"`)
- Rendering: SSG — static content
- Stack constraints: Tailwind only, no inline styles
- Phase dependencies: TASK-099 (sections/ barrel)

## Content Extraction
- Source file: `al-hayaat.webflow/donate.html`
- Target file: `src/content/donate.json` — add `verse` key with arabic, translation, reference

## Reusable Components
- `DonateVerseSection` — `src/components/sections/DonateVerseSection.tsx`

## Testing & Validation
- Unit: render with all props, snapshot
- Visual: compare against Webflow donate verse section at 375px, 768px, 1440px
- axe-core: Arabic text has `lang="ar"` and `dir="rtl"` for correct screen reader pronunciation

## Recommended Skills
- `#senior-fullstack` — RTL text, component extraction
- `#frontend-design` — centered verse layout with Arabic typography

## Story Points: 2
*Sizing rationale: RTL text handling + Arabic typography consideration + content JSON extraction.*

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 `src/components/sections/DonateVerseSection.tsx` created
- [ ] #2 Added to `src/components/sections/index.ts`
- [ ] #3 Inline verse JSX removed from `src/app/donate/page.tsx`
- [ ] #4 Verse content sourced from `src/content/donate.json`
- [ ] #5 Arabic text has `lang="ar"` attribute and `dir="rtl"` direction
- [ ] #6 No inline styles
- [ ] #7 Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->
<!-- DOD:END -->



## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the Donate page loads, When DonateVerseSection renders, Then the Arabic verse, English translation, and reference are all visible matching the Webflow source at 1440px
- [ ] #2 Given the arabic prop is provided, When DonateVerseSection renders, Then the Arabic text has dir=rtl and lang=ar attributes for correct RTL rendering
- [ ] #3 Given a screen reader user visits the Donate page, When the verse section is reached, Then the Arabic text is announced with correct language and direction attributes
- [ ] #4 Given the user is on a 375px wide screen, When DonateVerseSection renders, Then the centered verse is readable with no horizontal scroll
<!-- AC:END -->
