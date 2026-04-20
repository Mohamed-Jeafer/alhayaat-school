---
id: TASK-136
title: '[P3] TypeScript satisfies: Next.js metadata and build configs'
status: To Do
assignee: []
created_date: '2026-04-20 00:59'
labels:
  - typescript dx nextjs
dependencies: []
references:
  - >-
    https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Migrate export const metadata: Metadata = ... to export const metadata = ... satisfies Metadata across App Router pages/layouts that use the annotation form. Optionally next.config.ts (satisfies NextConfig) and tailwind.config.ts (satisfies Config). Preserves literal types where Metadata allows unions while keeping validation.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 All targeted metadata exports use satisfies Metadata; invalid fields rejected by types
- [ ] #2 tsc and next build succeed
<!-- AC:END -->
