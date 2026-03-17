# Al-Hayaat School - Migration Specs

## Overview

This directory contains detailed specifications for migrating the Al-Hayaat School website from Webflow to Next.js 15 with Azure deployment.

## Project Structure

The migration is organized into 8 phases, each with detailed tasks, acceptance criteria, and deliverables.

## Phases

### Phase 0: Infrastructure Setup (16 hours)
**Status**: Pending  
**File**: `phase-0-infrastructure-setup.md`

Set up GitHub repository, Azure infrastructure with Bicep IaC, CI/CD pipelines, and database schema.

**Key Deliverables**:
- GitHub repository with Next.js 15
- Azure resources (App Service, PostgreSQL, Storage, Key Vault)
- GitHub Actions workflows
- Database schema deployed

---

### Phase 1: Foundation & Design System (24 hours)
**Status**: Pending  
**Dependencies**: Phase 0  
**File**: `phase-1-foundation-design-system.md`

Extract design system from Webflow CSS, configure Tailwind, build foundational components, and set up database utilities.

**Key Deliverables**:
- Design tokens extracted
- Tailwind configured with brand colors
- Button and Typography components
- Database connection and query utilities

---

### Phase 2: Core Component Library (40 hours)
**Status**: Pending  
**Dependencies**: Phase 1  
**File**: `phase-2-component-library.md`

Build complete reusable component library with 45 components organized by category.

**Key Deliverables**:
- 7 layout components
- 15 UI components
- 10 form components
- 6 data display components
- 4 feedback components
- 3 animation components

---

### Phase 3: Content Extraction & Static Pages (32 hours)
**Status**: Pending  
**Dependencies**: Phase 2  
**File**: `phase-3-static-pages.md`

Extract content from Webflow, migrate images, and build static pages.

**Key Deliverables**:
- 5 static pages (Home, About, School Plans, Curriculum, Admission)
- 128 optimized images
- SEO metadata and structured data
- Sitemap and robots.txt

---

### Phase 4: Database Integration & Interactive Pages (32 hours)
**Status**: Pending  
**Dependencies**: Phase 2, Phase 3  
**File**: `phase-4-database-integration.md`

Build interactive pages with forms, API routes, and email integration.

**Key Deliverables**:
- Contact, Careers, Donate, Application pages
- API routes for all forms
- Email integration (Resend)
- Rate limiting

---

### Phase 5: Authentication & Admin Dashboard (32 hours)
**Status**: Pending  
**Dependencies**: Phase 4  
**File**: `phase-5-admin-dashboard.md`

Implement authentication and build admin dashboard for managing submissions.

**Key Deliverables**:
- NextAuth.js authentication
- Admin dashboard with stats
- Data tables for all submissions
- CSV export functionality

---

### Phase 6: Stripe Integration (24 hours)
**Status**: Pending  
**Dependencies**: Phase 4  
**File**: `phase-6-stripe-integration.md`

Implement complete Stripe payment flow for donations.

**Key Deliverables**:
- Stripe Checkout integration
- Webhook handler
- PDF receipt generation
- Thank-you emails

---

### Phase 7: Polish & Optimization (32 hours)
**Status**: Pending  
**Dependencies**: Phase 6  
**File**: `phase-7-optimization.md`

Optimize performance, add animations, and enhance SEO.

**Key Deliverables**:
- Framer Motion animations
- Image and font optimization
- Lighthouse score 95+
- Error boundaries and loading states

---

### Phase 8: Testing & Deployment (40 hours)
**Status**: Pending  
**Dependencies**: Phase 7  
**File**: `phase-8-testing-deployment.md`

Comprehensive testing and production deployment.

**Key Deliverables**:
- Complete test suite (unit, component, E2E)
- Cross-browser testing
- Accessibility audit
- Production deployment
- Custom domain and SSL

---

## Total Estimated Time

**272 hours** (approximately 6-8 weeks with 1-2 developers)

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL with raw SQL (pg library)
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Email**: Resend
- **Deployment**: Azure App Service
- **IaC**: Azure Bicep
- **CI/CD**: GitHub Actions

## How to Use These Specs

### For Project Managers
1. Review each phase for timeline and dependencies
2. Track progress using status field in frontmatter
3. Use estimated hours for resource planning

### For Developers
1. Start with Phase 0 and work sequentially
2. Each spec contains:
   - Detailed tasks with acceptance criteria
   - Code examples and implementation guidance
   - Verification steps
   - Success criteria
3. Mark tasks complete as you progress
4. Reference COMPONENT-LIBRARY-SPEC.md for component details
5. Reference MIGRATION-PLAN-VALIDATION.md for design validation

### For AI Agents
Each spec is structured for autonomous execution:
- Clear task breakdown
- Copy-paste ready code examples
- Explicit acceptance criteria
- Verification commands
- Dependencies clearly stated

## Reference Documents

- `REVISED-MIGRATION-PLAN.md` - Complete migration strategy
- `COMPONENT-LIBRARY-SPEC.md` - Detailed component specifications
- `MIGRATION-PLAN-VALIDATION.md` - Design system validation
- `diagrams/` - Architecture diagrams

## Progress Tracking

Update the status field in each spec's frontmatter:
- `pending` - Not started
- `in-progress` - Currently working
- `completed` - Finished and verified
- `blocked` - Waiting on dependencies

## Getting Started

1. Read `REVISED-MIGRATION-PLAN.md` for context
2. Review `MIGRATION-PLAN-VALIDATION.md` for design details
3. Start with `phase-0-infrastructure-setup.md`
4. Follow phases sequentially
5. Use component specs as reference during implementation

## Support

For questions or clarifications:
- Review validation report for design decisions
- Check component library spec for implementation details
- Refer to migration plan for architectural guidance
