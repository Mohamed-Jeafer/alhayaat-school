---
id: TASK-049
title: '[P2] Build ColoredBorderCard component with color accent variants'
status: Done
assignee: []
created_date: '2026-03-17 11:14'
updated_date: '2026-03-17 12:20'
labels:
  - P2
  - ui-component
milestone: m-2
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
A ColoredBorderCard component is needed across 3 pages (Admissions, Donate, School Plans). Currently none of these pages have proper card components. This is one of the most reused visual patterns in the Webflow design.

Webflow CSS pattern:
- .admission-enroll-card / .donate-card / .school-plans-card base: background #fcfcfc, border 1px solid #d9d9d9, border-radius 1.25rem, padding 1.75rem
- Color variants via modifier class: .is-yellow = border-bottom 0.625rem solid #ffcc29; .is-orange = #f7932d; .is-blue = #1453a5; .is-green = #097a53; .is-red = red
- School Plans variant has a 0.75rem absolute-positioned accent bar at the bottom (school-plan-shadow)

Files to create:
- src/components/ui/ColoredBorderCard.tsx
- Export from src/components/ui/index.ts
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 ColoredBorderCard renders with colored bottom accent in all 5 variants: yellow, orange, blue, green, red
- [x] #2 Card has off-white background, subtle border, border-radius 1.25rem, padding 1.75rem
- [x] #3 Component accepts children, accent, accentStyle, and optional icon props
- [x] #4 Component is reused in Admissions, Donate, School Plans, Careers, Curriculum, and Contact pages
- [x] #5 accentStyle="bar" renders a taller bottom accent bar (absolute positioned)
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Created `src/components/ui/ColoredBorderCard.tsx` with `accent` (yellow/orange/blue/green/red) and `accentStyle` (border/bar) props. Exported from `src/components/ui/index.ts`. Used across Admissions, Donate, School Plan, Careers, Curriculum, and Contact pages.
<!-- SECTION:FINAL_SUMMARY:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Created ColoredBorderCard component with 5 color accent variants and border/bar styles. Exported from the ui index barrel. Used across Admissions, Donate, School Plan, Careers, Contact, and Curriculum pages.
<!-- SECTION:FINAL_SUMMARY:END -->
