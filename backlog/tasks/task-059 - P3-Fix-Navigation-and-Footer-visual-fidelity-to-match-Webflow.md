---
id: TASK-059
title: '[P3] Fix Navigation and Footer visual fidelity to match Webflow'
status: Done
assignee: []
created_date: '2026-03-17 11:18'
updated_date: '2026-03-17 11:38'
labels:
  - P3
  - page-migration
  - nav
  - footer
milestone: m-3
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Nav and Footer exist but need visual fidelity fixes to match Webflow.

NAV gaps: Logo should be al-hayaat-logo-img.png (3.5rem). Nav links: 1.125rem size, hover color --brand--blue. Active: font-weight 500. Hamburger: 3 line divs animating to X on open. Donate button in nav-right: is-secondary (green bg) + heart SVG icon.

FOOTER gaps: footer-logo 3rem image. social-link circles: 2.125rem, --brand--green bg, centered icons for Facebook/Instagram. footer-link: opacity 0.8 default, transition 0.3s, hover --brand--blue + opacity 1.0. footer-bottom: legal/copyright info.

Files: src/components/layout/Navigation.tsx, src/components/layout/Footer.tsx, src/content/_shared.json
Dependencies: TASK-047 (images), TASK-052 (design tokens)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Nav logo uses al-hayaat-logo-img.png at 3.5rem x 3.5rem
- [ ] #2 Active nav link has font-weight 500; hover transitions to --brand--blue in 0.3s
- [ ] #3 Hamburger shows 3 animated lines and collapses nav on mobile (medium breakpoint)
- [ ] #4 Footer social links are 2.125rem green circles with centered SVG icons
- [ ] #5 Footer links at opacity 0.8 rest, hover to 1.0 and blue in 0.3s transition
- [ ] #6 Nav donate button has green (is-secondary) background with heart icon
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Completed shared layout fidelity pass: corrected shared routes/logo path in `_shared.json`, switched the header to the black Webflow treatment, updated CTA styling/mobile menu, and rebuilt the footer with the lighter Webflow palette, green social buttons, and blue hover states.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Updated shared layout surfaces to match Webflow more closely: corrected shared navigation/footer routes, switched the header to the black Webflow treatment, migrated to the Webflow logo asset, restyled the donate CTA and mobile menu, and rebuilt the footer using the lighter Webflow palette with green social buttons and blue hover states.
<!-- SECTION:FINAL_SUMMARY:END -->
