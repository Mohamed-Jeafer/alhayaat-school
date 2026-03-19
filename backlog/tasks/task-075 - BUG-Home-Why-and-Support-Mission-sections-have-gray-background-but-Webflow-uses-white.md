---
id: TASK-075
title: >-
  [BUG] Home Why and Support Mission sections have gray background but Webflow
  uses white
status: Done
assignee: []
created_date: '2026-03-17 22:33'
labels:
  - visual-qa
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
In src/app/page.tsx: Why section uses background="gray" and Support Mission uses background="gray". In Webflow both sections have no explicit background (white default). Fix: change both sections to background="white" in page.tsx. Also verify Why section decorative images (circle-light-green.webp, circle-light-orange.webp) are rendering.
<!-- SECTION:DESCRIPTION:END -->
