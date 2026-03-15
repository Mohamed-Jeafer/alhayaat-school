---
id: TASK-008
title: Verify Next.js Project Build
status: To Do
assignee: []
created_date: '2026-03-15 10:52'
labels:
  - phase-0
  - setup
  - verification
milestone: m-0
dependencies:
  - TASK-002
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Run build and lint checks to confirm the Next.js project is correctly initialized and all tooling is working.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 npm run build exits with code 0 and no errors
- [ ] #2 npm run lint exits with code 0 and no warnings
- [ ] #3 npx tsc --noEmit exits with code 0
- [ ] #4 src/ directory structure exists with app/ subfolder
- [ ] #5 @/* import alias resolves correctly in a test import
- [ ] #6 scripts/verify/nextjs-check.sh exits with code 0 and prints PASS for all checks
<!-- AC:END -->
