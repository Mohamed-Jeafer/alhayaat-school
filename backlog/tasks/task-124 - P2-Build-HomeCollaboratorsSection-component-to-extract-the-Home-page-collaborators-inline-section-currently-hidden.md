---
id: TASK-124
title: >-
  [P2] Build HomeCollaboratorsSection component to extract the Home page
  collaborators inline section (currently hidden)
status: To Do
assignee: []
created_date: '2026-03-19 15:23'
labels:
  - UI_COMPONENT
  - section-componentization
  - refactor
  - deferred
milestone: m-2
dependencies:
  - TASK-099
references:
  - docs/plans/2026-03-19-section-componentization-design.md
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Story
As a developer, I want `HomeCollaboratorsSection` extracted as a standalone component, so that when the collaborators grid is activated it can be enabled with a single import swap.

## Business Context
The Home page collaborators section is a 3-column grid of collaborator cards with logos and accent colors. Currently hidden (`className="hidden"`). Extracting it now makes it plug-and-play for future activation.

## Technical Specification
- Create `src/components/sections/HomeCollaboratorsSection.tsx`
- Props: `{ headline: string; collaborators: { name: string; logo: string; accentColor?: string }[]; className?: string }`
- 3-column card grid, logos via `next/image`
- Rendering: SSG — static content
- Stack constraints: Tailwind only, no inline styles
- Phase dependencies: TASK-099 (sections/ barrel)
- Note: section remains hidden until content is approved

## Content Extraction
- Source file: `al-hayaat.webflow/index.html`
- Target file: `src/content/home.json` — add `collaborators` key

## Reusable Components
- `HomeCollaboratorsSection` — `src/components/sections/HomeCollaboratorsSection.tsx`

## Testing & Validation
- Unit: render with collaborators array, render with empty array, snapshot
- axe-core: logos have alt text

## Recommended Skills
- `#senior-fullstack` — component extraction

## Story Points: 2
*Sizing rationale: Card grid + logo images + content JSON extraction. Low priority — currently hidden.*

## Definition of Done
- [ ] `src/components/sections/HomeCollaboratorsSection.tsx` created
- [ ] Added to `src/components/sections/index.ts`
- [ ] Inline section JSX removed from `src/app/page.tsx`
- [ ] Collaborators sourced from `src/content/home.json`
- [ ] No inline styles, no raw `<img>` tags
- [ ] Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given HomeCollaboratorsSection is rendered (unhidden for testing), When it renders, Then collaborator cards display in a 3-column grid with logos and names matching Webflow at 1440px
- [ ] #2 Given the collaborators prop has items, When the section renders, Then each logo uses next/image with a non-empty alt attribute
- [ ] #3 Given the user is on a 375px wide screen, When HomeCollaboratorsSection renders, Then the 3-column grid collapses to 1 or 2 columns with no horizontal scroll
<!-- AC:END -->
