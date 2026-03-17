---
id: TASK-001.01
title: GitHub Repository Setup
status: To Do
assignee: []
created_date: '2026-03-08 17:52'
updated_date: '2026-03-15 10:43'
labels:
  - phase-0
  - setup
milestone: m-0
dependencies: []
parent_task_id: TASK-001
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create repository, configure branch protection, set up secrets
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Repository created: al-hayaat-nextjs
- [ ] #2 README.md with project overview present
- [ ] #3 .gitignore configured for Node/Next.js
- [ ] #4 develop branch created
- [ ] #5 Branch protection on main: require PR reviews, require status checks, no direct pushes
- [ ] #6 Branch protection on develop configured
- [ ] #7 Repository secrets configured (AZURE_CREDENTIALS, AZURE_WEBAPP_NAME_DEV/STAGING/PROD)
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Steps

1. Create new GitHub repository `al-hayaat-nextjs`
2. Initialize with README and .gitignore (Node template)
3. Create `develop` branch from `main`
4. Configure branch protection on `main`:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - No direct pushes allowed
5. Configure branch protection on `develop`
6. Add repository secrets:
   - `AZURE_CREDENTIALS` - Service principal JSON
   - `AZURE_WEBAPP_NAME_DEV`
   - `AZURE_WEBAPP_NAME_STAGING`
   - `AZURE_WEBAPP_NAME_PROD`

## Files Created
- `README.md`
- `.gitignore`
<!-- SECTION:PLAN:END -->
