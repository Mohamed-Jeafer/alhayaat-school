---
id: TASK-007
title: >-
  [P0] Verify GitHub repository setup so the team confirms the codebase
  foundation is correctly configured
status: To Do
assignee: []
created_date: '2026-03-15 10:52'
updated_date: '2026-03-15 12:56'
labels:
  - phase-0
  - setup
  - verification
milestone: m-0
dependencies:
  - TASK-005
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a developer on the Al-Hayaat project, I want to run automated verification checks against the GitHub repository, so that I can confirm branch protection, secrets, and repository structure are correctly configured before building on top of them.

**Business Context**
A misconfigured repository (missing branch protection, wrong secrets) can silently break CI/CD pipelines and allow unreviewed code to reach production. Verification catches these issues before they cascade into later phases.

**Technical Specification**
- Rendering: N/A — verification script only
- Data: N/A
- Infrastructure: GitHub API via `gh` CLI
- Stack constraints: Bash verification script using `gh api` and `gh secret list` commands
- Phase dependencies: TASK-005 (GitHub repository must be set up first)
- Spec reference: `.kiro/specs/phase-0-infrastructure-setup.md`

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| gh auth failure | GitHub CLI not authenticated | Run `gh auth login` to authenticate |
| Branch not found | develop branch missing | Re-run TASK-005 branch creation step |
| Secret missing | Required secret not configured | Add missing secret via `gh secret set` |

**Recommended Skills**
- `#senior-architect` — repository verification, GitHub API patterns

**Story Points**: 1
*Sizing rationale: Single verification script with CLI checks — minimal complexity.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given TASK-005 is complete - When scripts/verify/repo-check.sh executes - Then it prints PASS for all checks and exits with code 0
When the developer runs gh repo view al-hayaat-nextjs
Then the command returns repo details without error
- [ ] #2 Given the repository exists - When the script checks branch protection on main - Then require-pr-reviews and status-checks are both confirmed enabled
When the developer runs gh api repos/{owner}/al-hayaat-nextjs/branches
Then both main and develop branches are listed
- [ ] #3 Given branch protection is configured - When the script checks secrets - Then all 4 secrets are confirmed present by name
When the developer queries the main branch protection API
Then protection rules show required reviews and status checks are active
- [ ] #4 Given secrets are configured - When the script runs all checks - Then it exits with code 0 and zero FAIL lines in the output
When the developer runs gh secret list
Then all 4 secrets are present (AZURE_CREDENTIALS, AZURE_WEBAPP_NAME_DEV, AZURE_WEBAPP_NAME_STAGING, AZURE_WEBAPP_NAME_PROD)
- [ ] #5 Edge case: missing protection - Given branch protection was not applied to develop - When the script runs - Then it prints FAIL for develop branch protection and exits with code 1
When the verification script runs
Then it reports FAIL for develop branch protection with a remediation command
- [ ] #6 Edge case: partial secrets - Given only 2 of 4 secrets are configured - When the script runs - Then it prints FAIL listing each missing secret by name and exits with code 1
When the verification script runs
Then it reports FAIL and lists the missing secret names
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 scripts/verify/repo-check.sh exits with code 0 and prints PASS for all checks
- [ ] #2 All failures documented with remediation steps
- [ ] #3 TASK-005 confirmed complete
<!-- DOD:END -->
