---
id: TASK-065
title: '[BUG] Home page missing News and Announcements section'
status: Done
assignee: []
created_date: '2026-03-17 21:32'
updated_date: '2026-03-17 22:03'
labels:
  - bug
  - home
  - content
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Webflow index.html has h2 News and announcements section with 3 blog article preview cards, positioned between Our collaborators and Join our community. Next.js Home page and src/content/home.json have no news section at all. Fix: add news key to home.json with 3 articles, build NewsSection component in src/app/page.tsx, render between Collaborators and finalCta. Article: Think Before You Act! 3 Ways to Develop Impulse Control in Your Child.
<!-- SECTION:DESCRIPTION:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added News & Announcements section to home page. Added news object with 3 articles to home.json and inserted the section into page.tsx between Collaborators and Support Our Mission, with a NewsArticle type definition.
<!-- SECTION:FINAL_SUMMARY:END -->
