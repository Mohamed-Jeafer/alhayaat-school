---
id: task-081
title: About hero layout - stack text above full-width carousel
status: In Progress
priority: high
labels: [visual-qa]
created: 2026-03-17 19:38
---

## Description

WF Source: The about page hero stacks text header (centered, max-width 777px) ABOVE the auto-scroll carousel which spans full width. NJ currently uses side-by-side grid (text 0.8fr left, carousel 1.2fr right).

At x=720 on 1440px viewport, carousel only starts at x=689 and with -12% animation offset, NJ shows off-white instead of photo pixels.

## Fix

src/app/about/page.tsx: Change from grid layout to stacked layout:
- Remove the grid div wrapper
- Make text block centered with mx-auto max-w-[48rem] text-center
- Move AutoScrollCarousel OUTSIDE the Container (full viewport width, below the text)
- Section keeps overflow-hidden, pb-0 on Container, carousel gets its own pb-20 pt-8 div

About page was 64% pixel match - this should significantly improve it.