---
id: TASK-005
title: >-
  [P0] Set up GitHub repository so the team has a secure, structured codebase
  with branch protection
status: To Do
assignee: []
created_date: '2026-03-15 10:51'
updated_date: '2026-03-15 12:56'
labels:
  - phase-0
  - setup
milestone: m-0
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a developer on the Al-Hayaat project, I want a GitHub repository with proper branch structure, protection rules, and deployment secrets configured, so that the team has a secure foundation for collaborative development with enforced code review.

**Business Context**
The Webflow site has no version control — all changes are made directly in the Webflow designer with no history, no rollback, and no code review. A properly configured GitHub repository with branch protection ensures every change is reviewed, tested, and traceable.

**Technical Specification**
- Rendering: N/A — repository configuration only
- Data: N/A
- Infrastructure: GitHub repository with branch protection rules, repository secrets for Azure deployment
- Stack constraints: main branch for production, develop branch for integration, PR-based workflow with required reviews and status checks
- Phase dependencies: None — this is the first task in P0
- Spec reference: `.kiro/specs/phase-0-infrastructure-setup.md`

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| 403 Forbidden | Insufficient GitHub permissions | Verify user has admin access to the organization |
| Secret creation failure | GitHub API rate limit or permission error | Retry after rate limit window or escalate permissions |

**Recommended Skills**
- `#senior-architect` — repository structure, branch strategy, access control patterns

**Story Points**: 2
*Sizing rationale: Straightforward repository setup with CLI commands — well-documented steps, minimal complexity.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given no repository exists - When gh repo create runs - Then a private repo named al-hayaat-nextjs exists with README.md and Node.js .gitignore
When the developer creates al-hayaat-nextjs on GitHub with README and .gitignore
Then the repository is accessible and contains main branch with initial commit
- [ ] #2 Given the repository exists with main - When the develop branch is created and set as default - Then both main and develop branches are confirmed via gh api
When the developer creates the develop branch from main
Then both branches are listed in gh api repos/{owner}/al-hayaat-nextjs/branches
- [ ] #3 Given both branches exist - When branch protection rules are applied - Then direct pushes to main are rejected and PRs require 1 review plus passing status checks
When the developer configures branch protection on main
Then direct pushes are blocked, PR reviews are required, and status checks must pass before merge
- [ ] #4 Given branch protection is configured - When all 4 secrets are added - Then gh secret list confirms AZURE_CREDENTIALS and all AZURE_WEBAPP_NAME variants
When the developer adds repository secrets via gh secret set
Then gh secret list confirms AZURE_CREDENTIALS, AZURE_WEBAPP_NAME_DEV, AZURE_WEBAPP_NAME_STAGING, and AZURE_WEBAPP_NAME_PROD are present
- [ ] #5 Edge case: duplicate creation - Given the repo already exists - When the setup script runs - Then the script detects it and exits with a clear message
When the developer attempts to create it again
Then the script exits gracefully with a message indicating the repo already exists
- [ ] #6 Edge case: bypass attempt - Given branch protection is active on main - When a direct push is attempted - Then git rejects it with a protected branch error
When a developer attempts to push directly to main
Then the push is rejected with a protection rule error
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Steps

1. Create new GitHub repository `al-hayaat-nextjs`
2. Initialize with README and .gitignore (Node template)
3. Create `develop` branch from `main`
4. Configure branch protection on `main`: require PR reviews, status checks, no direct pushes
5. Configure branch protection on `develop`
6. Add repository secrets: AZURE_CREDENTIALS, AZURE_WEBAPP_NAME_DEV/STAGING/PROD
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 README.md includes project overview, tech stack, and setup instructions
- [ ] #3 .gitignore configured for Node.js/Next.js
- [ ] #4 Branch protection verified on both main and develop
- [ ] #5 All 4 repository secrets confirmed present
- [ ] #6 Verification script passes (scripts/verify/repo-check.sh)
- [ ] #7 Corresponding [P0] Verify GitHub Repository Setup task in Backlog.md marked Done
<!-- DOD:END -->
