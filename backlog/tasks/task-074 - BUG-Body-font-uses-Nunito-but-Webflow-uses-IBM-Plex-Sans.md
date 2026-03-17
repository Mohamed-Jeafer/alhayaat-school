---
id: TASK-074
title: '[BUG] Body font uses Nunito but Webflow uses IBM Plex Sans'
status: Done
assignee: []
created_date: '2026-03-17 22:24'
updated_date: '2026-03-17 22:28'
labels: []
dependencies: []
priority: medium
---

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Fixed globals.css: --font-sans and body font-family changed from var(--font-body) (Nunito) to var(--font-base) (IBM Plex Sans), matching Webflow source of truth.
<!-- SECTION:FINAL_SUMMARY:END -->
