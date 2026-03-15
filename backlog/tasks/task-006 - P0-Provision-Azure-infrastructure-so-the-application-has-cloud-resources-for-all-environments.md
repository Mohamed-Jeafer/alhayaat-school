---
id: TASK-006
title: >-
  [P0] Provision Azure infrastructure so the application has cloud resources for
  all environments
status: To Do
assignee: []
created_date: '2026-03-15 10:51'
updated_date: '2026-03-15 12:58'
labels:
  - phase-0
  - infrastructure
  - azure
milestone: m-0
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a developer on the Al-Hayaat project, I want all Azure resources (App Service, PostgreSQL, Key Vault, Storage, Application Insights) provisioned via Bicep IaC with environment-specific parameters, so that the team can deploy to dev, staging, and production environments consistently and repeatably.

**Business Context**
The Webflow site runs entirely on Webflow's managed hosting with no control over infrastructure, scaling, or monitoring. Moving to Azure with IaC gives the team full control over environments, enables staging previews for stakeholder review, and provides Application Insights for performance monitoring — none of which exist today.

**Technical Specification**
- Rendering: N/A — infrastructure provisioning only
- Data: N/A
- Infrastructure: Azure Resource Group with 6 resources — App Service Plan (B1 dev / P1V2 prod), App Service (Linux/Node.js 20), PostgreSQL Flexible Server (B1ms dev / D2s_v3 prod), Storage Account (resumes blob container), Key Vault (DATABASE_URL, NEXTAUTH_SECRET, STRIPE_SECRET_KEY), Application Insights
- Stack constraints: Azure Bicep with modular templates (main.bicep + 4 modules), parameter files per environment (dev.json, staging.json, prod.json)
- Phase dependencies: None — can run in parallel with TASK-005
- Spec reference: `.kiro/specs/phase-0-infrastructure-setup.md`

**Data Contract**
```bicep
// Key Vault secrets provisioned
DATABASE_URL: string  // PostgreSQL connection string
NEXTAUTH_SECRET: string  // Auth session signing key
STRIPE_SECRET_KEY: string  // Stripe API secret
```

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| Deployment failed | Bicep template validation error | Review error in az deployment output, fix template syntax |
| Resource quota exceeded | Subscription limit reached | Request quota increase via Azure Portal or use smaller SKU |
| Name conflict | Resource name already taken globally | Add unique suffix to resource names in parameter files |

**Recommended Skills**
- `#senior-architect` — Azure resource architecture, Bicep IaC patterns, environment isolation strategy

**Story Points**: 8
*Sizing rationale: 6 Azure resources across 4 Bicep modules with 3 environment parameter files — significant complexity. Requires Lead Engineer review before sprint.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the dev resource group exists - When the Bicep deployment runs with dev.json - Then all 6 resources appear in rg-alhayaat-dev with status Succeeded (App Service, PostgreSQL, Key Vault, Storage, App Insights, App Service Plan)
When the developer runs az deployment group create with infrastructure/main.bicep and dev parameters
Then all 6 resources are provisioned and az resource list confirms them
- [ ] #2 Given the App Service is provisioned - When the health endpoint is polled - Then HTTP 200 is returned within 30 seconds of provisioning
When the developer curls the App Service URL
Then the health check endpoint returns HTTP 200
- [ ] #3 Given the PostgreSQL Flexible Server is provisioned - When a connection uses the DATABASE_URL from Key Vault - Then SELECT 1 succeeds confirming connectivity
When the developer runs az postgres flexible-server show
Then the server state shows Ready
- [ ] #4 Given Key Vault is provisioned - When DATABASE_URL, NEXTAUTH_SECRET, and STRIPE_SECRET_KEY are stored - Then the App Service reads them via managed identity without credentials in code
When the developer runs az keyvault secret list
Then DATABASE_URL, NEXTAUTH_SECRET, and STRIPE_SECRET_KEY are present
- [ ] #5 Edge case: idempotent re-deployment - Given all resources already exist - When Bicep runs again - Then all resources remain unchanged and the deployment exits with no errors
When the developer re-runs the Bicep deployment
Then no resources are duplicated and the deployment succeeds
- [ ] #6 Edge case: missing parameter - Given a required parameter is absent from dev.json - When the deployment runs - Then Bicep validation fails before any resources are created with the parameter name in the error
When the deployment runs
Then Bicep validation fails with a clear error identifying the missing parameter
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## File Structure
```
infrastructure/
├── main.bicep
├── modules/
│   ├── app-service.bicep
│   ├── database.bicep
│   ├── storage.bicep
│   └── keyvault.bicep
└── parameters/
    ├── dev.json
    ├── staging.json
    └── prod.json
```

## Deploy
```bash
az deployment group create \
  --resource-group rg-alhayaat-dev \
  --template-file infrastructure/main.bicep \
  --parameters infrastructure/parameters/dev.json
```
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 All Bicep modules pass az bicep build validation
- [ ] #3 Dev environment fully provisioned and accessible
- [ ] #4 Application Insights logging enabled and collecting data
- [ ] #5 Verification script passes (scripts/verify/azure-check.sh)
- [ ] #6 Corresponding [P0] Verify Azure Infrastructure Deployment task in Backlog.md marked Done
- [ ] #7 Infrastructure doc created via backlog doc create -t technical 'Infrastructure: Azure resources' - record doc-NNN ID here
<!-- DOD:END -->
