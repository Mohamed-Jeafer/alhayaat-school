---
id: TASK-008
title: >-
  [P0] Verify Azure infrastructure so the team confirms all cloud resources are
  correctly provisioned
status: To Do
assignee: []
created_date: '2026-03-15 10:52'
updated_date: '2026-03-15 11:56'
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
**Story**
As a developer on the Al-Hayaat project, I want to run automated verification checks against the Azure dev resource group, so that I can confirm all 6 resources are provisioned, accessible, and correctly configured before deploying application code.

**Business Context**
A missing or misconfigured Azure resource (wrong SKU, missing Key Vault secret, unreachable database) can block all subsequent development. Verification ensures the infrastructure foundation is solid before the team builds on it.

**Technical Specification**
- Rendering: N/A — verification script only
- Data: N/A
- Infrastructure: Azure CLI (`az`) commands against dev resource group
- Stack constraints: Bash verification script using `az resource list`, `az webapp show`, `az postgres flexible-server show`, `az keyvault secret list`, `az monitor app-insights component show`
- Phase dependencies: TASK-006 (Azure infrastructure must be deployed first)
- Spec reference: `.kiro/specs/phase-0-infrastructure-setup.md`

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| az auth failure | Azure CLI not authenticated | Run `az login` to authenticate |
| Resource not found | Expected resource missing from resource group | Re-run TASK-006 Bicep deployment |
| Health check 503 | App Service not responding | Check App Service logs in Azure Portal |

**Recommended Skills**
- `#senior-architect` — Azure resource verification, infrastructure validation patterns

**Story Points**: 1
*Sizing rationale: Single verification script with Azure CLI checks — minimal complexity.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given TASK-006 is complete and infrastructure is deployed
When the developer runs az resource list --resource-group rg-alhayaat-dev
Then exactly 6 resources are returned
- [ ] #2 Given the App Service is provisioned
When the developer curls the health check URL
Then the endpoint returns HTTP 200
- [ ] #3 Given the PostgreSQL server is provisioned
When the developer runs az postgres flexible-server show
Then the server state shows Ready
- [ ] #4 Given Key Vault is provisioned
When the developer runs az keyvault secret list
Then DATABASE_URL, NEXTAUTH_SECRET, and STRIPE_SECRET_KEY are present
- [ ] #5 Edge case: missing resource — Given Application Insights was not provisioned
When the verification script runs
Then it reports FAIL for Application Insights with the expected resource name
- [ ] #6 Edge case: unhealthy App Service — Given the App Service returns HTTP 503
When the verification script runs
Then it reports FAIL with a link to App Service logs in Azure Portal
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 scripts/verify/azure-check.sh exits with code 0 and prints PASS for all checks
- [ ] #2 All failures documented with remediation steps
- [ ] #3 TASK-006 confirmed complete
<!-- DOD:END -->
