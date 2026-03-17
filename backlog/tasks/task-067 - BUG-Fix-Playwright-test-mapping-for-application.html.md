---
id: TASK-067
title: '[BUG] Fix Playwright test mapping for application.html'
status: Done
assignee: []
created_date: '2026-03-17 21:34'
updated_date: '2026-03-17 22:03'
labels: []
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
tests/compare/helpers.ts maps application.html to the wrong Next.js route. Webflow application.html is the Elementary School Teacher job posting page not a student form. The correct Next.js route is /careers/elementary-school-teacher. Update the PAGES array entry. Add a comment noting that the student enrollment form at /admissions/apply has no Webflow HTML baseline.
<!-- SECTION:DESCRIPTION:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Fixed test mapping in helpers.ts: renamed Application → ElementaryTeacher and corrected nextjs path to /careers/elementary-school-teacher. Added note that /admissions/apply has no Webflow HTML baseline.
<!-- SECTION:FINAL_SUMMARY:END -->
