---
id: TASK-011
title: >-
  [P0] Verify Next.js project build so the team confirms the codebase compiles
  and lints cleanly
status: To Do
assignee: []
created_date: '2026-03-15 10:53'
updated_date: '2026-03-15 12:57'
labels:
  - phase-0
  - setup
  - verification
milestone: m-0
dependencies:
  - TASK-002
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a developer on the Al-Hayaat project, I want to run build, lint, and type-check verification against the Next.js project, so that I can confirm the scaffolded codebase is correctly configured and ready for feature development.

**Business Context**
A project that fails to build or lint on a clean clone wastes developer time and erodes trust in the codebase. Verification ensures every developer can clone, install, and build on the first try.

**Technical Specification**
- Rendering: N/A — build verification only
- Data: N/A
- Infrastructure: Local development environment
- Stack constraints: `npm run build`, `npm run lint`, `npx tsc --noEmit`, @/* import alias resolution
- Phase dependencies: TASK-002 (Next.js project must be initialized)
- Spec reference: `.kiro/specs/phase-0-infrastructure-setup.md`

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| Build failure | TypeScript compilation error | Fix errors reported in build output |
| Lint failure | ESLint rule violation | Run `npm run lint -- --fix` for auto-fixable issues |
| Type error | TypeScript strict mode violation | Fix type annotations in reported files |

**Recommended Skills**
- `#senior-architect` — build tooling verification, TypeScript configuration validation

**Story Points**: 1
*Sizing rationale: Single verification script with CLI commands — minimal complexity.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given TASK-002 is complete - When npm run build executes - Then the build completes with exit code 0 and zero errors
When the developer runs npm run build
Then the build exits with code 0 and no errors
- [ ] #2 Given the project is built - When npm run lint executes - Then ESLint reports zero violations across all files
When the developer runs npm run lint
Then the linter exits with code 0 and no warnings
- [ ] #3 Given TypeScript is in strict mode - When npx tsc runs with noEmit flag - Then zero type errors are reported
When the developer runs npx tsc --noEmit
Then type checking passes with code 0
- [ ] #4 Given the src/ directory exists with import alias configured - When the build processes all imports - Then all aliases resolve correctly with no module-not-found errors
When the developer checks for src/app/ subfolder
Then the App Router directory structure is present
- [ ] #5 Edge case: import alias - Given a file uses path alias import syntax - When the build runs - Then the import resolves correctly with no module not found error
When the developer runs the build
Then the import resolves correctly with no module-not-found errors
- [ ] #6 Edge case: clean clone - Given the project is cloned fresh with no node_modules - When npm install and npm run build run - Then the build succeeds with exit code 0
When the developer runs npm install followed by npm run build
Then both commands succeed with exit code 0
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 scripts/verify/nextjs-check.sh exits with code 0 and prints PASS for all checks
- [ ] #2 Build, lint, and type-check all pass
- [ ] #3 Import alias verified working
- [ ] #4 TASK-002 confirmed complete
<!-- DOD:END -->
