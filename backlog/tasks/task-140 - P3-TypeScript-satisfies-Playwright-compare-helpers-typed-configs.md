---
id: TASK-140
title: '[P3] TypeScript satisfies: Playwright compare helpers typed configs'
status: To Do
assignee: []
created_date: '2026-04-20 01:01'
labels:
  - typescript dx testing
dependencies: []
references:
  - >-
    https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Apply satisfies to tests/compare/helpers.ts PAGES (PageEntry[]) and tests/compare/styles.spec.ts STYLE_CHECKS array so fixture shapes are checked without widening literals. Keeps compare tooling aligned with TS 4.9+ patterns.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 PAGES and STYLE_CHECKS use satisfies against their element types; tsc --noEmit or project test typecheck passes
<!-- AC:END -->
