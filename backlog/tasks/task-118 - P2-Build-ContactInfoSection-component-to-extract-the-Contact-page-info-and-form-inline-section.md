---
id: TASK-118
title: >-
  [P2] Build ContactInfoSection component to extract the Contact page info and
  form inline section
status: In Progress
assignee: []
created_date: '2026-03-19 15:21'
updated_date: '2026-03-19 20:27'
labels:
  - UI_COMPONENT
  - section-componentization
  - refactor
milestone: m-2
dependencies:
  - TASK-099
references:
  - docs/plans/2026-03-19-section-componentization-design.md
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Story
As a school visitor on the Contact page, I want to see contact details and a message form side by side, so that I can choose to call, email, or send a message in one place.

## Business Context
The contact info section is a two-column layout: 3 contact info cards (Email, Phone, Address) on the left, and the `<ContactForm>` on the right. Currently inline in `src/app/contact/page.tsx`. Extracting it makes the layout independently testable and the contact card list independently editable.

## Technical Specification
- Create `src/components/sections/ContactInfoSection.tsx`
- Props: `{ contacts: { icon: string; label: string; value: string; href?: string }[]; className?: string }`
- `<ContactForm>` is composed internally (not passed as prop — it has no configurable content)
- Contact cards use existing `ColoredBorderCard` from `src/components/ui/`
- Rendering: SSG layout, Client Component for form interactivity
- Stack constraints: Tailwind only, no inline styles
- Phase dependencies: TASK-099 (sections/ barrel)

## Content Extraction
- Source file: `al-hayaat.webflow/contact.html`
- Target file: `src/content/contact.json` — add `contactInfo` key with contacts array
- Shared content: Email, phone, and address also appear in the footer — evaluate extracting to `_shared.json`

## Reusable Components
- `ContactInfoSection` — `src/components/sections/ContactInfoSection.tsx`
- `ColoredBorderCard` — existing

## Testing & Validation
- Unit: render with contacts array, snapshot layout
- Visual: compare against Webflow contact info section at 375px, 768px, 1440px
- axe-core: contact links have descriptive labels, phone/email are proper `<a>` tags

## Recommended Skills
- `#senior-fullstack` — component extraction, shared content identification

## Story Points: 2
*Sizing rationale: Two-column layout + contact card mapping + shared content evaluation.*

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 `src/components/sections/ContactInfoSection.tsx` created
- [ ] #2 Added to `src/components/sections/index.ts`
- [ ] #3 Inline section JSX removed from `src/app/contact/page.tsx`
- [ ] #4 Contact data sourced from `src/content/contact.json` or `_shared.json`
- [ ] #5 Shared contact info flagged for `_shared.json` if also used in footer
- [ ] #6 No inline styles
- [ ] #7 Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->
<!-- DOD:END -->



## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the Contact page loads, When ContactInfoSection renders, Then 3 contact info cards and the contact form are visible in a two-column layout matching the Webflow source at 1440px
- [ ] #2 Given the contacts prop is populated, When the section renders, Then each card shows the correct label and value sourced from content JSON
- [ ] #3 Given a contact card has an href, When the user clicks it, Then they are navigated to the correct URL (mailto:, tel:, or map link)
- [ ] #4 Given the user is on a 375px wide screen, When ContactInfoSection renders, Then the two-column layout stacks to single-column with the contact cards above the form
<!-- AC:END -->
