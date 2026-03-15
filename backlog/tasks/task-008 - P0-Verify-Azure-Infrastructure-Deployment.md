---
id: TASK-008
title: '[P0] Verify Azure Infrastructure Deployment'
status: To Do
assignee: []
created_date: '2026-03-15 10:52'
updated_date: '2026-03-15 10:58'
labels:
  - phase-0
  - infrastructure
  - azure
  - verification
milestone: m-0
dependencies:
  - TASK-006
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Run Azure CLI checks to confirm all 6 resources were provisioned correctly in the dev resource group.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 az resource list --resource-group rg-alhayaat-dev returns exactly 6 resources
- [ ] #2 App Service responds with HTTP 200 on health check URL
- [ ] #3 PostgreSQL server shows state: Ready in az postgres flexible-server show
- [ ] #4 Key Vault secrets list returns DATABASE_URL, NEXTAUTH_SECRET, STRIPE_SECRET_KEY
- [ ] #5 Application Insights resource exists and connection string is retrievable
- [ ] #6 scripts/verify/azure-check.sh exits with code 0 and prints PASS for all checks
<!-- AC:END -->
