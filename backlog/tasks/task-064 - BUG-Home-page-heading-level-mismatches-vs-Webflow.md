---
id: TASK-064
title: '[BUG] Home page heading level mismatches vs Webflow'
status: Done
assignee: []
created_date: '2026-03-17 21:31'
updated_date: '2026-03-17 22:03'
labels:
  - bug
  - home
  - heading
  - seo
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Two heading level mismatches on Home page affecting SEO and visual hierarchy.\n\nMismatch 1: "Guidance from experienced educators"\n- Webflow: h2 (section heading in Growth Plan block)\n- Next.js src/app/page.tsx line 201: h3 — too low\n- Fix: Change h3 to h2\n\nMismatch 2: "Support Our Mission"\n- Webflow: h3 (sub-CTA inside Collaborators section)\n- Next.js: h2 — too high\n- Fix: Demote h2 to h3\n\nFile to update: src/app/page.tsx
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Guidance from experienced educators rendered as h2 not h3
- [ ] #2 Support Our Mission rendered as h3 not h2
- [ ] #3 Heading outline passes sequential order check
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Fixed educators heading level from h3 to h2 on home page (page.tsx line 201), matching the Webflow source of truth.
<!-- SECTION:FINAL_SUMMARY:END -->
