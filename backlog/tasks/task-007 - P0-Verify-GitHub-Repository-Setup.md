---
id: TASK-007
title: '[P0] Verify GitHub Repository Setup'
status: To Do
assignee: []
created_date: '2026-03-15 10:52'
updated_date: '2026-03-15 10:58'
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
Run verification checks to confirm the GitHub repository was created correctly with all required configuration.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 gh repo view al-hayaat-nextjs returns repo details without error
- [ ] #2 gh api repos/{owner}/al-hayaat-nextjs/branches lists both main and develop
- [ ] #3 gh api repos/{owner}/al-hayaat-nextjs/branches/main/protection confirms protection rules active
- [ ] #4 gh secret list confirms all 4 secrets present (AZURE_CREDENTIALS, AZURE_WEBAPP_NAME_DEV/STAGING/PROD)
- [ ] #5 scripts/verify/repo-check.sh exits with code 0 and prints PASS for all checks
<!-- AC:END -->
