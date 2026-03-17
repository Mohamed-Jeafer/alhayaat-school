---
id: TASK-062
title: >-
  [BUG] School Plans page — verify expansion timeline and fundraising target
  content matches Webflow
status: To Do
assignee: []
created_date: '2026-03-17 21:28'
labels:
  - bug
  - school-plans
  - content
  - verification
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The Webflow School Plans page (`school-plans.html`) contains specific structured content that needs to be verified against the Next.js `/school-plan` page.

**Webflow content found in school-plans.html:**

**h5: "Set to open"** — Expansion timeline bullet list:
- "2026: Opening with Junior Kindergarten (JK) to Grade 3."
- "Annual Expansion: Adding one grade each year until reaching Grade 8 in 2031"
- "This gradual development allows us to focus on creating a robust academic and spiritual environment tailored to each age"

**h5: "Connect with our community"** — (content to be verified)

**h3: "Support Our Mission"** — Fundraising bullet list:
- "Covering essential school costs and daily learning"
- "Ensuring a high-quality education system rooted in principles."
- "Current fundraising target ($350,000 for 2026-2027)"

**Fix required:**
1. Review `src/app/school-plan/page.tsx` and its content JSON.
2. Verify all three bullet points under "Set to open" are present verbatim.
3. Verify the fundraising target of **$350,000 for 2026-2027** is displayed.
4. Verify h5: "Connect with our community" section exists.
5. Fix any missing content by updating the relevant content JSON file.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Expansion timeline (2026 JK-Grade 3, annual expansion to Grade 8 by 2031) displayed on page
- [ ] #2 Fundraising target of $350,000 for 2026-2027 is visible
- [ ] #3 'Connect with our community' section present
- [ ] #4 'Set to open' heading/section present
- [ ] #5 Content matches Webflow word-for-word or with approved edits
<!-- AC:END -->
