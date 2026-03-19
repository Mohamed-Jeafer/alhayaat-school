---
id: TASK-103
title: >-
  [P2] Build PageIntroSection generic component to replace all inline
  heading+body intro sections across pages
status: To Do
assignee: []
created_date: '2026-03-19 15:15'
labels:
  - UI_COMPONENT
  - section-componentization
  - refactor
milestone: m-2
dependencies:
  - TASK-099
references:
  - docs/plans/2026-03-19-section-componentization-design.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Story
As a developer, I want a single `PageIntroSection` component with typed props, so that the heading+subtext intro pattern shared across 6 pages is defined once and changes propagate everywhere.

## Business Context
About, Careers, Contact, School Plan, Curriculum, and Admissions pages all have an identical inline pattern: a heading `<h2>` followed by a body paragraph, wrapped in `<Section>` + `<Container>`. This pattern is duplicated 6 times with no shared abstraction. A single generic component eliminates all 6 duplications and ensures font, spacing, and layout changes apply site-wide instantly.

## Technical Specification
- Create `src/components/sections/PageIntroSection.tsx`
- Props: `{ headline: string; body: string | string[]; className?: string }`
- If `body` is a string array, render as multiple `<p>` elements
- Uses `<Section>` + `<Container>` layout primitives internally
- No hardcoded strings — all text via props sourced from page content JSON at call site
- Rendering: SSG — static content
- Stack constraints: Tailwind only, shadcn/ui typography tokens, Next.js App Router
- Phase dependencies: TASK-099 (sections/ barrel)
- Spec reference: `docs/plans/2026-03-19-section-componentization-design.md`

## Content Extraction
- Source files: `al-hayaat.webflow/about.html`, `careers.html`, `contact.html`, `school-plans.html`, `academic-and-curriculum.html`, `admission.html`
- Target files: corresponding `src/content/{page}.json` — ensure each has an `intro: { headline, body }` key
- Shared content: None — each page has unique intro copy
- Webflow markup patterns: Standard `div` with heading + paragraph, no Webflow-specific widgets
- Extraction example:
```json
{
  "intro": {
    "id": "careers-intro",
    "headline": "Join Our Team",
    "body": "We are looking for passionate educators..."
  }
}
```

## Reusable Components
- `PageIntroSection` — generic heading+body section, `src/components/sections/PageIntroSection.tsx`

## Testing & Validation
- Unit: render with string body, render with string[] body, render with className override, snapshot
- Visual: compare against Webflow intro sections on all 6 pages at 375px, 768px, 1440px
- Lighthouse targets: Performance >90, Accessibility >95, SEO >90
- axe-core: heading hierarchy correct (h2 inside section), zero critical violations

## Recommended Skills
- `#senior-fullstack` — component abstraction, TypeScript generics
- `#frontend-design` — typography fidelity to Webflow source

## Story Points: 2
*Sizing rationale: New generic component + 6 content JSON updates + wiring in 6 pages.*

## Definition of Done
- [ ] `src/components/sections/PageIntroSection.tsx` created with typed props
- [ ] Added to `src/components/sections/index.ts`
- [ ] All 6 pages updated to use PageIntroSection — inline intro JSX removed
- [ ] All visible intro text sourced from content JSON — no hardcoded strings in JSX
- [ ] Content JSON `intro` key present in all 6 page content files
- [ ] Zero TypeScript errors
- [ ] WCAG 2.1 AA checked — heading hierarchy valid
- [ ] Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the About page loads, When PageIntroSection renders with headline and body props, Then the heading and paragraph are visible and match the Webflow source at 1440px desktop
- [ ] #2 Given any of the 6 pages loads, When PageIntroSection renders, Then the heading uses the correct h2 element and the body paragraph text is sourced from content JSON — no hardcoded strings in JSX
- [ ] #3 Given the body prop is a string array, When PageIntroSection renders, Then each string renders as a separate <p> element
- [ ] #4 Given the user is on a 375px wide screen, When PageIntroSection renders on any page, Then text is legible (min 16px body), layout is single-column, and no horizontal scroll occurs
- [ ] #5 Given a className override is passed, When PageIntroSection renders, Then the custom class is applied to the section wrapper without breaking default styles
<!-- AC:END -->
