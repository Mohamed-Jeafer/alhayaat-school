---
id: TASK-061
title: >-
  [P3] Complete Admissions page: enrollment cards, why-choose, requirements, fee
  table
status: To Do
assignee: []
created_date: '2026-03-17 11:19'
labels:
  - P3
  - page-migration
  - admissions
milestone: m-3
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Admissions page missing 4 major sections. Depends on TASK-049 (ColoredBorderCard).

From al-hayaat.webflow/admission.html:
1. section_admission-enroll: ColoredBorderCards, is-yellow + is-orange variants, bg #fcfcfc.
2. section_admission-why-choose: 3-col grid, cards with light transparent bg, header with 1px bottom border, icon+text button links.
3. section_registration-requirements: Flex-wrap grid. Each card: flex-row, 30px icon (order-1), border 1px #d9d9d9, radius 0.625rem, padding 1.5rem 2rem 1.5rem 1.5rem.
4. section_school-fee: 3-col table (Program, Grade, Fee). Row uses grid display. Header row bg #fbfcfd. Cells: padding 1.1875rem 1rem.
5. section_how-to-apply: 2-col layout. Left: header max-width 32rem. Right: step-by-step list, max-width 45rem, padding 5rem vertical.

Files: src/app/admissions/page.tsx, src/content/admissions.json. Dependencies: TASK-049
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Enrollment cards use ColoredBorderCard with is-yellow and is-orange variants (bg #fcfcfc)
- [ ] #2 Why-Choose: 3-column grid with semi-transparent light bg cards, header border bottom, icon links
- [ ] #3 Registration requirements: flex-wrap grid, each card has 30px icon, 1px gray border, 0.625rem radius
- [ ] #4 Fee table: 3 columns (Program, Grade, Fee), header row light gray bg, consistent cell padding
- [ ] #5 How-to-apply: 2-column layout, header left, step list right
- [ ] #6 All text from src/content/admissions.json
<!-- AC:END -->
