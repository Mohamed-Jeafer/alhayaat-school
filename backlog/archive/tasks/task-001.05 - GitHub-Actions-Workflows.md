---
id: TASK-001.05
title: GitHub Actions Workflows
status: To Do
assignee: []
created_date: '2026-03-08 17:52'
updated_date: '2026-03-15 10:43'
labels:
  - phase-0
  - cicd
milestone: m-0
dependencies: []
parent_task_id: TASK-001
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create CI/CD workflows: ci.yml, deploy-dev.yml, deploy-staging.yml, deploy-prod.yml
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 ci.yml created — triggers on PRs to develop and main
- [ ] #2 ci.yml runs: install, lint, type-check, build
- [ ] #3 deploy-dev.yml created — triggers on push to develop
- [ ] #4 deploy-staging.yml created — triggers on manual workflow dispatch
- [ ] #5 deploy-prod.yml created — triggers on push to main with manual approval gate
- [ ] #6 All workflows reference correct GitHub secrets
- [ ] #7 CI workflow passes on a test PR
- [ ] #8 Dev deployment succeeds on merge to develop
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Workflows to Create

### .github/workflows/ci.yml
- Trigger: Pull requests to `develop` or `main`
- Steps: checkout → setup Node → npm ci → lint → type-check → build

### .github/workflows/deploy-dev.yml
- Trigger: Push to `develop` branch
- Steps: build → deploy to Azure App Service (dev)

### .github/workflows/deploy-staging.yml
- Trigger: Manual `workflow_dispatch`
- Steps: build → deploy to Azure App Service (staging)

### .github/workflows/deploy-prod.yml
- Trigger: Push to `main`
- Requires: manual approval via GitHub environment protection rules
- Steps: build → approval gate → deploy to Azure App Service (prod)

## Required GitHub Secrets
- `AZURE_CREDENTIALS` — Service principal JSON
- `AZURE_WEBAPP_NAME_DEV`
- `AZURE_WEBAPP_NAME_STAGING`
- `AZURE_WEBAPP_NAME_PROD`

## Verification
- Create test PR → confirm CI workflow triggers and passes
- Merge to develop → confirm deploy-dev workflow triggers
<!-- SECTION:PLAN:END -->
