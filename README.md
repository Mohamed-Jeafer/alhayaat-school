# Al-Hayaat School Website

Al-Hayaat School is an school that empowers students with a holistic education rooted in the teachings of the Holy Quran and the principles of Ahlulbayt [A.S.]. The mission is to shape academically competent, spiritually grounded, and morally upright individuals ready to contribute to society with confidence and pride in their identity.

## What This Project Is

This is a full migration of the Al-Hayaat School website from Webflow to a modern Next.js 15 application. The original Webflow export lives in `al-hayaat.webflow/` and serves as the design reference. The new site is being built with a full backend — forms, donations, authentication, and an admin dashboard.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js
- **Payments**: Stripe (donations)
- **Email**: Resend
- **Deployment**: Azure App Service
- **IaC**: Azure Bicep
- **CI/CD**: GitHub Actions

## Project Structure

```
al-hayaat.webflow/   # Original Webflow export (design reference)
diagrams/            # Architecture, DB schema, CI/CD, component hierarchy diagrams
docs/                # Migration plan, component specs, validation reports
.kiro/specs/         # Phase-by-phase implementation specs (phases 0–8)
backlog/             # Task tracking via Backlog.md MCP
```

The Next.js app itself hasn't been scaffolded yet — that happens in Phase 0.

## Migration Phases

| Phase | Description | Est. Hours |
|-------|-------------|------------|
| 0 | Infrastructure setup (GitHub, Azure, CI/CD, DB schema) | 16h |
| 1 | Foundation & design system (Tailwind tokens, base components) | 24h |
| 2 | Component library (45 components) | 40h |
| 3 | Static pages (Home, About, School Plans, Curriculum, Admission) | 32h |
| 4 | Database integration & interactive pages (Contact, Careers, Donate, Application) | 32h |
| 5 | Authentication & admin dashboard | 32h |
| 6 | Stripe donation integration | 24h |
| 7 | Polish & optimization (animations, Lighthouse 95+) | 32h |
| 8 | Testing & production deployment | 40h |

**Total**: ~272 hours (6–8 weeks with 1–2 developers)

## Resuming Work

### Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL)
- Azure CLI (for infrastructure)
- Stripe account
- Resend account

### Getting Started

1. Clone the repo and install dependencies (once the Next.js project is scaffolded in Phase 0):
   ```bash
   npm install
   ```

2. Copy the environment template and fill in your values:
   ```bash
   cp .env.example .env.local
   ```
   Required env vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`

3. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

### Where to Pick Up

1. Check current task status in the backlog:
   - Open `backlog/tasks/` to see all tasks and their status
   - Tasks are prefixed by phase (P0–P8)

2. Read the relevant phase spec in `.kiro/specs/` before starting work on a phase

3. Use the Webflow export in `al-hayaat.webflow/` as the visual reference for all pages and components

4. Architecture diagrams are in `diagrams/` — start with `system-architecture.svg` for the big picture

### Key Reference Docs

- `docs/plan.md` — Full migration plan with decisions and rationale
- `docs/COMPONENT-LIBRARY-SPEC.md` — Detailed spec for all 45 components
- `docs/REVISED-MIGRATION-PLAN.md` — Updated migration strategy
- `docs/MIGRATION-PLAN-VALIDATION.md` — Design system validation against Webflow
- `.kiro/specs/README.md` — Phase-by-phase spec index

## Pages Being Migrated

| Page | Webflow Source |
|------|---------------|
| Home | `index.html` |
| About | `about.html` |
| School Plans | `school-plans.html` |
| Academic & Curriculum | `academic-and-curriculum.html` |
| Admission | `admission.html` |
| Contact | `contact.html` |
| Careers | `careers.html` |
| Donate | `donate.html` |
| Application | `application.html` |
| Blog Detail | `detail_blog.html` |
