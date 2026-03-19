---
id: TASK-106
title: >-
  [P2] Build AboutHeroCarouselSection component to extract the About page
  carousel inline section
status: In Progress
assignee: []
created_date: '2026-03-19 15:16'
updated_date: '2026-03-19 19:30'
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
As a school visitor viewing the About page, I want to see an auto-scrolling image carousel of the school, so that I get a visual sense of the school environment before reading about the mission.

## Business Context
The About page carousel is a raw `<section>` tag wrapping `<AutoScrollCarousel>` with an off-white background. Extracting it to `AboutHeroCarouselSection` makes the carousel independently replaceable and ensures background/padding are standardized.

## Technical Specification
- Create `src/components/sections/AboutHeroCarouselSection.tsx`
- Props: `{ images: { src: string; alt: string }[]; className?: string }`
- Wraps `<AutoScrollCarousel>` from `src/components/ui/AutoScrollCarousel.tsx`
- Background: off-white (`bg-[#f5f5f0]` or equivalent design token)
- All images via `next/image`
- Rendering: SSG — static images
- Stack constraints: Tailwind only, no inline styles
- Phase dependencies: TASK-099 (sections/ barrel)
- Spec reference: `docs/plans/2026-03-19-section-componentization-design.md`

## Content Extraction
- Source file: `al-hayaat.webflow/about.html`
- Target file: `src/content/about.json` — add `carousel.images` array with src + alt per image
- Sections to extract: `about-hero-carousel-section`
- Webflow markup patterns: `w-slider` or image grid — extract image filenames and alt attributes

## Reusable Components
- `AboutHeroCarouselSection` — `src/components/sections/AboutHeroCarouselSection.tsx`
- `AutoScrollCarousel` — existing, `src/components/ui/AutoScrollCarousel.tsx`

## Testing & Validation
- Unit: render with images array, render with empty images array (graceful fallback), snapshot
- Visual: compare against Webflow about carousel at 375px, 768px, 1440px
- Lighthouse targets: Performance >90, Accessibility >95
- axe-core: all carousel images have non-empty alt attributes

## Recommended Skills
- `#senior-fullstack` — component extraction
- `#frontend-design` — carousel section layout fidelity

## Story Points: 2
*Sizing rationale: Wrapper component + content JSON image array extraction.*

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 `src/components/sections/AboutHeroCarouselSection.tsx` created
- [ ] #2 Added to `src/components/sections/index.ts`
- [ ] #3 Inline carousel JSX removed from `src/app/about/page.tsx`
- [ ] #4 Image array sourced from `src/content/about.json`
- [ ] #5 All images use `next/image` with non-empty alt
- [ ] #6 No inline styles
- [ ] #7 Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->
<!-- DOD:END -->



## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the About page loads, When AboutHeroCarouselSection renders, Then the auto-scrolling carousel displays school images matching the Webflow source at 1440px
- [ ] #2 Given the images prop contains entries, When the carousel renders, Then each image uses next/image and has a non-empty alt attribute
- [ ] #3 Given the images prop is an empty array, When AboutHeroCarouselSection renders, Then the section renders without errors and shows no broken image slots
- [ ] #4 Given the user is on a 375px wide screen, When AboutHeroCarouselSection renders, Then the carousel is contained within the viewport with no horizontal scroll
<!-- AC:END -->
