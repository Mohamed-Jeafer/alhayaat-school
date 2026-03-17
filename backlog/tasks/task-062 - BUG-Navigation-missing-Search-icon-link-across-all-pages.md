---
id: TASK-062
title: '[BUG] Navigation missing Search icon/link across all pages'
status: To Do
assignee: []
created_date: '2026-03-17 21:28'
labels:
  - bug
  - navigation
  - ui
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The Webflow navigation bar includes a **Search** link/icon that is completely absent from the Next.js implementation.

**Evidence from Playwright test output:**
- Webflow nav links: `About us, School plan, Curriculum, Search, Careers, Donate, Contact`
- Next.js nav links: `Al-Hayaat School, Home, About Us, School Plan, Curriculum, Careers, Contact, Donate`
- The word "Search" is missing from all Next.js pages' navigation.

**Scope:** Affects every page — Home, About, Curriculum, Admissions, Careers, Contact, Donate, School Plans.

**Fix required in:** Navigation component (likely `src/components/Navigation.tsx` or similar layout component).
- Add a Search icon/button to the nav bar matching Webflow's placement.
- Decide if this should open a search overlay/modal or link to a `/search` page.
- Ensure it is accessible (aria-label="Search") and appears on both desktop and mobile nav.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Search icon/link present in nav on all pages
- [ ] #2 Matches Webflow nav placement (right side of nav)
- [ ] #3 Accessible with aria-label
- [ ] #4 Works on mobile nav menu as well
<!-- AC:END -->
