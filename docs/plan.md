# Migration Plan: Webflow to React TypeScript (Next.js App Router)

## Executive Summary

Migrate Al-Hayaat School website from Webflow to a modern React TypeScript application using Next.js 15+ App Router, Tailwind CSS, with comprehensive backend functionality (forms, donations, authentication). Content will remain hardcoded initially, with architecture ready for future CMS integration.

**Timeline Estimate**: 6-8 weeks (balanced quality approach)  
**Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Prisma + PostgreSQL, NextAuth.js, Stripe  
**Deployment**: AWS/Azure/GCP with Docker containerization

---

## Phase 1: Foundation & Setup (Week 1)

### 1.1 Project Initialization & Configuration
**Goal**: Set up development environment with TypeScript, ESLint, Prettier, and testing infrastructure.

**Tasks**:
1. Initialize Next.js 15 project with App Router
2. Configure TypeScript (strict mode)
3. Set up Tailwind CSS with custom theme
PHASE 2: Component Library (Weeks 2-3)
4. Build core layout components: Navigation (sticky, mobile menu), Footer, Section wrappers (depends on 3)
5. Build atomic UI components: HeroSection, FeatureCard, WhyCard, Form inputs, ImageWithSrcSet (parallel with step 4)
6. Create Storybook stories + unit tests for all components (depends on 5)

PHASE 3: Page Migration (Weeks 3-4)
7. Convert static pages: Home, About, School Plans, Curriculum (depends on 5)
8. Convert interactive pages: Contact (with form), Careers, Donate, Application (depends on 7)
9. Add metadata, SEO, JSON-LD structured data to all pages (parallel with steps 7-8)

PHASE 4: Backend Infrastructure (Week 5)
10. Set up PostgreSQL + Prisma ORM with schema (ContactSubmissions, JobApplications, NewsletterSubscribers, Donations, Users) (parallel with phase 3)
11. Build API routes: /api/contact, /api/jobs/apply, /api/newsletter/subscribe, /api/donations with email integration (Resend) (depends on 10)
12. Implement NextAuth.js v5 for admin authentication (depends on 10)

PHASE 5: Advanced Features (Week 6)
13. Integrate Stripe for donation payments: checkout, webhooks, tax receipts (depends on 11)
14. Build admin dashboard with protected routes: view submissions, applications, subscribers, donations with DataTables (depends on 12)

PHASE 6: Polish (Week 7)
15. Add Framer Motion animations: page transitions, scroll-triggered reveals, micro-interactions (depends on 8)
16. SEO & performance optimization: image optimization, lazy loading, sitemap, Lighthouse 95+ score (parallel with 15)

PHASE 7: Launch (Week 8)
17. Comprehensive testing: unit, component, API, E2E (Playwright), cross-browser, accessibility audit (depends on 16)
18. Production deployment to AWS/Azure/GCP: containerization, CI/CD (GitHub Actions), custom domain, SSL, monitoring (depends on 17)

Relevant Files
Source Reference (Webflow export):

css/al-hayaat.webflow.css — Design system extraction (colors, typography, spacing)
index.html — Home page structure (hero, features, CTA patterns)
about.html — Team/staff layout patterns
contact.html — Form structure
js/webflow.js — Interaction patterns (navigation, animations)
images/ folder — 128 images to migrate with responsive variants
New Project Structure:
/app - Next.js App Router pages
/components - Reusable React components
/lib - Utilities, content constants, types
/prisma - Database schema, migrations
/public - Static assets (images, fonts)
/styles - Global Tailwind config

Verification
Per Phase Success Criteria:

✓ Phase 1: npm run build && npm run lint && npm run type-check passes
✓ Phase 2: All components render, Storybook accessible, unit tests pass
✓ Phase 3: 10 pages visually match Webflow, Lighthouse 90+ (initial)
✓ Phase 4: API routes functional, database inserts work, emails sent
✓ Phase 5: Test payment succeeds, admin can view all submissions
✓ Phase 6: Animations smooth (60fps), Lighthouse 95+ all metrics
✓ Phase 7: 80%+ test coverage, all tests pass, zero critical accessibility issues
✓ Phase 8: Production deployment live, SSL active, monitoring configured
Final Acceptance:

All 10 pages migrated and pixel-perfect match
Contact form, job application, newsletter, donations functional
Admin dashboard operational with authentication
Lighthouse: Performance 95+, Accessibility 100, SEO 100
Cross-browser compatible (Chrome, Safari, Firefox, Edge)
Mobile responsive (375px, 768px, 1440px tested)
Production deployed with CI/CD pipeline
Manual Tests:

Submit contact form → verify email received + DB record
Complete donation → verify Stripe payment + thank you email + tax receipt
Login to admin → view all submissions in dashboard
Test mobile menu → opens/closes smoothly
Run Lighthouse audit → all scores 95+
Decisions
No CMS initially — Content hardcoded in /lib/content/*.ts files for speed, architecture ready for future Contentful/Strapi integration (see Phase 8 roadmap)
Tailwind CSS — Utility-first approach for rapid development, smaller bundle than CSS-in-JS
Next.js App Router — Latest Next.js architecture with React Server Components for performance
shadcn/ui — Unstyled components for consistency, easy customization
Prisma + PostgreSQL — Type-safe ORM, easier migrations than raw SQL
NextAuth.js v5 — Industry standard for Next.js authentication
Stripe — Most reliable payment processing for donations
Cloud deployment — AWS/Azure/GCP for scalability (not Vercel due to user preference)
Scope Included:

All 10 HTML pages migrated
Full backend (forms, database, auth, payments)
Admin dashboard for viewing submissions
Email notifications (contact, donations)
Responsive design matching Webflow
SEO optimization
Deployment pipeline
Scope Excluded (Future roadmap):

Blog content system (detail_blog.html is template only)
Search functionality (stub in Webflow)
Multi-language support (Arabic)
Parent portal (student grades/announcements)
Analytics dashboard
Further Considerations
Questions & Recommendations:

Resume uploads for job applications — How should we store resumes?
Recommendation: Use AWS S3 for file storage (scalable, secure). Alternative: Vercel Blob if switching to Vercel deployment.

Email deliverability — Need to configure domain SPF/DKIM records for production emails.
Recommendation: Use Resend (developer-friendly) or SendGrid (enterprise-grade). Budget: ~$10/month for 10k emails.

Database hosting — Where to host PostgreSQL?
Recommendation: AWS RDS (managed), Azure Database for PostgreSQL, or Google Cloud SQL. Budget: ~$20-50/month for small instance.

Next Steps
The detailed plan has been saved to /memories/session/plan.md with:

Specific prompts for each phase (copy-paste ready for AI agents)
Code examples and references
Risk mitigation strategies
Architecture decision records
Would you like me to:

Start Phase 1 (Initialize Next.js project with full configuration)
Refine the plan (adjust timeline, scope, or approach)
Deep dive into a specific phase (more detail on backend, deployment, etc.)
Generate kickoff documentation (README, folder structure, Git setup)