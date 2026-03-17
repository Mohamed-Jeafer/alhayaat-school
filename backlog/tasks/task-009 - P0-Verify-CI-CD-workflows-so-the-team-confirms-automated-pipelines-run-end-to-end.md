---
id: TASK-009
title: >-
  [P0] Verify CI/CD workflows so the team confirms automated pipelines run
  end-to-end
status: To Do
assignee: []
created_date: '2026-03-15 10:52'
updated_date: '2026-03-15 12:57'
labels:
  - phase-0
  - cicd
  - verification
milestone: m-0
dependencies:
  - TASK-004
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a developer on the Al-Hayaat project, I want to trigger each GitHub Actions workflow and verify it completes successfully, so that I can confirm the CI/CD pipeline works end-to-end before the team relies on it for daily development.

**Business Context**
A broken CI/CD pipeline silently undermines the entire development workflow — PRs merge without checks, deployments fail silently, and the team loses trust in automation. Verifying each workflow with real triggers ensures the pipeline is production-ready.

**Technical Specification**
- Rendering: N/A — workflow verification only
- Data: N/A
- Infrastructure: GitHub Actions runners, Azure App Service (dev environment)
- Stack constraints: `gh workflow list`, `gh run list`, `gh run view` commands to verify workflow execution
- Phase dependencies: TASK-004 (workflows must be committed), TASK-005 (repo must exist), TASK-006 (Azure App Services must be deployed)
- Spec reference: `.kiro/specs/phase-0-infrastructure-setup.md`

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| Workflow not found | Workflow file missing or invalid YAML | Fix YAML syntax, re-commit to .github/workflows/ |
| Run failed | CI step failed (lint/build/deploy) | Check GitHub Actions run log for specific failure |
| Deploy timeout | Azure deployment exceeded time limit | Check App Service deployment logs, verify resource health |

**Recommended Skills**
- `#senior-architect` — CI/CD verification, GitHub Actions debugging

**Story Points**: 2
*Sizing rationale: Requires triggering 4 workflows with real PRs and merges — straightforward but time-consuming integration testing.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given all 4 workflow files are committed - When the verify script checks file existence - Then ci.yml, deploy-dev.yml, deploy-staging.yml, and deploy-prod.yml are all present
When the developer runs gh workflow list
Then 4 workflows are listed: ci, deploy-dev, deploy-staging, deploy-prod
- [ ] #2 Given ci.yml exists - When a test PR is opened against develop - Then ci.yml triggers and all steps complete with green status
When the developer creates a test PR against develop
Then gh run list --workflow=ci.yml shows a completed run with conclusion: success
- [ ] #3 Given ci.yml passes - When the test PR is merged to develop - Then deploy-dev.yml triggers and the app deploys to the dev App Service
When the developer merges the PR to develop
Then deploy-dev.yml triggers and gh run list --workflow=deploy-dev.yml shows conclusion: success
- [ ] #4 Given deploy-dev.yml completes - When the dev App Service URL is accessed - Then HTTP 200 is returned confirming the deployment is live
When the developer visits the dev App Service URL
Then the app returns HTTP 200
- [ ] #5 Edge case: prod gate - Given deploy-prod.yml has an environment protection rule - When a push to main triggers it - Then the workflow pauses and does not deploy without maintainer approval
When a push to main triggers the workflow
Then the run pauses at the approval step and does not deploy without manual approval
- [ ] #6 Edge case: workflow failure - Given a PR introduces a lint error - When ci.yml runs - Then the workflow fails and the PR is blocked from merging
When ci.yml runs
Then the workflow fails and the PR status check blocks merging
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 All 4 workflows triggered and verified with real runs
- [ ] #2 CI pass and fail scenarios both tested
- [ ] #3 Dev deployment confirmed accessible via HTTP 200
- [ ] #4 Prod environment protection gate confirmed working
- [ ] #5 TASK-004 confirmed complete
<!-- DOD:END -->
