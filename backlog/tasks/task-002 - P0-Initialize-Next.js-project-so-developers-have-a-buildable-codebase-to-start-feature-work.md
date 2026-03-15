---
id: TASK-002
title: >-
  [P0] Initialize Next.js project so developers have a buildable codebase to
  start feature work
status: To Do
assignee: []
created_date: '2026-03-15 10:50'
updated_date: '2026-03-15 11:54'
labels:
  - phase-0
  - setup
milestone: m-0
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a developer on the Al-Hayaat project, I want a fully initialized Next.js 15 project with TypeScript, Tailwind CSS, ESLint, Prettier, and App Router configured, so that I can immediately start building components without spending time on tooling setup.

**Business Context**
The current Webflow site has no local development environment or build pipeline. A properly scaffolded Next.js project with strict TypeScript, linting, and formatting from day one prevents technical debt accumulation and ensures consistent code quality across the team.

**Technical Specification**
- Rendering: N/A — project scaffolding only
- Data: N/A
- Infrastructure: Local development environment; project deploys to Azure App Service via CI/CD
- Stack constraints: Next.js 15 App Router, TypeScript strict mode, Tailwind CSS with `tailwind.config.ts`, ESLint + Prettier, src/ directory with @/* import alias
- Phase dependencies: TASK-005 (GitHub repo must exist to push initial commit)
- Spec reference: `.kiro/specs/phase-0-infrastructure-setup.md`

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| Build failure | TypeScript or config error | Fix reported errors in terminal output |
| Lint failure | ESLint rule violation | Run `npm run lint -- --fix` for auto-fixable issues |

**Recommended Skills**
- `#senior-architect` — project structure decisions, TypeScript configuration, tooling setup

**Story Points**: 2
*Sizing rationale: Single CLI command plus config file adjustments — straightforward scaffolding task.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given no Next.js project exists in the repository
When the developer runs create-next-app with --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
Then the project is created with all flags applied and the src/app/ directory structure exists
- [ ] #2 Given the project is created
When the developer runs npm run build
Then the build completes with exit code 0 and no TypeScript errors
- [ ] #3 Given the project is created
When the developer opens any .ts file and uses an @/* import
Then TypeScript resolves the import without errors
- [ ] #4 Edge case: clean install — Given the project is cloned fresh with no node_modules
When the developer runs npm install followed by npm run build
Then both commands succeed with exit code 0
- [ ] #5 Edge case: environment variables — Given .env.local.example exists with all required keys
When the developer copies it to .env.local and fills in values
Then the app starts without missing-env errors
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Steps

```bash
npx create-next-app@latest al-hayaat-nextjs \
  --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npm install
npm run build
```

## Config Files
- `tsconfig.json`, `tailwind.config.ts`, `.eslintrc.json`, `.prettierrc`, `.env.local`
<!-- SECTION:PLAN:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 tsconfig.json has strict mode enabled
- [ ] #3 tailwind.config.ts references design token structure from docs/
- [ ] #4 .env.local.example created with all required variable keys documented
- [ ] #5 npm run build passes with zero errors
- [ ] #6 Verification script passes (scripts/verify/nextjs-check.sh)
- [ ] #7 Corresponding [P0] Verify Next.js Project Build task in Backlog.md marked Done
<!-- DOD:END -->
