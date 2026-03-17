---
id: TASK-001
title: >-
  [P0] Establish project infrastructure so the development team can begin
  building features
status: To Do
assignee: []
created_date: '2026-03-08 17:52'
updated_date: '2026-03-15 12:57'
labels:
  - phase-0
  - infrastructure
milestone: m-0
dependencies: []
references:
  - .kiro/specs/phase-0-infrastructure-setup.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a developer on the Al-Hayaat project, I want a fully provisioned infrastructure foundation (GitHub repo, Azure resources, CI/CD pipelines, database, and Next.js project), so that the team can begin feature development with confidence that code flows from commit to production.

**Business Context**
The Webflow site has no version control, no staging environment, and no automated deployments. Establishing infrastructure first eliminates the "works on my machine" problem and ensures every subsequent phase has a reliable, repeatable deployment pipeline from day one.

**Technical Specification**
- Rendering: N/A — infrastructure-only phase
- Data: PostgreSQL schema with 5 tables deployed via raw SQL
- Infrastructure: Azure App Service, PostgreSQL Flexible Server, Key Vault, Application Insights, Storage Account — all provisioned via Bicep IaC
- Stack constraints: GitHub Actions for CI/CD, Bicep parameter files per environment (dev/staging/prod)
- Phase dependencies: None — this is the first phase
- Spec reference: `.kiro/specs/phase-0-infrastructure-setup.md`

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| Bicep deployment failure | ARM template validation error | Review deployment logs in Azure Portal, fix template |
| CI workflow failure | Lint/type-check/build error | Fix code, re-push to trigger CI |
| DB connection failure | PostgreSQL unreachable | Verify firewall rules and connection string in Key Vault |

**Recommended Skills**
- `#senior-architect` — infrastructure design, Azure resource provisioning, CI/CD pipeline architecture

**Story Points**: 8
*Sizing rationale: Spans 5 sub-tasks (repo, Next.js init, Bicep, DB schema, CI/CD) across 16 hours — at the split boundary. Requires Lead Engineer review before sprint.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the GitHub repo does not exist — When all P0 sub-tasks execute — Then GitHub repo, Azure resources, CI/CD pipelines, DB schema, and Next.js project are all operational
When all P0 sub-tasks are executed in sequence
Then a GitHub repo, Azure resources, CI/CD pipelines, DB schema, and Next.js project are all operational
When the developer runs the repository setup script
Then the al-hayaat-nextjs repo is created with main and develop branches, branch protection rules active, and all 4 secrets configured
- [ ] #2 Given the repository exists with no project code — When the Next.js project is pushed to develop — Then npm run build exits with code 0 on the develop branch
When the Next.js project is initialized and pushed to develop
Then `npm run build` exits with code 0 on the develop branch
When the developer runs create-next-app with TypeScript, Tailwind, ESLint, and App Router flags
Then npm run build completes with exit code 0 and src/app/ directory structure exists
- [ ] #3 Given the Azure dev resource group is empty — When the Bicep deployment runs with dev.json — Then all 6 Azure resources appear in rg-alhayaat-dev with status Succeeded
When the Bicep deployment runs with dev.json parameters
Then all 6 Azure resources are provisioned in rg-alhayaat-dev with status Succeeded
When the developer deploys infrastructure/main.bicep with dev parameters
Then all 6 resources (App Service, PostgreSQL, Key Vault, Storage, App Insights, App Service Plan) are provisioned and az resource list confirms them
- [ ] #4 Given the PostgreSQL server is running — When scripts/db/schema.sql is executed — Then all 5 tables and indexes exist and seed data is populated
When scripts/db/schema.sql is executed
Then all 5 tables and indexes exist and seed data is populated
When the developer executes scripts/db/schema.sql
Then 5 tables are created (contact_submissions, job_applications, newsletter_subscribers, donations, users) with correct indexes
- [ ] #5 Given all infrastructure is deployed — When all 4 GitHub Actions workflows are triggered — Then CI passes on a PR and dev deployment completes with HTTP 200
When all 4 GitHub Actions workflows are triggered
Then CI passes on a PR and dev deployment completes with HTTP 200
When a PR is opened against develop
Then the ci.yml workflow triggers and passes lint, type-check, and build steps
- [ ] #6 Edge case: Bicep idempotency — Given infra was already deployed — When Bicep runs again — Then all resources remain unchanged with no errors
When the Bicep deployment runs again
Then all resources remain unchanged with no errors or state drift
When the developer re-runs the Bicep deployment
Then no resources are duplicated and the deployment succeeds with no changes
- [ ] #7 Edge case: Secret rotation — Given Key Vault secrets exist — When a secret is rotated — Then the App Service reads the new value without a restart
When a secret value is rotated in Key Vault
Then the App Service reads the new value without requiring a restart
When a secret value is updated
Then the App Service picks up the new value on next restart without code changes
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Phase 0 Sub-tasks

1. **TASK-001.01** - GitHub Repository Setup (2h)
2. **TASK-001.02** - Next.js Project Initialization (2h)
3. **TASK-001.03** - Azure Bicep Infrastructure (6h)
4. **TASK-001.04** - Database Schema Setup (2h)
5. **TASK-001.05** - GitHub Actions Workflows (4h)

## Dependencies
None — this is the first phase.

## References
See `.kiro/specs/phase-0-infrastructure-setup.md` for full details.
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 All verification tasks (TASK-007 through TASK-011) pass
- [ ] #3 Application Insights logging enabled on dev App Service
- [ ] #4 Corresponding verify tasks in Backlog.md marked Done
- [ ] #5 Deployment guide created via backlog doc create -t technical 'Deployment guide: P0 infrastructure' — record doc-NNN ID here
<!-- DOD:END -->
