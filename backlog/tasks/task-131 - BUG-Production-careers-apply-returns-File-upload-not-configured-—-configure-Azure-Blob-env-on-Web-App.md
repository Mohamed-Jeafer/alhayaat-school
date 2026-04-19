---
id: TASK-131
title: >-
  BUG: Production careers apply returns File upload not configured — configure
  Azure Blob env on Web App
status: To Do
assignee: []
created_date: '2026-04-19 13:04'
labels:
  - bug
  - production
  - azure
  - careers
  - file-upload
dependencies: []
references:
  - 'https://www.alhayaat.ca/careers/apply'
documentation:
  - src/lib/services/job-application.service.ts
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
POST /api/jobs/apply requires process.env.AZURE_STORAGE_CONNECTION_STRING. Production Web App (al-hayaat-prod) did not have this setting; users see toast File upload not configured. Code uploads to container resumes on the storage account using BlobServiceClient.fromConnectionString.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 AZURE_STORAGE_CONNECTION_STRING is configured on al-hayaat-prod (plain app setting or working Key Vault secret reference)
- [ ] #2 Web App restarted after change
- [ ] #3 Submit test application at /careers/apply with PDF returns HTTP 201 and confirmation UI
- [ ] #4 Blob appears in storage account container resumes (naming: UUID-originalfilename)
- [ ] #5 Row inserted in PostgreSQL job_applications with non-null resume_blob_url
<!-- AC:END -->
