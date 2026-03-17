---
id: TASK-004
title: >-
  [P0] Create CI/CD workflows so code changes deploy automatically from commit
  to production
status: Done
assignee: []
created_date: '2026-03-15 10:51'
updated_date: '2026-03-15 21:21'
labels:
  - phase-0
  - cicd
milestone: m-0
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a developer on the Al-Hayaat project, I want GitHub Actions workflows for CI on PRs, automatic deployment to dev on merge, and gated deployment to production, so that every code change is validated and deployed without manual intervention.

**Business Context**
The Webflow site has no deployment pipeline — changes go live immediately with no review or rollback capability. Automated CI/CD with environment gates ensures code quality, prevents broken deployments, and gives the team confidence to ship frequently with a safety net.

**Technical Specification**
- Rendering: N/A — CI/CD pipeline configuration
- Data: N/A
- Infrastructure: GitHub Actions runners, Azure App Service deployment slots (dev/staging/prod)
- Stack constraints: 4 workflow files (ci.yml, deploy-dev.yml, deploy-staging.yml, deploy-prod.yml), GitHub Secrets for Azure credentials, environment protection rules for prod
- Phase dependencies: TASK-005 (GitHub repo with secrets), TASK-006 (Azure App Services to deploy to)
- Spec reference: `.kiro/specs/phase-0-infrastructure-setup.md`

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| CI failure | Lint/type-check/build error on PR | Fix errors shown in GitHub Actions log, re-push |
| Deploy failure | Azure deployment rejected | Check Azure credentials secret, verify App Service is running |
| Approval timeout | Prod deploy not approved within 72h | Re-trigger workflow after obtaining approval |

**Recommended Skills**
- `#senior-architect` — CI/CD pipeline design, GitHub Actions patterns, deployment strategy

**Story Points**: 5
*Sizing rationale: 4 workflow files with different triggers, secret management, and environment protection rules — moderate complexity with integration testing required.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given all 4 workflow files are committed - When a PR is opened against develop - Then ci.yml triggers and runs lint, type-check, and build steps
When a PR is opened against develop
Then ci.yml triggers automatically and runs lint, type-check, and build steps
When a developer opens a PR against develop
Then ci.yml triggers and runs lint, type-check, and build steps to completion
- [ ] #2 Given ci.yml passes on a PR - When all steps succeed - Then a green check appears and merging is unblocked
When all steps pass
Then a green check mark appears on the PR and merging is unblocked
When the developer merges the PR to develop
Then deploy-dev.yml triggers and deploys the app to the dev App Service
- [ ] #3 Given a merge to develop succeeds - When deploy-dev.yml runs - Then the app deploys to the dev App Service and returns HTTP 200
When deploy-dev.yml runs
Then the Next.js app is deployed to the dev App Service and returns HTTP 200
When the developer visits the dev App Service URL
Then the app returns HTTP 200 on the health check endpoint
- [ ] #4 Given deploy-prod.yml has an environment protection rule - When a push to main triggers it - Then deployment pauses until a maintainer approves
When a push to main triggers the workflow
Then deployment pauses at the approval gate until a maintainer explicitly approves
When a push to main triggers the workflow
Then the deployment pauses and waits for manual approval before proceeding
- [ ] #5 Edge case: CI failure - Given a PR has a TypeScript error - When ci.yml runs - Then the workflow fails and the PR is blocked from merging
When ci.yml runs
Then the workflow fails with a non-zero exit code and the PR is blocked from merging
When ci.yml runs
Then the workflow fails with a clear error message and the PR is blocked from merging
- [ ] #6 Edge case: missing secret - Given AZURE_CREDENTIALS is absent - When deploy-dev.yml runs - Then the workflow fails at Azure login with a descriptive error
When deploy-dev.yml runs
Then the workflow fails at the Azure login step with a descriptive error message
When deploy-dev.yml triggers
Then the workflow fails at the Azure login step with a descriptive error
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Workflows

| File | Trigger | Steps |
|---|---|---|
| ci.yml | PR to develop/main | install → lint → type-check → build |
| deploy-dev.yml | push to develop | build → deploy to dev App Service |
| deploy-staging.yml | manual dispatch | build → deploy to staging App Service |
| deploy-prod.yml | push to main | build → approval → deploy to prod |

## Required Secrets
AZURE_CREDENTIALS, AZURE_WEBAPP_NAME_DEV, AZURE_WEBAPP_NAME_STAGING, AZURE_WEBAPP_NAME_PROD
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
4 GitHub Actions workflows created: ci.yml (PR lint/typecheck/build), deploy-dev.yml (develop push + Stripe secret check), deploy-staging.yml (manual dispatch with confirmation gate), deploy-prod.yml (main push + manual approval environment + dual Stripe secret verification).
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 All 4 workflow files committed to .github/workflows/
- [ ] #3 CI workflow tested with a real PR (pass and fail scenarios)
- [ ] #4 Deploy-dev tested with a merge to develop
- [ ] #5 Prod workflow environment protection gate verified
- [ ] #6 Verification script passes (scripts/verify/cicd-check.sh)
- [ ] #7 Corresponding [P0] Verify CI/CD Workflows task in Backlog.md marked Done
<!-- DOD:END -->
