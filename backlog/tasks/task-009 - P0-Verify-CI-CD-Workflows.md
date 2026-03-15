---
id: TASK-009
title: '[P0] Verify CI/CD Workflows'
status: To Do
assignee: []
created_date: '2026-03-15 10:52'
updated_date: '2026-03-15 10:58'
labels:
  - phase-0
  - cicd
  - verification
milestone: m-0
dependencies:
  - TASK-004
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Trigger each workflow and confirm it runs successfully end-to-end, with logs proving each step completed.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 gh workflow list shows 4 workflows: ci, deploy-dev, deploy-staging, deploy-prod
- [ ] #2 Create test PR: gh run list --workflow=ci.yml shows completed status with conclusion: success
- [ ] #3 Merge to develop: gh run list --workflow=deploy-dev.yml shows completed with conclusion: success
- [ ] #4 Dev app URL returns HTTP 200 after deploy-dev completes
- [ ] #5 deploy-prod workflow shows environment protection gate requiring manual approval
<!-- AC:END -->
