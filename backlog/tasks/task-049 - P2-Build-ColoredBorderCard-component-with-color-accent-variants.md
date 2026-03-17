---
id: TASK-049
title: '[P2] Build ColoredBorderCard component with color accent variants'
status: To Do
assignee: []
created_date: '2026-03-17 11:14'
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
- [ ] #1 ColoredBorderCard renders with 0.625rem colored bottom border in all 5 variants: is-yellow, is-orange, is-blue, is-green, is-red
- [ ] #2 Card has background #fcfcfc, border 1px solid #d9d9d9, border-radius 1.25rem, padding 1.75rem
- [ ] #3 Component accepts children, variant, and optional icon props
- [ ] #4 Component is reused in Admissions, Donate, and School Plans pages without duplication
- [ ] #5 SchoolPlanCard subvariant has 0.75rem accent bar at bottom (absolute positioned)
<!-- AC:END -->
