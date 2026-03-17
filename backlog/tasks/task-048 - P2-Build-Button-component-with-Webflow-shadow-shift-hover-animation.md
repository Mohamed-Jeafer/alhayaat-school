---
id: TASK-048
title: '[P2] Build Button component with Webflow shadow-shift hover animation'
status: Done
assignee: []
created_date: '2026-03-17 11:13'
updated_date: '2026-03-17 12:20'
labels:
  - P2
  - ui-component
  - animation
milestone: m-2
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Webflow buttons have a distinctive yellow shadow + hover transform animation that is entirely missing from the Next.js implementation. This is one of the most visible brand differences.

Webflow button CSS (al-hayaat.webflow/css/al-hayaat.webflow.css):
- Background: var(--brand--blue) = #1453a5
- Color: #fff
- Font-family: Inter, sans-serif
- Box-shadow at rest: 3px 3px 0 0 var(--brand--yellow), inset 0 1px 5.6px 0 #00000040
- Hover: box-shadow collapses to 0 0 0 0 var(--brand--yellow), button translates +3.5px/+3.5px
- Transition: all 0.3s

Variants from Webflow:
- .button.is-small — smaller padding
- .button.is-large — larger padding
- .button.is-secondary — var(--brand--green) background
- .button.is-text — transparent bg, text-only
- .button.is-icon — with SVG icon child (icon-embed-custom div)

Files to create/update:
- src/components/ui/Button.tsx — add shadow + transform hover, all variants via CVA
- Update all usages in page.tsx files to use the new Button component
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Primary button has yellow box-shadow: 3px 3px 0 0 #ffcc29 at rest
- [x] #2 On hover: shadow collapses to 0 and button translates (3.5px, 3.5px) with 0.3s transition
- [x] #3 is-secondary variant uses --brand--green background
- [x] #4 is-small, is-large, is-icon variants render correctly per Webflow CSS
- [x] #5 Button used consistently via variant prop — no duplicate button components exist
- [x] #6 All existing button usages in pages/components updated to new Button component
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Updated `src/components/ui/button.tsx` via CVA: added Webflow yellow shadow + translate hover animation to the `default` variant, added `secondary` variant with `--brand--green` background and matching shadow, and fixed a Base UI bug where rendering `<Link>` via the `render` prop while `nativeButton` was `true` caused a browser console error — resolved by auto-setting `nativeButton={false}` when `render` is used.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
`src/components/ui/button.tsx` now has the Webflow yellow shadow + translate hover animation on primary and secondary variants. Also fixed a Base UI `nativeButton` console error when the `render` prop is used with Link components.
<!-- SECTION:FINAL_SUMMARY:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented Webflow shadow-shift hover on Button: `shadow-[3px_3px_0_0_var(--brand--yellow)]` collapses on hover via translate. Also fixed Base UI `nativeButton` semantics — auto-sets `false` when `render` prop is used (e.g. Link), eliminating the browser console warning.
<!-- SECTION:FINAL_SUMMARY:END -->
