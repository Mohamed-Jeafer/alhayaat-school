---
id: TASK-071
title: >-
  [BUG] Home hero section background is black — should be white with colored
  sparkle image
status: To Do
assignee: []
created_date: '2026-03-17 22:22'
labels: []
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Pixel analysis: Webflow home hero (y=0 to y=600) is white (255,255,255). Next.js home hero in src/app/page.tsx uses bg-black which renders as (0,0,0). The glitter-bg.webp image has a WHITE background with colored sparkle particles on top. The Next.js code uses bg-black behind it which is wrong.

REQUIRED CHANGES to src/app/page.tsx hero section (around line 45):
1. Change section className from bg-black to bg-white
2. Remove opacity-90 from the glitter Image (white bg on white needs full opacity or reconsider)
3. Change h1 className from text-white to text-brand-black (the actual Webflow h1 is dark text)
4. Change p (subtext) className from text-white/80 to text-brand-black/75
5. The glitter-bg.webp image itself has white background, so it should show colored sparkles on white section
6. The dashlines and dots overlay images — check if they are for dark or light backgrounds; if dark-only, may need to hide or replace
7. Update the alt text in home.json (glitter.alt if it exists) — it currently says or implies dark background, correct to reflect white background

Also fix wrong alt text in src/components/ui/HeroSection.tsx line 10 referencing glitter — the user confirmed the background is WHITE not black. Update any image alt text that says Black background to White background.
<!-- SECTION:DESCRIPTION:END -->
