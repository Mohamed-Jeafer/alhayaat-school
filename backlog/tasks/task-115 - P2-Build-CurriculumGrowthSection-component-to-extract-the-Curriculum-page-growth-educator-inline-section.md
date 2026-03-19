---
id: TASK-115
title: >-
  [P2] Build CurriculumGrowthSection component to extract the Curriculum page
  growth/educator inline section
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
As a school visitor reading the Curriculum page, I want to see a visually distinctive growth section with an educator image and supporting statistics, so that I understand the school's track record of student development.

## Business Context
The curriculum growth section is a custom blue card with an absolutely-positioned educator image, decorative SVGs, and a yellow bottom border. Currently it is a raw `<div>` with custom padding classes in `src/app/curriculum/page.tsx` — the only section that doesn't use the `<Section>` primitive. Extracting it to `CurriculumGrowthSection` encapsulates this bespoke layout and ensures it uses proper Tailwind tokens instead of arbitrary values.

## Technical Specification
- Create `src/components/sections/CurriculumGrowthSection.tsx`
- Props: `{ headline: string; stats: { value: string; label: string }[]; educatorImage: { src: string; alt: string }; className?: string }`
- Blue card background, yellow bottom border — Tailwind design tokens only (no arbitrary `#hex` values unless design token is defined)
- Educator image positioned via Tailwind absolute/relative classes, `next/image`
- Decorative SVGs included internally
- Rendering: SSG — static content
- Stack constraints: Tailwind only, no inline styles
- Phase dependencies: TASK-099 (sections/ barrel)

## Content Extraction
- Source file: `al-hayaat.webflow/academic-and-curriculum.html`
- Target file: `src/content/curriculum.json` — add `growth` key
- Sections to extract: `curriculum-growth-section`

## Reusable Components
- `CurriculumGrowthSection` — `src/components/sections/CurriculumGrowthSection.tsx`

## Testing & Validation
- Unit: render with stats array, render with empty stats, snapshot
- Visual: compare against Webflow curriculum growth section at 375px, 768px, 1440px — pay special attention to educator image positioning
- Lighthouse targets: Performance >90, Accessibility >95
- axe-core: educator image has alt text, decorative SVGs have aria-hidden

## Recommended Skills
- `#senior-fullstack` — complex positioned layout extraction
- `#frontend-design` — blue card with absolute image and decorative elements

## Story Points: 3
*Sizing rationale: Bespoke layout with absolute positioning, decorative SVGs, design token enforcement.*

## Definition of Done
- [ ] `src/components/sections/CurriculumGrowthSection.tsx` created
- [ ] Added to `src/components/sections/index.ts`
- [ ] Inline section JSX removed from `src/app/curriculum/page.tsx`
- [ ] All content sourced from `src/content/curriculum.json`
- [ ] No arbitrary CSS hex values — Tailwind design tokens only
- [ ] Educator image uses `next/image` with alt text
- [ ] Decorative SVGs have `aria-hidden="true"`
- [ ] No inline styles
- [ ] Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the Curriculum page loads, When CurriculumGrowthSection renders, Then the blue card with educator image, stats, and yellow bottom border matches the Webflow source at 1440px
- [ ] #2 Given the stats prop is populated, When the section renders, Then each stat value and label displays correctly sourced from content JSON
- [ ] #3 Given the educatorImage prop is provided, When the section renders, Then the image uses next/image and is positioned correctly without overflow
- [ ] #4 Given the user is on a 375px wide screen, When CurriculumGrowthSection renders, Then the layout adapts gracefully — educator image does not overflow the card and all text is readable
<!-- AC:END -->
