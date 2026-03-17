---
id: TASK-055
title: '[P3] Complete Curriculum page migration: hero, 2-column layout, subject cards'
status: Done
assignee: []
created_date: '2026-03-17 11:17'
updated_date: '2026-03-17 12:21'
labels:
  - P3
  - page-migration
  - curriculum
milestone: m-3
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The curriculum page is almost entirely incomplete. Missing hero image, 2-column layout, subject cards with icons, and decorative elements. Current Next.js version is a basic stub.

From al-hayaat.webflow/academic-and-curriculum.html:
1. section_academic-hero: Full-width hero with aspect-ratio 2.39 image wrapper
2. section_academic-curriculum: 2-column layout (5rem gap). Left: heading + intro (max-width 32rem). Right: 2-col grid of subjects (gap 1.375rem), each cell has academic-icon (1.5rem x 1.5rem) + subject name.
3. section_academic-growth: Expansion info section.
4. Decorative: dotted-decoration (270x254px) absolutely positioned bottom-right.

Files to update: src/app/curriculum/page.tsx, src/content/curriculum.json.
Dependencies: TASK-047 (images), TASK-052 (design tokens)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Hero section with academic-hero-image-wrapper renders with aspect-ratio 2.39
- [ ] #2 2-column layout: left heading/intro (max-width 32rem), right subject grid (2-col, 1.375rem gap)
- [ ] #3 Each subject card has a 1.5rem icon and subject name text
- [ ] #4 Decorative dotted element (270x254px) positioned bottom-right of page
- [ ] #5 All text from src/content/curriculum.json with no hardcoded strings
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Rewrote src/app/curriculum/page.tsx with two-column hero layout, subject cards using ColoredBorderCard, and educators card. Hero uses MUN03200-1.png with decorative Frame-1362791621.webp overlay. Content from curriculum.json.
<!-- SECTION:FINAL_SUMMARY:END -->
