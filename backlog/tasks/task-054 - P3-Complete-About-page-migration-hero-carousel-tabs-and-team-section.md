---
id: TASK-054
title: '[P3] Complete About page migration: hero carousel, tabs, and team section'
status: To Do
assignee: []
created_date: '2026-03-17 11:16'
labels:
  - P3
  - page-migration
  - about
milestone: m-3
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The About page has multiple critical gaps vs the Webflow implementation. Depends on TASK-050 (Tabs) and TASK-051 (AutoScrollCarousel).

Missing sections (from al-hayaat.webflow/about.html):

1. section_about-hero: Replace current static hero with AutoScrollCarousel (TASK-051). Add decor-about-1.webp (geometric shapes) and decor-about-2.webp (colored shapes) as absolutely positioned decorations. Add hero CTA button.

2. section_about-mission-vision: Currently shows all content stacked. Replace with Tabs component (TASK-050) - three tabs: Our Mission, Our Vision, Our Values. Each tab pane shows corresponding text content from about.json.

3. section_our-team: ENTIRE SECTION MISSING. Should show team member cards in a grid. Cards include photo, name, role/title. Extract team member data from al-hayaat.webflow/about.html into src/content/about.json team array.

Files to update:
- src/app/about/page.tsx
- src/content/about.json (add team members, mission/vision tabs content)

Dependencies: TASK-047 (images), TASK-050 (Tabs), TASK-051 (AutoScrollCarousel)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 About page hero renders AutoScrollCarousel with 6 school photos in continuous left-scroll animation
- [ ] #2 Mission/Vision/Values Tabs component renders with 3 tabs, active indicator, and 0.5/1.0 opacity states
- [ ] #3 Team section renders team member cards (section_our-team) with names, roles, and photos
- [ ] #4 Decorative elements render: decor-about-1.webp and decor-about-2.webp absolutely positioned in hero
- [ ] #5 All About page text sourced from src/content/about.json with no hardcoded strings
<!-- AC:END -->
