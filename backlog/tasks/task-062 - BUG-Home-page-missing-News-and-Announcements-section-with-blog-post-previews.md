---
id: TASK-062
title: >-
  [BUG] Home page missing "News and Announcements" section with blog post
  previews
status: To Do
assignee: []
created_date: '2026-03-17 21:28'
labels:
  - bug
  - home
  - content
  - missing-section
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The Webflow Home page (`index.html`) includes a **"News and announcements"** section (h2) with three blog article preview cards. This section is completely missing from the Next.js Home page.

**Webflow content found in `al-hayaat.webflow/index.html`:**
- h2: "News and announcements"
- Three article cards, each titled: "Think Before You Act! 3 Ways to Develop Impulse Control in Your Child"
- Section appears between "Our collaborators" and "Join our community" sections

**Current Next.js home.json sections:** `hero, feature, why, curriculum, growthPlan, supportMission, collaborators, finalCta` — no `news` or `announcements` key exists.

**Fix required:**
1. Add a `news` section to `src/content/home.json` with article data.
2. Build a NewsSection component in `src/app/page.tsx` rendering article preview cards.
3. Position it between the Collaborators section and the Join Our Community CTA.
4. Article cards should include: title, excerpt/description, date, and a "Read more" link.
5. If no CMS is wired, use static placeholder articles matching the Webflow style.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 h2 'News and announcements' section present on Home page
- [ ] #2 At least 3 article preview cards displayed
- [ ] #3 Section positioned between Collaborators and Join Our Community
- [ ] #4 Cards link to article detail pages or placeholder hrefs
- [ ] #5 Matches Webflow card layout and styling
<!-- AC:END -->
