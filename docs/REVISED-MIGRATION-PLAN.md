# Revised Migration Plan: Webflow to React TypeScript (Next.js + Azure)

## Executive Summary

Migrate Al-Hayaat School website from Webflow to Next.js 15 with TypeScript, deployed to Azure using Infrastructure as Code (Bicep/Terraform), with GitHub Actions CI/CD pipeline. Using raw SQL with pg library instead of Prisma, focusing on reusable component architecture.

**Timeline**: 6-8 weeks  
**Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, PostgreSQL (raw SQL), NextAuth.js, Stripe  
**Deployment**: Azure App Service + Azure Database for PostgreSQL  
**IaC**: Azure Bicep or Terraform  
**CI/CD**: GitHub Actions

---

## Reusable Component Library Definition

### Core Layout Components (7 components)
1. **Navigation** - Sticky header with mobile menu
   - Props: `links`, `logoSrc`, `ctaButton`
   - Variants: `transparent`, `solid`, `sticky`
   
2. **Footer** - Site footer with links and social
   - Props: `sections`, `socialLinks`, `copyright`
   
3. **Container** - Content width wrapper
   - Props: `size` (small/medium/large/full), `padding`
   
4. **Section** - Page section wrapper
   - Props: `background`, `padding` (none/small/medium/large), `className`
   
5. **Grid** - Responsive grid layout
   - Props: `columns` (1-4), `gap`, `children`
   
6. **PageHeader** - Breadcrumb + page title
   - Props: `title`, `breadcrumbs`, `description`
   
7. **Layout** - Root layout wrapper
   - Props: `children`, `showNav`, `showFooter`

### UI Components (15 components)
8. **Button** - Primary interaction element
   - Props: `variant` (primary/secondary/outline/ghost/icon), `size`, `loading`, `disabled`
   - Variants: 5 visual styles matching Webflow
   
9. **HeroSection** - Full-width hero banner
   - Props: `heading`, `subheading`, `cta`, `backgroundVariant` (glitter/dashlines/solid)
   
10. **FeatureCard** - Icon + title + description card
    - Props: `icon`, `title`, `description`, `link`
    
11. **WhyCard** - Larger feature card with decorative elements
    - Props: `title`, `description`, `decorativeElement`, `color`
    
12. **CTASection** - Call-to-action block
    - Props: `heading`, `description`, `primaryCta`, `secondaryCta`, `background`
    
13. **Card** - Generic card container
    - Props: `variant` (default/bordered/elevated), `padding`, `children`
    
14. **Badge** - Status/label indicator
    - Props: `variant` (default/success/warning/error), `children`
    
15. **Icon** - SVG icon wrapper
    - Props: `name`, `size`, `color`, `className`
    
16. **Image** - Responsive image with Next.js optimization
    - Props: `src`, `alt`, `sizes`, `priority`, `fill`

### Form Components (10 components)
17. **Form** - Form wrapper with validation
    - Props: `onSubmit`, `schema`, `children`
    
18. **Input** - Text input field
    - Props: `type`, `label`, `error`, `required`, `placeholder`
    
19. **Textarea** - Multi-line text input
    - Props: `label`, `rows`, `error`, `required`
    
20. **Select** - Dropdown selection
    - Props: `label`, `options`, `error`, `required`
    
21. **Checkbox** - Single checkbox
    - Props: `label`, `checked`, `onChange`
    
22. **Radio** - Radio button
    - Props: `label`, `name`, `value`, `checked`
    
23. **RadioGroup** - Radio button group
    - Props: `label`, `options`, `value`, `onChange`
    
24. **FileUpload** - File input with drag-drop
    - Props: `accept`, `maxSize`, `onUpload`, `label`
    
25. **FormField** - Field wrapper with label + error
    - Props: `label`, `error`, `required`, `children`
    
26. **SubmitButton** - Form submit button with loading state
    - Props: `loading`, `disabled`, `children`

### Data Display Components (6 components)
27. **Table** - Data table
    - Props: `columns`, `data`, `sortable`, `pagination`
    
28. **DataCard** - Stat/metric card
    - Props: `title`, `value`, `icon`, `trend`, `description`
    
29. **EmptyState** - No data placeholder
    - Props: `icon`, `title`, `description`, `action`
    
30. **LoadingSpinner** - Loading indicator
    - Props: `size`, `color`
    
31. **Skeleton** - Content placeholder
    - Props: `variant` (text/card/image), `count`
    
32. **Pagination** - Page navigation
    - Props: `currentPage`, `totalPages`, `onPageChange`

### Feedback Components (4 components)
33. **Toast** - Notification message (shadcn/ui)
    - Props: `variant` (success/error/warning/info), `title`, `description`
    
34. **Alert** - Inline alert message
    - Props: `variant`, `title`, `description`, `dismissible`
    
35. **Modal** - Dialog overlay
    - Props: `open`, `onClose`, `title`, `children`, `footer`
    
36. **ConfirmDialog** - Confirmation modal
    - Props: `open`, `title`, `message`, `onConfirm`, `onCancel`

### Animation Components (3 components)
37. **FadeIn** - Fade in on mount/scroll
    - Props: `delay`, `duration`, `triggerOnScroll`, `children`
    
38. **SlideIn** - Slide in animation
    - Props: `direction`, `delay`, `children`
    
39. **AnimatedCounter** - Number count-up animation
    - Props: `value`, `duration`, `suffix`

**Total: 39 Reusable Components**

---

## Revised Architecture Decisions

### Database Layer (Raw SQL)


**Why Raw SQL over Prisma:**
- Direct control over queries and performance optimization
- No ORM overhead or abstraction layer
- Easier to optimize complex queries
- Simpler debugging with direct SQL visibility
- Smaller bundle size

**Database Setup:**
```typescript
// /lib/db/connection.ts
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// /lib/db/queries.ts - Centralized query functions
export async function createContactSubmission(data: ContactData) {
  const query = `
    INSERT INTO contact_submissions (name, email, phone, message, created_at)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING id, created_at
  `;
  const result = await pool.query(query, [data.name, data.email, data.phone, data.message]);
  return result.rows[0];
}
```

### Azure Infrastructure (IaC with Bicep)

**Resources to provision:**
1. Azure App Service (Linux, Node.js 20)
2. Azure Database for PostgreSQL Flexible Server
3. Azure Key Vault (secrets management)
4. Azure Storage Account (file uploads - resumes)
5. Azure Application Insights (monitoring)
6. Azure CDN (optional - static assets)

**Bicep Structure:**
```
/infrastructure
  ├── main.bicep              # Main orchestration
  ├── modules/
  │   ├── app-service.bicep   # Web app
  │   ├── database.bicep      # PostgreSQL
  │   ├── storage.bicep       # Blob storage
  │   └── keyvault.bicep      # Secrets
  └── parameters/
      ├── dev.json
      ├── staging.json
      └── prod.json
```

### GitHub Repository Structure
```
al-hayaat-nextjs/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Build + test
│       ├── deploy-dev.yml      # Deploy to dev
│       ├── deploy-staging.yml  # Deploy to staging
│       └── deploy-prod.yml     # Deploy to production
├── app/                        # Next.js App Router
├── components/                 # 39 reusable components
├── lib/
│   ├── db/                     # Database queries
│   ├── utils/                  # Utilities
│   └── content/                # Content constants
├── infrastructure/             # Azure Bicep files
├── public/                     # Static assets
├── scripts/
│   └── db/
│       ├── schema.sql          # Database schema
│       ├── seed.sql            # Seed data
│       └── migrations/         # Migration scripts
└── tests/                      # Test files
```

---

## Revised Phase Plan

### Phase 0: Repository & Infrastructure Setup (Week 1 - Days 1-2)

**Tasks:**
1. Create new GitHub repository
2. Initialize Next.js 15 project locally
3. Create Azure Bicep infrastructure files
4. Set up GitHub Actions workflows
5. Create dev/staging/prod environments in Azure
6. Configure GitHub secrets for Azure credentials

**Deliverables:**
- GitHub repo: `al-hayaat-nextjs`
- Bicep files for all Azure resources
- GitHub Actions workflows (CI/CD)
- 3 environments deployed (dev, staging, prod)


**Prompt for Phase 0:**
```
Set up project infrastructure:

1. Create GitHub repository "al-hayaat-nextjs"
2. Initialize Next.js 15 with TypeScript, Tailwind, ESLint
3. Create /infrastructure/main.bicep with modules:
   - App Service (B1 tier for dev, P1V2 for prod)
   - PostgreSQL Flexible Server (Burstable B1ms for dev, General Purpose D2s_v3 for prod)
   - Storage Account (Standard LRS)
   - Key Vault for secrets
   - Application Insights
4. Create GitHub Actions workflows:
   - .github/workflows/ci.yml: Build, lint, type-check on PR
   - .github/workflows/deploy-dev.yml: Deploy to dev on push to develop branch
   - .github/workflows/deploy-prod.yml: Deploy to prod on push to main branch
5. Configure GitHub environments (dev, staging, prod) with protection rules
6. Add GitHub secrets: AZURE_CREDENTIALS, DATABASE_URL, NEXTAUTH_SECRET
7. Deploy infrastructure to Azure using Bicep
8. Create database schema in /scripts/db/schema.sql
```

**Success Criteria:**
- ✓ GitHub repo created and initialized
- ✓ Bicep deployment succeeds in Azure
- ✓ CI workflow runs on PR
- ✓ Dev environment accessible via Azure URL
- ✓ Database connection works

---

### Phase 1: Foundation & Design System (Week 1 - Days 3-5)

**Tasks:**
1. Configure Tailwind with Webflow design tokens
2. Extract CSS variables from al-hayaat.webflow.css
3. Set up shadcn/ui components
4. Create design token constants
5. Build base Button component (5 variants)
6. Build Typography components (h1-h6)
7. Set up database connection utility
8. Create initial SQL schema and migrations

**Deliverables:**
- Tailwind config with brand colors, fonts, spacing
- /lib/design-tokens.ts
- Button component with all variants
- Typography components
- Database schema deployed
- /lib/db/connection.ts and /lib/db/queries.ts

**Prompt for Phase 1:**
```
Extract design system from Webflow and set up database:

1. Analyze css/al-hayaat.webflow.css for:
   - Color palette (--brand--blue, --brand--yellow, etc.)
   - Typography (heading-style-h1 through h6, font families)
   - Spacing system (padding-global, padding-section-*)
   - Responsive breakpoints

2. Create tailwind.config.ts with:
   - Custom colors matching Webflow
   - Font families: Open Sans, Dongle, IBM Plex Sans
   - Breakpoints: mobile (479px), tablet (991px), desktop (1440px)
   - Container sizes: small (48rem), medium (64rem), large (80rem)

3. Build Button component (/components/ui/Button.tsx):
   - Variants: primary (blue bg, yellow shadow), secondary (green), outline, ghost, icon
   - Sizes: sm, md, lg
   - States: default, hover, active, disabled, loading
   - TypeScript props interface

4. Create database schema (/scripts/db/schema.sql):
   ```sql
   CREATE TABLE contact_submissions (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     phone VARCHAR(50),
     message TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   CREATE TABLE job_applications (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     position VARCHAR(255) NOT NULL,
     resume_url TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   CREATE TABLE newsletter_subscribers (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     subscribed_at TIMESTAMP DEFAULT NOW(),
     active BOOLEAN DEFAULT true
   );
   
   CREATE TABLE donations (
     id SERIAL PRIMARY KEY,
     amount DECIMAL(10,2) NOT NULL,
     donor_name VARCHAR(255),
     donor_email VARCHAR(255),
     stripe_session_id VARCHAR(255),
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     password_hash TEXT NOT NULL,
     role VARCHAR(50) DEFAULT 'admin',
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

5. Set up database connection with pg library
6. Create query helper functions in /lib/db/queries.ts
```

**Success Criteria:**
- ✓ Tailwind config matches Webflow design
- ✓ Button renders with all 5 variants
- ✓ Database schema deployed to Azure PostgreSQL
- ✓ Database connection works from Next.js

---

### Phase 2: Core Component Library (Week 2)

**Tasks:**
1. Build 7 layout components (Navigation, Footer, Container, Section, Grid, PageHeader, Layout)
2. Build 15 UI components (HeroSection, FeatureCard, WhyCard, CTASection, Card, Badge, Icon, Image, etc.)
3. Build 10 form components (Form, Input, Textarea, Select, Checkbox, Radio, FileUpload, etc.)
4. Create component documentation
5. Write unit tests for critical components

**Component Build Order:**
- Day 1: Layout components (1-7)
- Day 2: UI components (8-16)
- Day 3: Form components (17-26)
- Day 4: Data display components (27-32)
- Day 5: Feedback + animation components (33-39)

**Deliverables:**
- 39 reusable components in /components
- Component prop types in TypeScript
- Basic unit tests for form validation
- Component usage examples

**Prompt for Phase 2:**
```
Build reusable component library:

1. Navigation component (/components/layout/Navigation.tsx):
   - Sticky header with blur backdrop on scroll
   - Logo + horizontal menu + CTA button
   - Mobile: hamburger menu with slide-out drawer (shadcn/ui Sheet)
   - Props: links[], logoSrc, ctaButton, variant (transparent/solid/sticky)
   - Accessible: ARIA labels, keyboard navigation

2. HeroSection component (/components/ui/HeroSection.tsx):
   - Full-width hero with decorative backgrounds
   - Props: heading, subheading, cta, backgroundVariant (glitter/dashlines/solid)
   - Responsive text sizing (4rem desktop → 2.5rem mobile)
   - Support for background images from Webflow

3. Form components with react-hook-form + zod:
   - Input, Textarea, Select with error states
   - FileUpload with drag-drop (for resume uploads)
   - FormField wrapper with label + error display
   - SubmitButton with loading spinner
   - Client-side validation with error messages

4. Create /components/index.ts for clean imports
5. Add TypeScript interfaces for all component props
6. Write tests for form validation logic

Reference Webflow HTML structure from index.html for layout patterns.
```

**Success Criteria:**
- ✓ All 39 components built and typed
- ✓ Components render without errors
- ✓ Form validation works
- ✓ Mobile responsive
- ✓ Accessible (basic ARIA)

---

### Phase 3: Content Extraction & Static Pages (Week 3)

**Tasks:**
1. Extract content from Webflow HTML files to TypeScript constants
2. Build Home page (/app/page.tsx)
3. Build About page (/app/about/page.tsx)
4. Build School Plans page (/app/school-plans/page.tsx)
5. Build Curriculum page (/app/curriculum/page.tsx)
6. Add metadata and SEO for all pages
7. Optimize and migrate images

**Content Extraction:**
- /lib/content/home.ts - Home page content
- /lib/content/about.ts - About page content
- /lib/content/school-plans.ts - School plans content
- /lib/content/curriculum.ts - Curriculum content

**Deliverables:**
- 4 static pages matching Webflow design
- Content separated into constants
- Images optimized and migrated
- SEO metadata configured

**Prompt for Phase 3:**
```
Convert Webflow pages to Next.js:

1. Extract content from index.html to /lib/content/home.ts:
   - Hero heading, subheading, CTA text
   - Feature cards (icon, title, description)
   - Why Al-Hayaat cards
   - CTA section content
   - Export as typed constants

2. Build /app/page.tsx using components:
   - Import content from /lib/content/home.ts
   - Use HeroSection, Grid, FeatureCard, WhyCard, CTASection
   - Match Webflow layout (sections, spacing, colors)
   - Add metadata: title, description, Open Graph tags
   - Add JSON-LD structured data (School schema)

3. Optimize images:
   - Convert large PNGs to WebP
   - Generate responsive sizes (375px, 768px, 1440px)
   - Use Next.js Image component with proper sizes prop
   - Store in /public/images

4. Repeat for about.html, school-plans.html, academic-and-curriculum.html

5. Create /app/layout.tsx with Navigation and Footer
```

**Success Criteria:**
- ✓ 4 pages visually match Webflow
- ✓ Content is separated from components
- ✓ Images optimized (WebP format)
- ✓ Lighthouse score 90+ (initial)
- ✓ Mobile responsive at all breakpoints

---

### Phase 4: Interactive Pages & Database Integration (Week 4)

**Tasks:**
1. Build Contact page with form
2. Build Careers page with job listings
3. Build Donate page (without Stripe yet)
4. Build Application form page
5. Create database query functions
6. Build API routes for form submissions
7. Integrate email service (Resend)

**Deliverables:**
- 4 interactive pages with forms
- API routes: /api/contact, /api/jobs/apply, /api/newsletter/subscribe
- Database query functions in /lib/db/queries.ts
- Email integration working

**Prompt for Phase 4:**
```
Build interactive pages with database integration:

1. Contact page (/app/contact/page.tsx):
   - Form with fields: name, email, phone (optional), message
   - Client-side validation with zod schema
   - Submit to /api/contact
   - Loading state during submission
   - Success/error toast notifications
   - Honeypot field for spam prevention

2. API route /app/api/contact/route.ts:
   - Accept POST with validated data
   - Create query function in /lib/db/queries.ts:
     ```typescript
     export async function createContactSubmission(data: ContactData) {
       const query = `
         INSERT INTO contact_submissions (name, email, phone, message, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING id, created_at
       `;
       const result = await pool.query(query, [data.name, data.email, data.phone, data.message]);
       return result.rows[0];
     }
     ```
   - Send notification email to admin using Resend
   - Send confirmation email to user
   - Return success/error response
   - Add rate limiting (5 requests/hour per IP)

3. Job application page (/app/careers/page.tsx):
   - Job listings (hardcoded for now)
   - Application form: name, email, position, resume upload
   - Upload resume to Azure Blob Storage
   - Submit to /api/jobs/apply
   - Store resume URL in database

4. Create /lib/db/queries.ts with all query functions:
   - createContactSubmission
   - createJobApplication
   - createNewsletterSubscriber
   - createDonation
   - getAllContactSubmissions (for admin)
   - getAllJobApplications (for admin)

5. Set up Resend for emails:
   - Install resend package
   - Configure API key in Azure Key Vault
   - Create email templates in /lib/email/templates.ts
```

**Success Criteria:**
- ✓ All forms submit successfully
- ✓ Data saved to database
- ✓ Emails sent (admin notification + user confirmation)
- ✓ Resume uploads work
- ✓ Rate limiting prevents spam
- ✓ Error handling works

---

### Phase 5: Authentication & Admin Dashboard (Week 5)

**Tasks:**
1. Set up NextAuth.js with credentials provider
2. Create login page
3. Protect admin routes with middleware
4. Build admin dashboard layout
5. Build admin overview page (stats)
6. Build data tables for submissions
7. Implement CSV export

**Deliverables:**
- Admin authentication working
- Admin dashboard at /app/admin
- Data tables for contacts, applications, newsletter, donations
- CSV export functionality

**Prompt for Phase 5:**
```
Implement admin authentication and dashboard:

1. Set up NextAuth.js v4 (stable):
   - Install next-auth
   - Create /app/api/auth/[...nextauth]/route.ts
   - Configure Credentials provider
   - Hash passwords with bcrypt
   - Store sessions in database (custom adapter with raw SQL)
   - Create query functions for user authentication

2. Create login page (/app/login/page.tsx):
   - Email + password form
   - Client-side validation
   - Error messages for invalid credentials
   - Redirect to /admin on success

3. Protect admin routes with middleware.ts:
   - Check session for /admin/* routes
   - Redirect to /login if not authenticated
   - Allow public routes

4. Build admin dashboard (/app/admin/page.tsx):
   - Overview cards: Total contacts, applications, subscribers, donation amount
   - Use DataCard component
   - Fetch counts with SQL queries:
     ```typescript
     export async function getAdminStats() {
       const query = `
         SELECT 
           (SELECT COUNT(*) FROM contact_submissions) as contacts,
           (SELECT COUNT(*) FROM job_applications) as applications,
           (SELECT COUNT(*) FROM newsletter_subscribers WHERE active = true) as subscribers,
           (SELECT COALESCE(SUM(amount), 0) FROM donations) as total_donations
       `;
       const result = await pool.query(query);
       return result.rows[0];
     }
     ```

5. Build data tables (/app/admin/contacts/page.tsx):
   - Use shadcn/ui Table component
   - Columns: Name, Email, Phone, Message (truncated), Date
   - Pagination (10 per page)
   - Search by name/email
   - Click row to view full message in modal
   - Export to CSV button

6. Similar pages for applications, newsletter, donations

7. Create initial admin user in seed script:
   ```sql
   INSERT INTO users (email, password_hash, role)
   VALUES ('admin@alhayaat.ca', '$2b$10$...', 'admin');
   ```
```

**Success Criteria:**
- ✓ Login works with valid credentials
- ✓ Protected routes redirect to login
- ✓ Admin dashboard displays stats
- ✓ Data tables show submissions
- ✓ Pagination works
- ✓ CSV export works
- ✓ Session persists across refreshes

---

### Phase 6: Stripe Integration (Week 6)

**Tasks:**
1. Set up Stripe account (test + production)
2. Build donation form with amount selection
3. Implement Stripe Checkout session
4. Create webhook handler for payment confirmation
5. Store donation records in database
6. Send thank-you emails with tax receipts
7. Generate PDF tax receipts

**Deliverables:**
- Donation flow working end-to-end
- Stripe webhooks handling payments
- Tax receipt PDF generation
- Donation records in admin dashboard

**Prompt for Phase 6:**
```
Implement Stripe donation flow:

1. Install Stripe packages:
   - @stripe/stripe-js (client)
   - stripe (server SDK)

2. Build donation page (/app/donate/page.tsx):
   - Amount selection: preset ($25, $50, $100, $250) + custom input
   - Donor information form: name, email, address (for tax receipt)
   - Payment button → creates Stripe Checkout session
   - Loading state during redirect

3. Create API route /app/api/stripe/checkout-session/route.ts:
   - Accept POST with amount and donor info
   - Create Stripe Checkout Session:
     ```typescript
     const session = await stripe.checkout.sessions.create({
       payment_method_types: ['card'],
       line_items: [{
         price_data: {
           currency: 'cad',
           product_data: { name: 'Donation to Al-Hayaat School' },
           unit_amount: amount * 100,
         },
         quantity: 1,
       }],
       mode: 'payment',
       success_url: `${process.env.NEXT_PUBLIC_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
       cancel_url: `${process.env.NEXT_PUBLIC_URL}/donate`,
       metadata: { donorName, donorEmail, donorAddress },
     });
     ```
   - Return session URL for redirect

4. Create webhook /app/api/stripe/webhook/route.ts:
   - Verify Stripe signature
   - Handle checkout.session.completed event
   - Save donation to database:
     ```typescript
     export async function createDonation(data: DonationData) {
       const query = `
         INSERT INTO donations (amount, donor_name, donor_email, stripe_session_id, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING id
       `;
       const result = await pool.query(query, [data.amount, data.donorName, data.donorEmail, data.sessionId]);
       return result.rows[0];
     }
     ```
   - Generate PDF tax receipt using @react-pdf/renderer
   - Send thank-you email with receipt attached (Resend)

5. Create success page (/app/donate/success/page.tsx):
   - Thank you message
   - Donation confirmation
   - Receipt download link

6. Configure Stripe webhook in Azure:
   - Add webhook endpoint URL to Stripe dashboard
   - Store webhook secret in Azure Key Vault
   - Test with Stripe CLI locally

7. Add Stripe keys to Azure Key Vault:
   - STRIPE_PUBLISHABLE_KEY
   - STRIPE_SECRET_KEY
   - STRIPE_WEBHOOK_SECRET
```

**Success Criteria:**
- ✓ Checkout session opens
- ✓ Test payments succeed
- ✓ Webhook captures payments
- ✓ Donation records saved to database
- ✓ Thank-you email sent with PDF receipt
- ✓ Donations visible in admin dashboard

---

### Phase 7: Polish & Optimization (Week 7)

**Tasks:**
1. Add Framer Motion animations
2. Optimize images and fonts
3. Implement lazy loading
4. Add metadata and structured data
5. Create sitemap and robots.txt
6. Optimize for Lighthouse 95+
7. Add error boundaries
8. Implement loading states

**Deliverables:**
- Smooth animations throughout site
- Lighthouse score 95+ on all metrics
- SEO optimized
- Error handling robust

**Prompt for Phase 7:**
```
Polish and optimize for production:

1. Add Framer Motion animations:
   - Install framer-motion
   - Create FadeIn component with IntersectionObserver
   - Wrap sections: Hero, Features, Cards, CTA
   - Add button hover animations (scale 1.02, shadow lift)
   - Mobile menu slide-in animation
   - Keep animations subtle (0.3-0.5s, ease-out)
   - Respect prefers-reduced-motion

2. Image optimization:
   - Replace all <img> with Next.js Image component
   - Add proper sizes prop for responsive images
   - Use priority for above-fold images
   - Lazy load below-fold images
   - Ensure all images have alt text

3. Font optimization:
   - Use next/font/google for Open Sans, Dongle
   - Preload critical fonts
   - Add font-display: swap

4. SEO optimization:
   - Add metadata to all pages (title, description, keywords)
   - Add Open Graph tags (og:title, og:description, og:image)
   - Add Twitter cards
   - Create /app/sitemap.ts (dynamic sitemap)
   - Create /app/robots.ts
   - Add JSON-LD structured data:
     - Home: School schema
     - Careers: JobPosting schema
     - Contact: LocalBusiness schema

5. Performance optimization:
   - Code splitting with dynamic imports for heavy components
   - Lazy load non-critical components
   - Add loading.tsx for route segments
   - Add error.tsx for error boundaries
   - Optimize bundle size (analyze with @next/bundle-analyzer)

6. Run Lighthouse audit and fix issues:
   - Target: Performance 95+, Accessibility 100, SEO 100
   - Fix any console errors
   - Optimize Cumulative Layout Shift (CLS)
   - Improve First Contentful Paint (FCP)
```

**Success Criteria:**
- ✓ Lighthouse Performance 95+
- ✓ Lighthouse Accessibility 100
- ✓ Lighthouse SEO 100
- ✓ Animations smooth (60fps)
- ✓ No console errors
- ✓ Sitemap accessible at /sitemap.xml
- ✓ All images optimized

---

### Phase 8: Testing & Deployment (Week 8)

**Tasks:**
1. Write unit tests for utilities and queries
2. Write component tests
3. Write API route tests
4. E2E testing with Playwright
5. Cross-browser testing
6. Accessibility audit
7. Deploy to staging
8. Deploy to production
9. Configure custom domain and SSL

**Deliverables:**
- Comprehensive test suite
- Staging environment deployed
- Production environment deployed
- Custom domain configured
- Monitoring active

**Prompt for Phase 8:**
```
Testing and production deployment:

1. Unit tests (Vitest):
   - Test utility functions in /lib
   - Test database query functions (mock pg pool)
   - Test validation schemas (zod)
   - Target: 80%+ coverage for critical paths

2. Component tests (React Testing Library):
   - Test Button variants and states
   - Test Form components (validation, error states)
   - Test Navigation (mobile menu toggle)
   - Test accessibility (ARIA attributes)

3. API route tests:
   - Mock database queries
   - Test validation (invalid inputs return 400)
   - Test success responses
   - Test rate limiting
   - Test authentication middleware

4. E2E tests (Playwright):
   - Test contact form submission flow
   - Test donation flow (use Stripe test mode)
   - Test admin login and dashboard access
   - Test mobile responsive behavior

5. Cross-browser testing:
   - Chrome, Safari, Firefox, Edge
   - iOS Safari, Android Chrome
   - Test at breakpoints: 375px, 768px, 1440px

6. Accessibility audit:
   - Run Axe DevTools
   - Test with screen reader (NVDA/JAWS)
   - Keyboard navigation test
   - Color contrast check
   - Fix all critical issues

7. Deploy to staging:
   - Push to develop branch
   - GitHub Actions deploys to Azure staging environment
   - Run smoke tests
   - Verify database connection
   - Test email sending
   - Test Stripe webhooks

8. Deploy to production:
   - Merge develop to main
   - GitHub Actions deploys to Azure production
   - Run final smoke tests
   - Monitor Application Insights for errors

9. Configure custom domain:
   - Add custom domain in Azure App Service
   - Configure DNS records (A record or CNAME)
   - Enable SSL certificate (Azure managed certificate)
   - Force HTTPS redirect
   - Test domain access
```

**Success Criteria:**
- ✓ 80%+ test coverage
- ✓ All tests pass
- ✓ No critical accessibility issues
- ✓ Cross-browser compatible
- ✓ Staging deployment successful
- ✓ Production deployment successful
- ✓ Custom domain working with SSL
- ✓ Monitoring active (Application Insights)

---

## GitHub Actions Workflows

### CI Workflow (.github/workflows/ci.yml)
```yaml
name: CI

on:
  pull_request:
    branches: [develop, main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build
```

### Deploy to Dev (.github/workflows/deploy-dev.yml)
```yaml
name: Deploy to Dev

on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: dev
    steps:
      - uses: actions/checkout@v4
      - uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: azure/webapps-deploy@v2
        with:
          app-name: al-hayaat-dev
          package: .
```

### Deploy to Production (.github/workflows/deploy-prod.yml)
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: azure/webapps-deploy@v2
        with:
          app-name: al-hayaat-prod
          package: .
```

---

## Azure Bicep Infrastructure

### Main Bicep File (infrastructure/main.bicep)
```bicep
param location string = resourceGroup().location
param environment string = 'dev'
param appName string = 'al-hayaat'

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: '${appName}-plan-${environment}'
  location: location
  sku: {
    name: environment == 'prod' ? 'P1V2' : 'B1'
    tier: environment == 'prod' ? 'PremiumV2' : 'Basic'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// App Service
resource appService 'Microsoft.Web/sites@2022-03-01' = {
  name: '${appName}-${environment}'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      appSettings: [
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'DATABASE_URL'
          value: '@Microsoft.KeyVault(SecretUri=${keyVault.properties.vaultUri}secrets/DATABASE-URL/)'
        }
        {
          name: 'NEXTAUTH_SECRET'
          value: '@Microsoft.KeyVault(SecretUri=${keyVault.properties.vaultUri}secrets/NEXTAUTH-SECRET/)'
        }
        {
          name: 'STRIPE_SECRET_KEY'
          value: '@Microsoft.KeyVault(SecretUri=${keyVault.properties.vaultUri}secrets/STRIPE-SECRET-KEY/)'
        }
      ]
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      http20Enabled: true
    }
    httpsOnly: true
  }
}

// PostgreSQL Flexible Server
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2022-12-01' = {
  name: '${appName}-db-${environment}'
  location: location
  sku: {
    name: environment == 'prod' ? 'Standard_D2s_v3' : 'Standard_B1ms'
    tier: environment == 'prod' ? 'GeneralPurpose' : 'Burstable'
  }
  properties: {
    version: '15'
    administratorLogin: 'dbadmin'
    administratorLoginPassword: 'REPLACE_WITH_SECURE_PASSWORD'
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: environment == 'prod' ? 'Enabled' : 'Disabled'
    }
  }
}

// PostgreSQL Database
resource postgresDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2022-12-01' = {
  parent: postgresServer
  name: 'alhayaat'
}

// Storage Account (for resume uploads)
resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: '${appName}storage${environment}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
  }
}

// Blob Container for resumes
resource blobContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2022-09-01' = {
  name: '${storageAccount.name}/default/resumes'
  properties: {
    publicAccess: 'None'
  }
}

// Key Vault
resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: '${appName}-kv-${environment}'
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    accessPolicies: [
      {
        tenantId: subscription().tenantId
        objectId: appService.identity.principalId
        permissions: {
          secrets: ['get', 'list']
        }
      }
    ]
  }
}

// Application Insights
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${appName}-insights-${environment}'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    RetentionInDays: 90
  }
}

output appServiceUrl string = 'https://${appService.properties.defaultHostName}'
output databaseHost string = postgresServer.properties.fullyQualifiedDomainName
output storageAccountName string = storageAccount.name
```

### Deployment Commands
```bash
# Create resource group
az group create --name rg-al-hayaat-dev --location canadacentral

# Deploy infrastructure
az deployment group create \
  --resource-group rg-al-hayaat-dev \
  --template-file infrastructure/main.bicep \
  --parameters environment=dev

# For production
az deployment group create \
  --resource-group rg-al-hayaat-prod \
  --template-file infrastructure/main.bicep \
  --parameters environment=prod
```

---

## Database Schema (scripts/db/schema.sql)

```sql
-- Contact Submissions
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_created_at (created_at DESC)
);

-- Job Applications
CREATE TABLE job_applications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  resume_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_created_at (created_at DESC)
);

-- Newsletter Subscribers
CREATE TABLE newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT true,
  INDEX idx_email (email),
  INDEX idx_active (active)
);

-- Donations
CREATE TABLE donations (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  donor_name VARCHAR(255),
  donor_email VARCHAR(255),
  donor_address TEXT,
  stripe_session_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_created_at (created_at DESC),
  INDEX idx_stripe_session (stripe_session_id)
);

-- Users (for admin authentication)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_email (email)
);

-- Sessions (for NextAuth)
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_session_token (session_token),
  INDEX idx_user_id (user_id)
);
```

---

## Project Structure

```
al-hayaat-nextjs/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy-dev.yml
│       ├── deploy-staging.yml
│       └── deploy-prod.yml
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # Home
│   │   ├── about/page.tsx              # About
│   │   ├── school-plans/page.tsx       # School Plans
│   │   ├── curriculum/page.tsx         # Curriculum
│   │   ├── contact/page.tsx            # Contact
│   │   ├── careers/page.tsx            # Careers
│   │   ├── donate/
│   │   │   ├── page.tsx                # Donate form
│   │   │   └── success/page.tsx        # Thank you
│   │   └── application/page.tsx        # Application form
│   ├── admin/
│   │   ├── layout.tsx                  # Admin layout
│   │   ├── page.tsx                    # Dashboard overview
│   │   ├── contacts/page.tsx           # Contact submissions
│   │   ├── applications/page.tsx       # Job applications
│   │   ├── newsletter/page.tsx         # Newsletter subscribers
│   │   └── donations/page.tsx          # Donations
│   ├── login/page.tsx                  # Admin login
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts # NextAuth
│   │   ├── contact/route.ts            # Contact form API
│   │   ├── jobs/apply/route.ts         # Job application API
│   │   ├── newsletter/subscribe/route.ts
│   │   └── stripe/
│   │       ├── checkout-session/route.ts
│   │       └── webhook/route.ts
│   ├── layout.tsx                      # Root layout
│   ├── sitemap.ts                      # Dynamic sitemap
│   └── robots.ts                       # Robots.txt
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx              # Header navigation
│   │   ├── Footer.tsx                  # Footer
│   │   ├── Container.tsx               # Content wrapper
│   │   ├── Section.tsx                 # Section wrapper
│   │   ├── Grid.tsx                    # Grid layout
│   │   ├── PageHeader.tsx              # Page header
│   │   └── Layout.tsx                  # Layout wrapper
│   ├── ui/
│   │   ├── Button.tsx                  # Button component
│   │   ├── HeroSection.tsx             # Hero banner
│   │   ├── FeatureCard.tsx             # Feature card
│   │   ├── WhyCard.tsx                 # Why card
│   │   ├── CTASection.tsx              # CTA block
│   │   ├── Card.tsx                    # Generic card
│   │   ├── Badge.tsx                   # Badge
│   │   ├── Icon.tsx                    # Icon wrapper
│   │   ├── Image.tsx                   # Image component
│   │   ├── Table.tsx                   # Data table
│   │   ├── DataCard.tsx                # Stat card
│   │   ├── EmptyState.tsx              # Empty state
│   │   ├── LoadingSpinner.tsx          # Loading spinner
│   │   ├── Skeleton.tsx                # Skeleton loader
│   │   ├── Pagination.tsx              # Pagination
│   │   ├── Toast.tsx                   # Toast notification
│   │   ├── Alert.tsx                   # Alert message
│   │   ├── Modal.tsx                   # Modal dialog
│   │   └── ConfirmDialog.tsx           # Confirm dialog
│   ├── forms/
│   │   ├── Form.tsx                    # Form wrapper
│   │   ├── Input.tsx                   # Text input
│   │   ├── Textarea.tsx                # Textarea
│   │   ├── Select.tsx                  # Select dropdown
│   │   ├── Checkbox.tsx                # Checkbox
│   │   ├── Radio.tsx                   # Radio button
│   │   ├── RadioGroup.tsx              # Radio group
│   │   ├── FileUpload.tsx              # File upload
│   │   ├── FormField.tsx               # Field wrapper
│   │   └── SubmitButton.tsx            # Submit button
│   ├── animations/
│   │   ├── FadeIn.tsx                  # Fade in animation
│   │   ├── SlideIn.tsx                 # Slide in animation
│   │   └── AnimatedCounter.tsx         # Counter animation
│   └── index.ts                        # Component exports
├── lib/
│   ├── db/
│   │   ├── connection.ts               # Database connection
│   │   └── queries.ts                  # SQL query functions
│   ├── content/
│   │   ├── home.ts                     # Home page content
│   │   ├── about.ts                    # About page content
│   │   ├── school-plans.ts             # School plans content
│   │   └── curriculum.ts               # Curriculum content
│   ├── email/
│   │   ├── client.ts                   # Resend client
│   │   └── templates.ts                # Email templates
│   ├── storage/
│   │   └── azure-blob.ts               # Azure Blob Storage client
│   ├── utils/
│   │   ├── validation.ts               # Zod schemas
│   │   ├── rate-limit.ts               # Rate limiting
│   │   └── helpers.ts                  # Helper functions
│   ├── design-tokens.ts                # Design system tokens
│   └── types.ts                        # TypeScript types
├── infrastructure/
│   ├── main.bicep                      # Main Bicep file
│   ├── modules/
│   │   ├── app-service.bicep
│   │   ├── database.bicep
│   │   ├── storage.bicep
│   │   └── keyvault.bicep
│   └── parameters/
│       ├── dev.json
│       ├── staging.json
│       └── prod.json
├── scripts/
│   └── db/
│       ├── schema.sql                  # Database schema
│       ├── seed.sql                    # Seed data
│       └── migrations/                 # Migration scripts
├── public/
│   ├── images/                         # Optimized images
│   └── fonts/                          # Custom fonts
├── tests/
│   ├── unit/                           # Unit tests
│   ├── integration/                    # Integration tests
│   └── e2e/                            # E2E tests
├── .env.local                          # Local environment variables
├── .env.example                        # Example env file
├── next.config.js                      # Next.js config
├── tailwind.config.ts                  # Tailwind config
├── tsconfig.json                       # TypeScript config
├── package.json
└── README.md
```

---

## Environment Variables

### Required Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key-here

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend)
RESEND_API_KEY=re_...
ADMIN_EMAIL=admin@alhayaat.ca

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
AZURE_STORAGE_CONTAINER_NAME=resumes

# Application Insights
APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=...

# App
NEXT_PUBLIC_URL=https://yourdomain.com
NODE_ENV=production
```

---

## Success Metrics

### Technical Metrics
- ✓ Lighthouse Performance: 95+
- ✓ Lighthouse Accessibility: 100
- ✓ Lighthouse SEO: 100
- ✓ Test Coverage: 80%+
- ✓ Build Time: <2 minutes
- ✓ First Contentful Paint: <1.5s
- ✓ Time to Interactive: <3.5s
- ✓ Bundle Size: <300KB (gzipped)

### Functional Metrics
- ✓ All 10 pages migrated and functional
- ✓ Contact form working (email + database)
- ✓ Job application form working (with resume upload)
- ✓ Newsletter signup working
- ✓ Donation payments working (Stripe)
- ✓ Admin dashboard functional
- ✓ Authentication working
- ✓ Mobile responsive (375px, 768px, 1440px)
- ✓ Cross-browser compatible

### Quality Metrics
- ✓ Zero critical accessibility issues
- ✓ No console errors in production
- ✓ All images optimized (WebP)
- ✓ All forms validated
- ✓ Security headers configured
- ✓ HTTPS enforced
- ✓ Rate limiting active
- ✓ Error monitoring active

---

## Risk Management

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Azure Bicep deployment failures** | High | Test Bicep files locally with `az deployment group validate`, use incremental deployment mode |
| **Database migration issues** | High | Test migrations in dev environment first, maintain rollback scripts, backup before production migration |
| **Stripe webhook reliability** | High | Implement retry logic, log all webhook events, use Stripe CLI for local testing |
| **Raw SQL injection vulnerabilities** | Critical | Always use parameterized queries ($1, $2), validate all inputs with Zod, never concatenate user input |
| **Performance issues on mobile** | Medium | Regular Lighthouse audits, image optimization priority, lazy loading |
| **Email deliverability** | Medium | Configure SPF/DKIM records, use Resend (high deliverability), test with real email addresses |
| **Resume upload security** | High | Validate file types, scan for malware, use Azure Blob Storage with private access, generate signed URLs |
| **GitHub Actions deployment failures** | Medium | Add manual approval for production, implement health checks, maintain rollback workflow |
| **Cross-browser compatibility** | Low | Test early and often, use CSS autoprefixer, avoid experimental features |
| **Rate limiting bypass** | Medium | Implement IP-based rate limiting, use Azure API Management for advanced protection |

---

## Timeline Summary

| Week | Phase | Key Deliverables |
|------|-------|------------------|
| 1 | Phase 0-1 | GitHub repo, Azure infrastructure, design system, database schema |
| 2 | Phase 2 | 39 reusable components built and tested |
| 3 | Phase 3 | 4 static pages migrated, content extracted, images optimized |
| 4 | Phase 4 | 4 interactive pages, API routes, database integration, email service |
| 5 | Phase 5 | Authentication, admin dashboard, data tables |
| 6 | Phase 6 | Stripe integration, donation flow, tax receipts |
| 7 | Phase 7 | Animations, SEO optimization, Lighthouse 95+ |
| 8 | Phase 8 | Testing, staging deployment, production deployment |

---

## Key Differences from Original Plan

### What Changed:
1. **Database**: Prisma → Raw SQL with pg library
   - More control, better performance, smaller bundle
   - Centralized query functions in /lib/db/queries.ts
   - Manual migration management

2. **Deployment**: AWS/Generic Cloud → Azure with Bicep IaC
   - Azure App Service for hosting
   - Azure Database for PostgreSQL
   - Azure Blob Storage for file uploads
   - Azure Key Vault for secrets
   - Infrastructure as Code with Bicep

3. **CI/CD**: Manual → GitHub Actions
   - Automated testing on PR
   - Automated deployment on push
   - Environment-specific workflows
   - Manual approval for production

4. **Component Architecture**: Ad-hoc → 39 Defined Reusable Components
   - Clear component library structure
   - Organized by category (layout, ui, forms, animations)
   - Consistent prop interfaces
   - Reusable across all pages

5. **Repository**: Existing → New GitHub Repository
   - Fresh start with clean history
   - Proper .gitignore and branch strategy
   - GitHub environments configured
   - Secrets management via GitHub

### What Stayed the Same:
- Next.js 15 with App Router
- TypeScript strict mode
- Tailwind CSS + shadcn/ui
- NextAuth.js for authentication
- Stripe for payments
- Resend for emails
- 6-8 week timeline
- Same page migration scope

---

## Next Steps

### Immediate Actions:
1. **Review this plan** - Confirm approach and timeline
2. **Set up Azure account** - Ensure subscription and permissions
3. **Create GitHub repository** - Initialize with proper structure
4. **Configure Azure credentials** - Set up service principal for GitHub Actions
5. **Start Phase 0** - Deploy infrastructure and initialize project

### Questions to Answer:
1. **Azure subscription** - Which subscription should we use?
2. **Domain name** - What domain will be used? (for SSL and DNS)
3. **Admin email** - What email should receive notifications?
4. **Stripe account** - Test account ready? Production account details?
5. **Budget** - Estimated Azure costs: $50-100/month (dev + prod)

### Ready to Start?
Would you like me to:
1. **Start Phase 0** - Create GitHub repo and deploy Azure infrastructure
2. **Generate Bicep files** - Create complete infrastructure code
3. **Set up GitHub Actions** - Create all workflow files
4. **Initialize Next.js project** - Set up project structure locally
5. **Create component templates** - Generate boilerplate for all 39 components

---

## Appendix: Component Prop Interfaces

### Example Component Interfaces
```typescript
// Button Component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

// HeroSection Component
interface HeroSectionProps {
  heading: string;
  subheading?: string;
  cta?: {
    text: string;
    href: string;
  };
  backgroundVariant?: 'glitter' | 'dashlines' | 'solid' | 'image';
  backgroundImage?: string;
}

// FeatureCard Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: {
    text: string;
    href: string;
  };
}

// Form Component
interface FormProps<T extends FieldValues> {
  onSubmit: (data: T) => Promise<void>;
  schema: ZodSchema<T>;
  children: React.ReactNode;
  className?: string;
}

// Navigation Component
interface NavigationProps {
  links: Array<{
    label: string;
    href: string;
  }>;
  logoSrc: string;
  ctaButton?: {
    text: string;
    href: string;
  };
  variant?: 'transparent' | 'solid' | 'sticky';
}
```

---

## Documentation

### README.md Structure
```markdown
# Al-Hayaat School Website

Modern Next.js website for Al-Hayaat School with full backend functionality.

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- PostgreSQL (raw SQL)
- NextAuth.js
- Stripe
- Azure (App Service, Database, Storage)

## Getting Started
1. Clone repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Set up database: `npm run db:setup`
5. Run development server: `npm run dev`

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler
- `npm run test` - Run tests
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database

## Deployment
Automated via GitHub Actions:
- Push to `develop` → Deploy to dev environment
- Push to `main` → Deploy to production

## Project Structure
See REVISED-MIGRATION-PLAN.md for detailed structure.
```

---

**End of Revised Migration Plan**

This plan is ready for execution. All phases are detailed with specific prompts, success criteria, and deliverables. The component library is fully defined with 39 reusable components, Azure infrastructure is specified with Bicep, and GitHub Actions workflows are ready to implement.
