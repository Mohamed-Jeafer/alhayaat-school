---
id: TASK-080
title: Why section - add circle-light-green and circle-light-orange decorative images
status: Done
assignee: []
created_date: '2026-03-17 23:38'
updated_date: '2026-03-19 03:41'
labels:
  - visual-qa
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
WF Source: .section_home-why has position: relative. .green-decor {width: 29.1875rem; height: 29.1875rem; position: absolute; inset: -16rem -13rem auto auto;} (top-right corner). .orange-decor {z-index: -1; width: 29.1875rem; height: 29.1875rem; position: absolute; inset: auto auto -7rem -13rem;} (bottom-left corner). Both images exist at public/images/circle-light-green.webp and circle-light-orange.webp. Also update WHY_ICONS in home page.tsx to use vector-1.webp through vector-4.webp Image components instead of Lucide icons. WhyCard icon container: remove bg-muted, keep layout.
<!-- SECTION:DESCRIPTION:END -->
