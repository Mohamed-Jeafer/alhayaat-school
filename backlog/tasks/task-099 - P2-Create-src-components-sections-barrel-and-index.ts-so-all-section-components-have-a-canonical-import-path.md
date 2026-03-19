---
id: TASK-099
title: >-
  [P2] Create src/components/sections/ barrel and index.ts so all section
  components have a canonical import path
status: To Do
assignee: []
created_date: '2026-03-19 15:13'
labels:
  - UI_COMPONENT
  - section-componentization
  - refactor
milestone: m-2
dependencies: []
references:
  - docs/plans/2026-03-19-section-componentization-design.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Story
As a developer, I want a dedicated `src/components/sections/` folder with a barrel `index.ts`, so that all section-level components can be imported from a single consistent path.

## Business Context
The codebase currently has section-level components scattered across `src/components/ui/` with no clear boundary between reusable primitives and page-section wrappers. A dedicated `sections/` folder makes the architecture self-documenting and enables all subsequent componentization stories to land in the right place.

## Technical Specification
- Create `src/components/sections/` directory
- Create `src/components/sections/index.ts` barrel export (initially empty, entries added per component story)
- Add `@/components/sections` path alias to `tsconfig.json` if not already covered by `@/components`
- Rendering: N/A — this is a scaffolding task
- Stack constraints: TypeScript barrel pattern, Next.js App Router
- Phase dependencies: None — this is the foundation for all other section stories
- Spec reference: `docs/plans/2026-03-19-section-componentization-design.md`

## Reusable Components
- `src/components/sections/index.ts` — barrel export for all section components

## Recommended Skills
- `#senior-fullstack` — component architecture, barrel export patterns

## Story Points: 1
*Sizing rationale: Pure scaffolding — create one directory and one file.*

## Definition of Done
- [ ] `src/components/sections/` directory exists
- [ ] `src/components/sections/index.ts` barrel created
- [ ] Path resolves correctly via `@/components/sections` import
- [ ] Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the developer runs the Next.js dev server, When they add `import {} from '@/components/sections'`, Then TypeScript resolves the path without errors
- [ ] #2 Given the sections/index.ts barrel exists, When a new section component is added, Then it can be re-exported from index.ts and consumed by page files
- [ ] #3 Given the project structure, When a developer looks for section components, Then they find them in src/components/sections/ not scattered across ui/
<!-- AC:END -->
