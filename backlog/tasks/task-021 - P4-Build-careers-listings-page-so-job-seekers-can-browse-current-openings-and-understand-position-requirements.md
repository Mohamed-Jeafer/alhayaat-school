---
id: TASK-021
title: >-
  [P4] Build careers listings page so job seekers can browse current openings
  and understand position requirements
status: Done
assignee: []
created_date: '2026-03-15 13:13'
updated_date: '2026-03-16 11:42'
labels:
  - phase-4
  - page
  - careers
milestone: m-5
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a job seeker visiting the Al-Hayaat School website, I want to browse current job openings with clear titles, descriptions, and requirements, so that I can quickly identify roles that match my qualifications and proceed to apply.

**Business Context**
The Webflow careers page has hardcoded job listings with no structured data and no apply flow. Migrating to typed content JSON makes listings editable without code changes, enables future CMS integration, and connects each listing to the application form via pre-selected position.

**Technical Specification**
- Rendering: SSG - job listings are static (content JSON), no DB query on this page
- Data: src/content/careers.json for listings and page copy
- Infrastructure: Static assets from Azure CDN - no DB calls
- Stack constraints: next/image for images, shadcn/ui Card for listing cards, all text from content JSON
- Phase dependencies: P2 component library (Card, Badge, Button, HeroSection, EmptyState), P3 careers static shell
- Spec reference: .kiro/specs/phase-4-database-integration.md

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| Empty listings array | No jobs in content JSON | EmptyState: "No positions currently open. Check back soon." |
| Missing image | Position image asset absent | next/image placeholder or fallback icon |

**Content Extraction**
- Source file: al-hayaat.webflow/careers.html
- Target file: src/content/careers.json
- Sections to extract: careers-hero, careers-intro, careers-listings (title, type, department, description, requirements), careers-benefits, careers-cta
- Shared content: CTA block appears on multiple pages - extract to _shared.json
- Webflow markup patterns: .job-listing-item for each card, .job-title, .job-type badge, .job-description rich text

**Reusable Components**
- Card - listing card container (reuse P2), src/components/ui/Card.tsx
- Badge - Full-Time/Part-Time indicator (reuse P2), src/components/ui/Badge.tsx
- Button - Apply CTA (reuse P2), src/components/ui/Button.tsx
- EmptyState - no listings fallback (reuse P2), src/components/ui/EmptyState.tsx
- HeroSection - page hero (reuse P2), src/components/ui/HeroSection.tsx

**Testing & Validation**
- Unit: render with populated listings - verify each card shows title, badge, description
- Unit: render with empty listings - verify EmptyState appears
- Unit: verify all text from careers.json - no hardcoded strings
- Visual: compare against Webflow careers page at 375px, 768px, 1440px
- Lighthouse targets: Performance >90, SEO >90, Accessibility >95
- axe-core: zero critical violations

**Recommended Skills**
- `#senior-fullstack` - SSG data flow, content JSON patterns
- `#frontend-design` - job listing card layout, responsive grid, visual fidelity

**Story Points**: 3
*Sizing rationale: SSG page with static content JSON - content extraction is the primary effort, no API or DB work.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given job listings exist in careers.json - When the careers page builds statically - Then all positions render with title, type badge, department, and description visible
- [ ] #2 Given the careers page renders - When a user views a listing - Then the Apply button links to the application form with the position pre-selected
- [ ] #3 Given the listings array is empty - When the page renders - Then the EmptyState component appears with a helpful message
- [ ] #4 Edge case: missing listing image - Given a listing has no image - When the card renders - Then a placeholder displays without a broken image icon
- [ ] #5 Edge case: mobile viewport - Given the user is on a 375px screen - When the page renders - Then listings stack in a single column and Apply buttons are full-width
- [ ] #6 Edge case: long description - Given a description exceeds 500 characters - When the card renders - Then text truncates cleanly with no layout overflow
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 src/content/careers.json created with all listings extracted from al-hayaat.webflow/careers.html
- [ ] #3 Shared CTA extracted to src/content/_shared.json
- [ ] #4 All visible text sourced from careers.json - no hardcoded strings in JSX
- [ ] #5 Content block IDs follow careers-{section}-{element} convention
- [ ] #6 No raw img tags - next/image used throughout
- [ ] #7 EmptyState renders when listings array is empty
- [ ] #8 WCAG 2.1 AA checked - Badge components have meaningful text, all links have descriptive labels
- [ ] #9 Lighthouse SEO >90 and Accessibility >95
<!-- DOD:END -->
