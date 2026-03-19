---
id: TASK-120
title: >-
  [P2] Build DonateInfoSection component to extract the Donate page info and
  form inline section
status: Done
assignee: []
created_date: '2026-03-19 15:22'
updated_date: '2026-03-19 20:29'
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
As a school supporter on the Donate page, I want to see donation impact information alongside the payment form, so that I feel informed and confident before completing my donation.

## Business Context
The donate info section is a two-column layout: donation info text and alternative payment method cards on the left, the Stripe `<DonationForm>` on the right. Currently inline in `src/app/donate/page.tsx`. Extracting it makes the layout independently testable.

## Technical Specification
- Create `src/components/sections/DonateInfoSection.tsx`
- Props: `{ headline: string; body: string; otherMethods: { label: string; instructions: string }[]; className?: string }`
- `<DonationForm>` composed internally (Stripe form, no configurable content)
- Other method cards use existing `ColoredBorderCard`
- Rendering: SSG layout, Client Component for Stripe form
- Stack constraints: Tailwind only, no inline styles
- Phase dependencies: TASK-099 (sections/ barrel)

## Content Extraction
- Source file: `al-hayaat.webflow/donate.html`
- Target file: `src/content/donate.json` — add `info` key with body and otherMethods

## Reusable Components
- `DonateInfoSection` — `src/components/sections/DonateInfoSection.tsx`
- `DonationForm` — existing, `src/components/donate/DonationForm.tsx`
- `ColoredBorderCard` — existing

## Testing & Validation
- Unit: render with props (mock DonationForm), snapshot layout
- Visual: compare against Webflow donate info section at 375px, 768px, 1440px
- axe-core: zero critical violations on layout

## Recommended Skills
- `#senior-fullstack` — component extraction, client/server boundary

## Story Points: 2
*Sizing rationale: Two-column layout + other methods cards + Stripe form composition.*

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 `src/components/sections/DonateInfoSection.tsx` created
- [ ] #2 Added to `src/components/sections/index.ts`
- [ ] #3 Inline section JSX removed from `src/app/donate/page.tsx`
- [ ] #4 Info content sourced from `src/content/donate.json`
- [ ] #5 No inline styles
- [ ] #6 Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->
<!-- DOD:END -->



## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the Donate page loads, When DonateInfoSection renders, Then the donation info text, alternative methods, and donation form are all visible in a two-column layout matching the Webflow source at 1440px
- [ ] #2 Given the otherMethods prop is populated, When the section renders, Then each method card displays its label and instructions sourced from content JSON
- [ ] #3 Given the user is on a 375px wide screen, When DonateInfoSection renders, Then the two-column layout stacks to single-column with info above the donation form
<!-- AC:END -->
