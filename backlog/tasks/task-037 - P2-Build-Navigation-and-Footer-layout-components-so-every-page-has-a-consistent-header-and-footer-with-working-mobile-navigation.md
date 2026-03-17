---
id: TASK-037
title: >-
  [P2] Build Navigation and Footer layout components so every page has a
  consistent header and footer with working mobile navigation
status: Done
assignee: []
created_date: '2026-03-15 13:20'
updated_date: '2026-03-16 05:04'
labels:
  - phase-2
  - layout
  - navigation
milestone: m-2
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a visitor to the Al-Hayaat School website, I want a consistent navigation header and footer on every page, so that I can easily find any section of the site and access contact information without searching.

**Business Context**
The Webflow site has a global nav and footer that must be migrated to reusable Next.js layout components. These are the highest-reuse components in the entire project - every page depends on them. Getting the mobile drawer right is critical for the majority of school site visitors who use mobile devices.

**Technical Specification**
- Rendering: Server Component for nav and footer shell, Client Component for Sheet drawer interactivity only
- Data: src/content/_shared.json for nav links, footer address, social links, newsletter form labels
- Infrastructure: Footer newsletter form calls POST /api/newsletter/subscribe (TASK-030)
- Stack constraints: shadcn/ui NavigationMenu for desktop nav, shadcn/ui Sheet for mobile drawer, next/image for logo, Next.js Link for all internal links
- Phase dependencies: None - this is the first m-2 component
- Spec reference: .kiro/specs/phase-2-component-library.md, docs/COMPONENT-LIBRARY-SPEC.md

**Content Extraction**
- Source file: al-hayaat.webflow/index.html
- Target file: src/content/_shared.json
- Sections to extract: nav links with labels and hrefs, logo src, footer address, phone, email, social links (Facebook, Instagram, Twitter), copyright text, newsletter form label and placeholder

**Reusable Components**
- Navigation, src/components/layout/Navigation.tsx - global nav with logo and links
- Footer, src/components/layout/Footer.tsx - global footer with address, social links, newsletter form
- Layout, src/components/layout/Layout.tsx - root layout wrapper combining Navigation + Footer + slot

**Testing & Validation**
- Unit: nav renders all links from _shared.json - no hardcoded strings
- Unit: Sheet opens on mobile hamburger click and closes on link click
- Unit: footer renders address and social links from _shared.json
- Visual: compare against Webflow at 375px, 768px, 1440px
- Lighthouse Accessibility >95, axe-core zero critical violations

**Recommended Skills**
- `#senior-fullstack` - Next.js layout components, Server vs Client component boundary
- `#frontend-design` - navigation layout, mobile drawer UX, footer grid

**Story Points**: 5
*Sizing rationale: Navigation and Footer are the most reused components on the site - mobile drawer complexity, newsletter form wiring, and content extraction add meaningful scope.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the navigation renders on desktop - When the user views a 1440px viewport - Then all nav links are visible in a horizontal row with the school logo on the left
- [ ] #2 Given the navigation renders on mobile - When the user views a 375px viewport - Then a hamburger icon appears and clicking it opens a shadcn Sheet drawer with all nav links
- [ ] #3 Given a nav link is clicked - When the route changes - Then the Sheet drawer closes and the active page link is visually highlighted
- [ ] #4 Given the footer renders - When the user views any page - Then the footer shows address, social links, newsletter signup input, and copyright text all sourced from _shared.json
- [ ] #5 Edge case: newsletter signup in footer - Given the user submits a valid email in the footer form - When the form submits - Then it calls POST /api/newsletter/subscribe and shows a success message
- [ ] #6 Edge case: keyboard navigation - Given a keyboard user tabs through the navigation - When focus reaches a nav link - Then a visible focus ring is visible on each link
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 src/content/_shared.json created with nav links, footer content, address, and social links extracted from al-hayaat.webflow/index.html
- [ ] #3 All visible text sourced from _shared.json - no hardcoded strings in JSX
- [ ] #4 shadcn Sheet used for mobile drawer - no custom overlay implementation
- [ ] #5 No raw anchor tags for internal navigation - Next.js Link used throughout
- [ ] #6 WCAG 2.1 AA - all nav links have descriptive labels, focus rings visible
- [ ] #7 Lighthouse Accessibility >95
<!-- DOD:END -->
