---
id: TASK-133
title: >-
  BUG: Production DATABASE_URL stored as plain app setting — move to Key Vault
  and rotate after KV fix
status: To Do
assignee: []
created_date: '2026-04-19 13:04'
labels:
  - bug
  - production
  - azure
  - security
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
DATABASE_URL is visible as a plain application setting on the Web App. After Key Vault references work, store connection string as a secret and reference it; rotate database password because it may have been exposed via portal screenshots or access logs.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Key Vault secret holds DB connection string; app setting uses @Microsoft.KeyVault reference and resolves
- [ ] #2 Database user password rotated; old password invalidated
- [ ] #3 Application connects and write flows still pass smoke test
<!-- AC:END -->
