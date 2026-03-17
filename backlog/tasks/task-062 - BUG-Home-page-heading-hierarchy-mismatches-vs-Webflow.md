---
id: TASK-062
title: '[BUG] Home page heading hierarchy mismatches vs Webflow'
status: To Do
assignee: []
created_date: '2026-03-17 21:28'
labels:
  - bug
  - home
  - heading
  - seo
  - accessibility
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Two heading level mismatches found on the Home page between Webflow and Next.js, affecting both visual hierarchy and SEO.

**Mismatch 1 — "Guidance from experienced educators":**
- Webflow (`index.html`): `h2` (top-level section heading inside "Our growth plan" block)
- Next.js (`src/app/page.tsx` line 201): `h3`
- Fix: Change `<h3>` to `<h2>` in the educators subsection of the Growth Plan section.

**Mismatch 2 — "Support Our Mission":**
- Webflow (`index.html`): `h3` (appears inside the Collaborators section as a sub-call-to-action)
- Next.js: `h2` (promoted to section-level heading)
- Fix: Demote from `<h2>` to `<h3>` in the Support Our Mission block within the Collaborators section.

**Files to update:** `src/app/page.tsx`
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 'Guidance from experienced educators' rendered as h2 matching Webflow
- [ ] #2 'Support Our Mission' rendered as h3 matching Webflow
- [ ] #3 No other headings on Home page are affected
- [ ] #4 Heading outline passes an accessibility/SEO heading-order check
<!-- AC:END -->
