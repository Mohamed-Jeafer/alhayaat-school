---
id: TASK-139
title: '[P3] TypeScript satisfies: validate JSON content against PageContent types'
status: To Do
assignee: []
created_date: '2026-04-20 01:01'
labels:
  - typescript dx content
dependencies: []
references:
  - >-
    https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
At compile time, tie @/content/*.json imports to src/types/content.ts (PageContent / stricter per-page types where practical) using satisfies so JSON and types cannot drift silently. Pattern: const admissionsContent = raw satisfies PageContent (or dedicated AdmissionsContent). Touch pages/components that import each JSON file.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Major content imports asserted with satisfies against an appropriate type; tsc passes
- [ ] #2 Document pattern in task notes or AGENTS.md only if team agrees (optional)
<!-- AC:END -->
