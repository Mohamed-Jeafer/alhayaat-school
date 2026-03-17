---
id: TASK-052
title: '[P1] Fix design tokens and typography to match Webflow brand'
status: Done
assignee: []
created_date: '2026-03-17 11:15'
updated_date: '2026-03-17 11:38'
labels:
  - design-system
  - P1
  - foundation
milestone: m-1
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Next.js uses wrong brand colors and missing fonts vs Webflow. Replace hardcoded #1e3a5f with correct #1453a5 blue. Add full 12-token palette and all Google Fonts to Tailwind config.

Brand colors to add (from al-hayaat.webflow/css/al-hayaat.webflow.css :root):
- --brand--blue: #1453a5 (currently WRONG as #1e3a5f in Next.js)
- --brand--yellow: #ffcc29
- --brand--green: #097a53
- --brand--orange: #f7932d
- --brand--orange-light: #fbbb7d
- --brand--off-white: #f4f4f4
- --brand--off-white-background: #fffcf9
- --brand--cyan-light: #8fd4d7
- --brand--cyan: #12b6b5
- --brand--green-2: #54bf9e
- --brand--blue-light: #72b3e2
- --brand--yellow-light: #ffe08a
- --brand--font-color-black: #1e1e1e

Fonts to add via next/font/google in layout.tsx:
- Dongle (weight 400) - ALL headings h1-h5; h1 = 6.9375rem/line-height 0.65
- Open Sans - heading-style-h1 through h3 classes
- Nunito - body text / .text-size-large / .text-size-medium
- Inter - buttons
- IBM Plex Sans - base body font
- Amiri Quran - Arabic text (donate page, RTL direction)

Files to update:
- tailwind.config.ts: extend colors + fontFamily with brand tokens
- src/app/layout.tsx: import all fonts via next/font/google, apply CSS variables
- src/app/globals.css: add :root block with all --brand--* CSS custom properties
- Search/replace all hardcoded #1e3a5f occurrences across src/ (affects all pages and components)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 All 12 brand color tokens in tailwind.config.ts match Webflow :root exactly
- [ ] #2 Dongle font applied to h1-h5 headings; Open Sans on heading classes; Nunito on body; Inter on buttons
- [ ] #3 No hardcoded #1e3a5f remains in src/
- [ ] #4 globals.css defines all Webflow brand CSS custom properties
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Completed first brand-system pass: imported Webflow-aligned fonts in `src/app/layout.tsx`, added brand CSS variables/theme tokens in `src/app/globals.css`, updated `tailwind.config.ts`, and replaced old `#1e3a5f` literals in `src/` with `#1453a5`.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Aligned the global brand system with Webflow by importing the Webflow font stack in `src/app/layout.tsx`, defining brand CSS variables in `src/app/globals.css`, updating `tailwind.config.ts`, and replacing the old `#1e3a5f` primary blue literals across `src/` with the Webflow `#1453a5`.
<!-- SECTION:FINAL_SUMMARY:END -->
