---
id: TASK-051
title: '[P2] Build AutoScrollCarousel component for About page hero'
status: Done
assignee: []
created_date: '2026-03-17 11:15'
updated_date: '2026-03-17 12:20'
labels:
  - P2
  - ui-component
  - animation
milestone: m-2
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The About page hero in Webflow has a continuously auto-scrolling image carousel (not a click-through slider). It shows 6 school photos scrolling left in an infinite loop via CSS animation. The Next.js About page has no carousel at all.

Webflow source: al-hayaat.webflow/about.html section_about-hero
- about-hero-mask: overflow hidden container
- Two about-hero-slide rows (duplicate for seamless loop), each with 6 about-hero-image divs
- Each image: 444px x 339px, object-fit cover, border-radius 0.5rem
- Gap between images: 1.6875rem
- Both slide rows start at transform: translate3d(-12%, 0, 0)
- Animation: CSS keyframes scrolling continuously left
- Images: MUN03200-1.png, MUN03349-1.png, MUN03448-1.png, MUN03541-1.png, MUN03667.png, MUN03627.png

Files to create/update:
- src/components/ui/AutoScrollCarousel.tsx (new component)
- src/app/about/page.tsx (replace hero static image with carousel)
- src/content/about.json (add hero.carousel images array)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Auto-scrolling carousel renders school photos side by side with continuous leftward scroll animation
- [x] #2 Carousel duplicates slides for seamless infinite loop (two sets of images)
- [x] #3 Images styled with rounded corners and consistent gap between them
- [x] #4 CSS marquee animation used via @keyframes webflow-marquee in globals.css
- [x] #5 Component accepts images array prop with src and alt fields
- [x] #6 Mobile responsive — images scale proportionally
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Created `src/components/ui/AutoScrollCarousel.tsx` with duplicated image loop and `@keyframes webflow-marquee` CSS animation defined in `globals.css`. Accepts `images` array prop. Exported from `src/components/ui/index.ts`. Wired into `src/app/about/page.tsx` hero section.
<!-- SECTION:FINAL_SUMMARY:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Created `src/components/ui/AutoScrollCarousel.tsx` — a client component looping hero images via `@keyframes webflow-marquee`. Accepts an `images` array, duplicates for seamless looping. Wired into About page hero via `about.json hero.carousel`.
<!-- SECTION:FINAL_SUMMARY:END -->
