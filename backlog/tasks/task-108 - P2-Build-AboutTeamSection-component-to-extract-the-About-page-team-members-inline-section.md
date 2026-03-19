---
id: TASK-108
title: >-
  [P2] Build AboutTeamSection component to extract the About page team members
  inline section
status: To Do
assignee: []
created_date: '2026-03-19 15:17'
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
As a school visitor reading the About page, I want to see the school's leadership team with photos and bios, so that I can connect names to faces and understand who leads the school.

## Business Context
The team section is currently inline JSX in `src/app/about/page.tsx` with one article element per team member plus a board photo with caption. Extracting it enables the team roster to be swapped or updated without touching the page file.

## Technical Specification
- Create `src/components/sections/AboutTeamSection.tsx`
- Props: `{ headline: string; members: { name: string; role: string; bio?: string; photo?: string }[]; boardPhoto?: { src: string; alt: string; caption: string }; className?: string }`
- Each member rendered as an article with optional photo via `next/image`
- Board photo rendered below member list if provided
- Rendering: SSG — static content
- Stack constraints: Tailwind only, `next/image` exclusively, no inline styles
- Phase dependencies: TASK-099 (sections/ barrel)
- Spec reference: `docs/plans/2026-03-19-section-componentization-design.md`

## Content Extraction
- Source file: `al-hayaat.webflow/about.html`
- Target file: `src/content/about.json` — add `team` key with members array and boardPhoto
- Sections to extract: `about-team-section`

## Reusable Components
- `AboutTeamSection` — `src/components/sections/AboutTeamSection.tsx`

## Testing & Validation
- Unit: render with members array, render with member missing optional photo, render without boardPhoto, snapshot
- Visual: compare against Webflow about team section at 375px, 768px, 1440px
- Lighthouse targets: Performance >90, Accessibility >95
- axe-core: all member photos have alt text, zero critical violations

## Recommended Skills
- `#senior-fullstack` — component extraction, optional prop patterns
- `#frontend-design` — team grid layout fidelity

## Story Points: 2
*Sizing rationale: Member list + optional photo handling + board photo + content JSON extraction.*

## Definition of Done
- [ ] `src/components/sections/AboutTeamSection.tsx` created with typed props
- [ ] Added to `src/components/sections/index.ts`
- [ ] Inline team JSX removed from `src/app/about/page.tsx`
- [ ] Team content sourced from `src/content/about.json`
- [ ] All images use `next/image` with non-empty alt
- [ ] No inline styles
- [ ] Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the About page loads, When AboutTeamSection renders, Then all team members are listed with name and role matching the Webflow source at 1440px
- [ ] #2 Given a team member has a photo, When AboutTeamSection renders, Then the photo uses next/image with a non-empty alt attribute
- [ ] #3 Given a team member has no photo, When AboutTeamSection renders, Then the member card renders gracefully without a broken image slot
- [ ] #4 Given the user is on a 375px wide screen, When AboutTeamSection renders, Then the team grid stacks to single or two-column and no horizontal scroll occurs
<!-- AC:END -->
