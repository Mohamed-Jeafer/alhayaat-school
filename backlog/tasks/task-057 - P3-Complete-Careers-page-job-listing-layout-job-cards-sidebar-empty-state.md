---
id: TASK-057
title: >-
  [P3] Complete Careers page: job listing layout, job cards, sidebar, empty
  state
status: Done
assignee: []
created_date: '2026-03-17 11:18'
updated_date: '2026-03-17 12:21'
labels:
  - P3
  - page-migration
  - careers
milestone: m-3
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The Careers page is missing the job listings layout, job cards, sidebar, and empty state. The current implementation is a basic stub without Webflow visual structure.

From al-hayaat.webflow/careers.html:
1. jobs__sticky: Sidebar with sticky positioning (top: 6rem) - for filters or contact info.
2. jobs__content: Main content area with flex layout alongside sidebar.
3. jobs__list-wrapper: Container for the job list.
4. jobs__list: Flex column, gap 1rem.
5. jobs__item: Individual job card with:
   - heading-large: font-size 2rem, font-weight 700
   - Title section: margin-bottom 1.5rem
   - text-small: 0.875rem, line-height 140% for metadata (department, location, type)
   - Apply CTA button
6. empty-state: Message when no jobs are available.
7. Individual job detail page already exists at /careers/elementary-school-teacher but needs consistent styling.

Files: src/app/careers/page.tsx, src/content/careers.json.
Dependencies: TASK-052 (design tokens), TASK-048 (Button)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Jobs list renders with jobs__list flex-column layout (gap 1rem) and individual jobs__item cards
- [ ] #2 Each job card shows title (2rem, weight 700), department, location, type, and Apply button
- [ ] #3 Empty state message displays when no jobs are in the list
- [ ] #4 Job detail page at /careers/[slug] renders full job description
- [ ] #5 jobs__sticky sidebar renders on desktop (position sticky, top 6rem)
- [ ] #6 Careers page text sourced from src/content/careers.json
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Rewrote src/app/careers/page.tsx. Sections: page header, intro, Why Join cards (2-col ColoredBorderCard grid), job listing with green-accent cards and qualification checklists, and support-mission section with image and payment logos.
<!-- SECTION:FINAL_SUMMARY:END -->
