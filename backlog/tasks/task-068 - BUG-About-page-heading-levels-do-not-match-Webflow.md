---
id: TASK-068
title: '[BUG] About page heading levels do not match Webflow'
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
Three heading level issues on the About page. First, the section Our Mission Vision and Values is rendered as h2 in Next.js but Webflow uses h3, needs to be demoted. Also Webflow uses Value singular while Next.js uses Values plural, confirm correct text with school. Second, team member names are rendered as h3 in Next.js but Webflow uses h4, needs to be demoted. Third, the principal name is spelled Mohebb in Webflow and Mohebbi in Next.js, confirm correct spelling with school. Update src/app/about/page.tsx and src/content/about.json.
<!-- SECTION:DESCRIPTION:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Fixed About page heading levels: missionVision section h2 → h3, team member name headings h3 → h4, matching Webflow heading hierarchy.
<!-- SECTION:FINAL_SUMMARY:END -->
