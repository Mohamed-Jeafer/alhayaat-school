---
id: TASK-005
title: GitHub Repository Setup
status: To Do
assignee: []
created_date: '2026-03-15 10:51'
labels:
  - phase-0
  - setup
milestone: m-0
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create the al-hayaat-nextjs GitHub repository with proper branch structure, protection rules, and secrets configured for CI/CD deployment to Azure.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Repository al-hayaat-nextjs created on GitHub
- [ ] #2 README.md with project overview present
- [ ] #3 .gitignore configured for Node/Next.js
- [ ] #4 develop branch created from main
- [ ] #5 Branch protection on main: require PR reviews, require status checks, no direct pushes
- [ ] #6 Branch protection on develop configured
- [ ] #7 Repository secrets configured: AZURE_CREDENTIALS, AZURE_WEBAPP_NAME_DEV, AZURE_WEBAPP_NAME_STAGING, AZURE_WEBAPP_NAME_PROD
<!-- AC:END -->
