---
id: TASK-064
title: >-
  [BUG] School Plans page — verify expansion timeline and fundraising target
  matches Webflow
status: To Do
assignee: []
created_date: '2026-03-17 21:31'
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
Webflow school-plans.html contains specific content that needs verification in Next.js /school-plan.\n\nContent to verify:\n\nh5: Set to open — 3 bullets:\n- 2026: Opening with Junior Kindergarten (JK) to Grade 3.\n- Annual Expansion: Adding one grade each year until reaching Grade 8 in 2031\n- This gradual development allows us to focus on creating a robust academic and spiritual environment tailored to each age\n\nh5: Connect with our community\n\nh3: Support Our Mission — 3 bullets:\n- Covering essential school costs and daily learning\n- Ensuring a high-quality education system rooted in principles.\n- Current fundraising target ($350,000 for 2026-2027)\n\nFix: Review src/app/school-plan/page.tsx and its content JSON. Add any missing sections or bullet points.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Expansion timeline 2026-2031 displayed with all 3 bullet points
- [ ] #2 Fundraising target of $350000 for 2026-2027 is visible
- [ ] #3 Connect with our community section present
- [ ] #4 Set to open heading present
<!-- AC:END -->
