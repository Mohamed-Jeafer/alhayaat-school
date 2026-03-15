---
id: TASK-004
title: GitHub Actions CI/CD Workflows
status: To Do
assignee: []
created_date: '2026-03-15 10:51'
labels:
  - phase-0
  - cicd
milestone: m-0
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create 4 GitHub Actions workflows: CI on PRs, deploy-dev on push to develop, deploy-staging on manual dispatch, deploy-prod on push to main with approval gate.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 ci.yml created — triggers on PRs to develop and main, runs lint + type-check + build
- [ ] #2 deploy-dev.yml created — triggers on push to develop
- [ ] #3 deploy-staging.yml created — triggers on manual workflow_dispatch
- [ ] #4 deploy-prod.yml created — triggers on push to main with manual approval gate
- [ ] #5 All workflows reference correct GitHub secrets
- [ ] #6 Test PR created and CI workflow passes successfully
- [ ] #7 Merge to develop triggers deploy-dev and app is accessible on dev URL
<!-- AC:END -->
