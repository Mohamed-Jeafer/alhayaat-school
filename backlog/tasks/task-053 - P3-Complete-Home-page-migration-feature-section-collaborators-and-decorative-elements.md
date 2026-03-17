---
id: TASK-053
title: >-
  [P3] Complete Home page migration: feature section, collaborators, and
  decorative elements
status: Done
assignee: []
created_date: '2026-03-17 11:16'
updated_date: '2026-03-17 12:21'
labels:
  - P3
  - page-migration
  - home
milestone: m-3
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The home page is missing two entire sections and all decorative visual elements that give it the Webflow visual identity.

Missing sections (from al-hayaat.webflow/index.html):
1. section_home-feature (BLUE background): Left side has text header + Islam calligraphy image + long body text. Right side has feature-image-wrapper with teacher photo (MUN03197-3241.png). 4 decorative circles: feature-decor-1 to decor-4 (SVG circles, colors cyan-light, yellow, green-2, white, ~34px each).

2. section_home-collaborator (off-white-background): Partner/collaborator cards grid. Card max-width 25.5625rem, image area with white background/border, content area with colored background (cyan-light/yellow/green-2), rounded corners 0.5rem.

Missing decorative elements on hero:
- home-hero-bg: glitter-bg.webp full background (2468px wide, responsive srcSet)
- home-hero-bg-line: dashlines.webp (2968px wide, bottom-positioned, ~20rem height)
- home-hero-dotted: Framedots.webp (253x130px, positioned decoratively)
- feature-decor-1 to decor-4: SVG circles in brand colors, absolutely positioned

Files to update:
- src/app/page.tsx (add missing sections)
- src/content/home.json (add feature and collaborator section content)
- public/images/ must be populated first (TASK-047)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Home page renders section_home-feature with blue background, 4 decorative circles (cyan-light, yellow, green-2, white), Islam calligraphy image, and teacher photo
- [ ] #2 section_home-collaborator renders partner cards with colored backgrounds (cyan-light, yellow, green-2) and 0.5rem border radius
- [ ] #3 Decorative SVGs render: glitter-bg.webp hero background, dashlines.webp, Framedots.webp dotted pattern
- [ ] #4 All text sourced from src/content/home.json; no hardcoded strings in JSX
- [ ] #5 All images use next/image with correct src, alt, sizes and srcSet
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Rewrote src/app/page.tsx to match the expanded home.json content model. Now renders hero with Webflow background, feature section with colored cards, collaborator logos, and support-mission section. Uses Webflow-aligned brand tokens throughout.
<!-- SECTION:FINAL_SUMMARY:END -->
