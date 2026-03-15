---
id: TASK-006
title: '[P0] Azure Bicep Infrastructure'
status: To Do
assignee: []
created_date: '2026-03-15 10:51'
updated_date: '2026-03-15 10:58'
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
Create Bicep IaC files for all 6 Azure resources with environment-specific parameter files for dev, staging, and prod. Deploy to dev environment.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 infrastructure/main.bicep created
- [ ] #2 Modules created: app-service.bicep, database.bicep, storage.bicep, keyvault.bicep
- [ ] #3 Parameter files created for dev, staging, prod
- [ ] #4 App Service Plan provisioned (B1 dev / P1V2 prod)
- [ ] #5 App Service provisioned with Linux/Node.js 20
- [ ] #6 PostgreSQL Flexible Server provisioned (B1ms dev / D2s_v3 prod)
- [ ] #7 Storage Account with resumes blob container provisioned
- [ ] #8 Key Vault provisioned with DATABASE_URL, NEXTAUTH_SECRET, STRIPE_SECRET_KEY
- [ ] #9 Application Insights provisioned
- [ ] #10 az deployment group create succeeds against dev resource group
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
