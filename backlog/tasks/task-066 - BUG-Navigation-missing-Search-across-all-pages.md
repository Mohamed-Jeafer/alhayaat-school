---
id: TASK-066
title: '[BUG] Navigation missing Search across all pages'
status: Done
assignee: []
created_date: '2026-03-17 21:33'
updated_date: '2026-03-17 22:03'
labels:
  - bug
  - navigation
  - ui
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Webflow navigation includes a Search link between Curriculum and Careers. Next.js navigation does not have Search at all. Add a Search icon or button to the Navigation component. It should work on both desktop and mobile. Use aria-label Search for accessibility. Decide whether clicking opens a search modal or navigates to a /search page.
<!-- SECTION:DESCRIPTION:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added Search button to navigation. Desktop nav: Search button with icon + visible "Search" text moved inside the nav element. Mobile nav: Search row with icon + label added after nav links. Both match Webflow source of truth where Search appears as a named nav item.
<!-- SECTION:FINAL_SUMMARY:END -->
