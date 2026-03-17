---
id: TASK-069
title: '[BUG] Careers page missing Join our Team heading'
status: Done
assignee: []
created_date: '2026-03-17 21:34'
updated_date: '2026-03-17 22:03'
labels: []
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Webflow careers.html starts with h2 Join our Team as a top section label before the h1 hero. This heading does not exist in the Next.js careers page. The Webflow heading order is: h2 Join our Team, h1 Ready to make an Impact, h2 Welcome to Al-Hayaat School, h2 Why Join, h2 Current Job Openings. The Next.js careers.json has keys intro, why_join, openings, cta but no join heading. Add join_heading to careers.json and render as h2 above the hero in src/app/careers/page.tsx.
<!-- SECTION:DESCRIPTION:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added "Join our Team" h2 eyebrow heading to careers page. Added join_heading to careers.json hero object and rendered it as an h2 above PageHeader in careers/page.tsx.
<!-- SECTION:FINAL_SUMMARY:END -->
