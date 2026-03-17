---
id: TASK-062
title: >-
  [BUG] Admissions page missing "Fees" subsection under Required Items for
  Registration
status: In Progress
assignee: []
created_date: '2026-03-17 21:28'
updated_date: '2026-03-17 21:44'
labels:
  - bug
  - admissions
  - content
  - missing-section
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The Webflow admissions page (`admission.html`) has a **"Required items for registration"** section containing two subsections:
- h4: "Required Documents" (list: report card, immunization record, health card, birth certificate/PR/passport)
- h4: "Fees" (list: Registration fee, Resource fee)

The Next.js Admissions page has a full School Fee Summary table (`fees` section in `src/content/admissions.json` with h2: "School fee summary") but appears to be **missing the h4: "Fees" sub-heading** and its bullet list under the "Required items for registration" block.

**Webflow "Fees" subsection content:**
- Registration fee (payable with the registration forms)
- Resource fee (payable after the student assessment)

**Fix required:**
1. Under the "Required items for registration" section in `src/app/admissions/page.tsx`, add an h4 "Fees" subsection.
2. Add a bullet list: "Registration fee (payable with the registration forms)" and "Resource fee (payable after the student assessment)".
3. Add this data to `src/content/admissions.json` under `requirements.fees_note` or similar.
4. This is distinct from the full school fee summary table which already exists.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 h4 'Fees' subsection present under 'Required items for registration' section
- [ ] #2 Two bullet points: registration fee and resource fee payable conditions
- [ ] #3 Visually matches Webflow's layout for this subsection
- [ ] #4 Distinct from the School Fee Summary table which remains unchanged
<!-- AC:END -->
