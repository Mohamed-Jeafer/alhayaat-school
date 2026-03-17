---
id: TASK-058
title: '[P3] Refine Contact page layout and form styling to match Webflow'
status: Done
assignee: []
created_date: '2026-03-17 11:18'
updated_date: '2026-03-17 12:21'
labels:
  - P3
  - page-migration
  - contact
milestone: m-3
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The Contact page has the basic structure but needs layout and form styling refinement to match Webflow.

From al-hayaat.webflow/contact.html:
1. contact-component: 2-column grid layout, gap 3rem
   - Left: contact-form with form inputs
   - Right: contact-info with address, phone, email
2. contact-header-wrapper: max-width 30rem heading section above the grid
3. Form input styling (from CSS):
   - .form_input: border 1px solid #eee, min-height 3rem, padding 0.5rem 1rem, margin-bottom 0.75rem
   - .form_input.is-text-area: min-height 8rem, resize vertical, padding-top 0.75rem
   - .form_checkbox: flex row, gap 0.75rem
4. Contact info: Should show school address (Kitchener-Waterloo region), phone number, email address, and possibly a map placeholder.

The API route /api/contact already exists (TASK-016 Done). Focus is on the UI layout and form styling fidelity.

Files: src/app/contact/page.tsx, src/app/contact/ContactForm.tsx, src/content/contact.json. Source: al-hayaat.webflow/contact.html
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Contact page renders 2-column layout: left form, right contact info (gap 3rem)
- [ ] #2 Form inputs match Webflow: border 1px #eee, min-height 3rem, padding 0.5rem 1rem, margin-bottom 0.75rem
- [ ] #3 Textarea has min-height 8rem, resize vertical, padding-top 0.75rem
- [ ] #4 Contact info column shows address, phone, email with correct visual hierarchy
- [ ] #5 Form submits to /api/contact and shows success/error state
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Rewrote src/app/contact/page.tsx using ColoredBorderCard for each contact method (email blue, phone yellow, address orange). Updated ContactForm.tsx with rounded-[1.75rem] card, bg-brand-off-white inputs, and consistent brand styling. Contact info sourced from contact.json.
<!-- SECTION:FINAL_SUMMARY:END -->
