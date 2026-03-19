---
id: TASK-107
title: >-
  [P2] Build AboutMissionVisionSection component to extract the About page tabs
  inline section
status: In Progress
assignee: []
created_date: '2026-03-19 15:17'
updated_date: '2026-03-19 19:32'
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
As a school visitor reading the About page, I want to navigate between Mission, Vision, and Values tabs, so that I can explore each pillar of the school's philosophy at my own pace.

## Business Context
The mission/vision tabs are currently inline JSX in `src/app/about/page.tsx` wrapping `<TabsPanel>`. Extracting to `AboutMissionVisionSection` makes the tabbed content independently swappable and ensures the tab content contract is typed and documented.

## Technical Specification
- Create `src/components/sections/AboutMissionVisionSection.tsx`
- Props: `{ headline: string; tabs: { id: string; label: string; body: string }[]; className?: string }`
- Wraps existing `<TabsPanel>` from `src/components/ui/TabsPanel.tsx`
- Rendering: Client Component (`'use client'`) — tabs require interactive state
- Stack constraints: Tailwind only, no inline styles, shadcn/ui Tabs primitive
- Phase dependencies: TASK-099 (sections/ barrel)
- Spec reference: `docs/plans/2026-03-19-section-componentization-design.md`

## Content Extraction
- Source file: `al-hayaat.webflow/about.html`
- Target file: `src/content/about.json` — add `missionVision` key
- Sections to extract: `about-mission-vision-section`
- Webflow markup patterns: `data-w-tab` divs — extract tab label and body text as flat JSON keys
- Extraction example:
```json
{
  "missionVision": {
    "id": "about-mission-vision",
    "headline": "Our Mission, Vision and Value",
    "tabs": [
      { "id": "mission", "label": "Our Mission", "body": "Our mission is to shape individuals..." },
      { "id": "vision", "label": "Our Vision", "body": "At Al-Hayaat School, we believe..." }
    ]
  }
}
```

## Reusable Components
- `AboutMissionVisionSection` — `src/components/sections/AboutMissionVisionSection.tsx`
- `TabsPanel` — existing, `src/components/ui/TabsPanel.tsx`

## Testing & Validation
- Unit: render with 2 tabs, click second tab and verify content switches, snapshot active/inactive states
- Visual: compare against Webflow about mission/vision at 375px, 768px, 1440px
- Lighthouse targets: Performance >90, Accessibility >95
- axe-core: tab ARIA roles correct, keyboard navigation works (arrow keys switch tabs)

## Recommended Skills
- `#senior-fullstack` — interactive component extraction, tab ARIA patterns
- `#frontend-design` — tabs layout fidelity

## Story Points: 2
*Sizing rationale: Client component with tab interaction + data-w-tab content extraction.*

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 `src/components/sections/AboutMissionVisionSection.tsx` created as Client Component
- [ ] #2 Added to `src/components/sections/index.ts`
- [ ] #3 Inline tabs JSX removed from `src/app/about/page.tsx`
- [ ] #4 Tab content sourced from `src/content/about.json` — no hardcoded strings
- [ ] #5 Tab content extracted from `data-w-tab` Webflow markup into flat JSON
- [ ] #6 Keyboard navigation works (arrow keys switch tabs)
- [ ] #7 WCAG 2.1 AA: tab ARIA roles valid
- [ ] #8 Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->
<!-- DOD:END -->



## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the About page loads, When AboutMissionVisionSection renders, Then the headline and first tab content are visible and match the Webflow source at 1440px
- [ ] #2 Given the user clicks the Vision tab, When the tab activates, Then the vision body text displays and the mission body text is hidden
- [ ] #3 Given the user navigates tabs with arrow keys, When focus is on a tab, Then arrow keys move focus to adjacent tabs and activate them (ARIA keyboard pattern)
- [ ] #4 Given the user is on a 375px wide screen, When AboutMissionVisionSection renders, Then the tabs and content are readable with no horizontal scroll
<!-- AC:END -->
