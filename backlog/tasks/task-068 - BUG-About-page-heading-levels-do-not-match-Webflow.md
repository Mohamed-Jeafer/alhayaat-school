---
id: TASK-068
title: '[BUG] About page heading levels do not match Webflow'
status: To Do
assignee: []
created_date: '2026-03-17 21:34'
labels: []
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Three heading level issues on the About page. First, the section Our Mission Vision and Values is rendered as h2 in Next.js but Webflow uses h3, needs to be demoted. Also Webflow uses Value singular while Next.js uses Values plural, confirm correct text with school. Second, team member names are rendered as h3 in Next.js but Webflow uses h4, needs to be demoted. Third, the principal name is spelled Mohebb in Webflow and Mohebbi in Next.js, confirm correct spelling with school. Update src/app/about/page.tsx and src/content/about.json.
<!-- SECTION:DESCRIPTION:END -->
