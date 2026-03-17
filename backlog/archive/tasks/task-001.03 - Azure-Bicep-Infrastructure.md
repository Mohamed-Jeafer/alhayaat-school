---
id: TASK-001.03
title: Azure Bicep Infrastructure
status: To Do
assignee: []
created_date: '2026-03-08 17:52'
updated_date: '2026-03-15 10:43'
labels:
  - phase-0
  - infrastructure
  - azure
milestone: m-0
dependencies: []
parent_task_id: TASK-001
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create Bicep files for App Service, PostgreSQL, Storage, Key Vault, Application Insights with dev/staging/prod parameters
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Bicep files created for all 6 Azure resources
- [ ] #2 Parameter files created for dev, staging, and prod environments
- [ ] #3 App Service Plan provisioned (B1 dev, P1V2 prod)
- [ ] #4 App Service (Web App) provisioned with Linux/Node.js 20
- [ ] #5 PostgreSQL Flexible Server provisioned (B1ms dev, D2s_v3 prod)
- [ ] #6 Storage Account provisioned with resumes blob container
- [ ] #7 Key Vault provisioned with DATABASE_URL, NEXTAUTH_SECRET, STRIPE_SECRET_KEY
- [ ] #8 Application Insights provisioned
- [ ] #9 Infrastructure deploys successfully via az deployment group create
- [ ] #10 All resources accessible and healthy in Azure portal
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

## Resources
| Resource | Dev SKU | Prod SKU |
|---|---|---|
| App Service Plan | B1 Basic | P1V2 Premium |
| App Service | Linux Node 20 | Linux Node 20 |
| PostgreSQL Flexible | B1ms Burstable | D2s_v3 General Purpose |
| Storage Account | Standard LRS | Standard LRS |
| Key Vault | Standard | Standard |
| Application Insights | - | - |

## Deployment Command
```bash
az deployment group create \
  --resource-group rg-alhayaat-dev \
  --template-file infrastructure/main.bicep \
  --parameters infrastructure/parameters/dev.json
```

## Verification
```bash
az resource list --resource-group rg-alhayaat-dev --output table
```
Expected: 6 resources listed
<!-- SECTION:PLAN:END -->
