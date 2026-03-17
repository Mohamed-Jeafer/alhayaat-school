---
id: TASK-060
title: >-
  [P3] Complete School Plans page: plan cards with accent bars, checkmark
  bullets, decorative SVGs
status: To Do
assignee: []
created_date: '2026-03-17 11:19'
labels:
  - P3
  - page-migration
  - school-plans
milestone: m-3
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
School Plans page missing card layout and decoratives. Depends on TASK-049.

From al-hayaat.webflow/school-plans.html:
1. school-plans-card-container: grid of plan cards. Each school-plans-card: flex-column, justify-content space-between, bg #fff, border 1px #d9d9d9, border-radius 1.25rem, padding 1.625rem, overflow hidden.
2. school-plan-shadow: accent bar, height 0.75rem, position absolute bottom 0 left 0 right 0. Variants: is-yellow = --brand--yellow, default = --brand--orange.
3. Bullet list: list-item class, background-image list-check.svg, background-position 5px 5px, no-repeat, padding-left 2.5rem, margin-bottom 1rem.
4. Decoratives: school-plans-decor-1 through decor-6 (SVG shapes, absolutely positioned).
5. section_school-plan-our-mission: Secondary section below cards.

Files: src/app/school-plan/page.tsx, src/content/school-plan.json. Dependencies: TASK-047, TASK-049
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 School plan cards render with 0.75rem absolute-positioned accent bar at bottom (is-yellow or is-orange)
- [ ] #2 Cards: bg #fff, border 1px #d9d9d9, border-radius 1.25rem, padding 1.625rem, overflow hidden
- [ ] #3 Bullet lists use list-check.svg background-image, padding-left 2.5rem, background-position 5px 5px
- [ ] #4 All 6 decorative SVG elements (school-plans-decor-1 to decor-6) positioned absolutely
- [ ] #5 All plan content sourced from src/content/school-plan.json
<!-- AC:END -->
