---
id: TASK-063
title: '[BUG] Contact form missing Subject field'
status: Done
assignee: []
created_date: '2026-03-17 21:29'
updated_date: '2026-03-17 22:03'
labels:
  - bug
  - contact
  - form
  - missing-field
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The Webflow contact form has 4 fields: Name*, Email*, Subject (optional), Message*. The Next.js contact form is missing the Subject field.\n\n**Webflow real contact form fields** (ignoring Style Guide template noise at top of contact.html):\n- name* (text, required)\n- email* (email, required)\n- Subject (text, optional)\n- message* (textarea, required)\n\n**Next.js contact form fields:** honeypot, name, email, message — Subject is MISSING.\n\n**Fix required:**\n1. Add `subject` optional text input to the form in `src/app/contact/page.tsx` between Email and Message.\n2. Add `subject: z.string().optional()` to the Zod schema.\n3. Update `src/app/api/contact/route.ts` to include subject in the email sent via Resend (e.g. as part of the email subject line or body).\n4. Add "Subject" label (no asterisk — optional field).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Subject text input present in contact form between Email and Message
- [ ] #2 Subject field is optional (no required validation)
- [ ] #3 Subject value included in the admin notification email
- [ ] #4 Zod schema and API route updated to handle subject field
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added Subject field to contact form. Updated forms.ts (optional subject field), ContactForm.tsx (field render), route.ts (destructure + pass to email), and templates.ts (include in admin notification email details).
<!-- SECTION:FINAL_SUMMARY:END -->
