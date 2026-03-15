---
id: TASK-001.02
title: Next.js Project Initialization
status: To Do
assignee: []
created_date: '2026-03-08 17:52'
updated_date: '2026-03-15 10:43'
labels:
  - phase-0
  - setup
milestone: m-0
dependencies: []
parent_task_id: TASK-001
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Initialize Next.js 15 with TypeScript, Tailwind CSS, ESLint, and Prettier
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Next.js 15 project initialized with create-next-app
- [ ] #2 TypeScript configured (tsconfig.json)
- [ ] #3 Tailwind CSS installed and configured (tailwind.config.ts)
- [ ] #4 ESLint configured (.eslintrc.json)
- [ ] #5 Prettier configured (.prettierrc)
- [ ] #6 App Router enabled with src/ directory structure
- [ ] #7 Import alias @/* configured
- [ ] #8 npm run build succeeds with no errors
- [ ] #9 npm run dev starts successfully on localhost:3000
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Steps

```bash
npx create-next-app@latest al-hayaat-nextjs \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
cd al-hayaat-nextjs
npm install
npm run build
```

## Configuration Files
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind with brand colors (to be extended in Phase 1)
- `.eslintrc.json` - ESLint rules
- `.prettierrc` - Code formatting rules
- `.env.local` - Local environment variables (from template)

## Environment Variables Template
```env
DATABASE_URL=postgresql://user:password@localhost:5432/alhayaat_db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
AZURE_STORAGE_CONNECTION_STRING=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
APPLICATIONINSIGHTS_CONNECTION_STRING=
```
<!-- SECTION:PLAN:END -->
