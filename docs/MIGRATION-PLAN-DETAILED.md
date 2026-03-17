Here's the content of /memories/session/plan.md with line numbers:
     1	# Migration Plan: Webflow to React TypeScript (Next.js App Router)
     2	
     3	## Executive Summary
     4	
     5	Migrate Al-Hayaat School website from Webflow to a modern React TypeScript application using Next.js 15+ App Router, Tailwind CSS, with comprehensive backend functionality (forms, donations, authentication). Content will remain hardcoded initially, with architecture ready for future CMS integration.
     6	
     7	**Timeline Estimate**: 6-8 weeks (balanced quality approach)  
     8	**Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Prisma + PostgreSQL, NextAuth.js, Stripe  
     9	**Deployment**: AWS/Azure/GCP with Docker containerization
    10	
    11	---
    12	
    13	## Phase 1: Foundation & Setup (Week 1)
    14	
    15	### 1.1 Project Initialization & Configuration
    16	**Goal**: Set up development environment with TypeScript, ESLint, Prettier, and testing infrastructure.
    17	
    18	**Tasks**:
    19	1. Initialize Next.js 15 project with App Router
    20	2. Configure TypeScript (strict mode)
    21	3. Set up Tailwind CSS with custom theme
    22	4. Install shadcn/ui component library
    23	5. Configure ESLint + Prettier + Husky pre-commit hooks
    24	6. Set up testing framework (Vitest + React Testing Library)
    25	7. Configure environment variables structure (.env.local, .env.production)
    26	8. Initialize Git repository with proper .gitignore
    27	
    28	**Prompt for AI Agent**:
    29	```
    30	Create a Next.js 15 TypeScript project with:
    31	- App Router architecture
    32	- Tailwind CSS with custom config supporting CSS variables for theming
    33	- shadcn/ui initialization
    34	- ESLint config extending next/core-web-vitals + TypeScript strict rules
    35	- Prettier with 2-space indent, single quotes, trailing commas
    36	- Husky pre-commit hook running lint-staged
    37	- Vitest + React Testing Library setup
    38	- Directory structure:
    39	  /app - Next.js app router
    40	  /components - Reusable components
    41	  /lib - Utilities, types, constants
    42	  /public - Static assets
    43	  /styles - Global styles
    44	  /hooks - Custom React hooks
    45	  /types - TypeScript type definitions
    46	  /services - API services
    47	  /config - Configuration files
    48	```
    49	
    50	**Success Criteria**:
    51	- ✓ `npm run dev` starts development server
    52	- ✓ `npm run lint` passes with no errors
    53	- ✓ `npm run type-check` confirms TypeScript compilation
    54	- ✓ Pre-commit hooks block commits with errors
    55	
    56	**Verification Command**: `npm run build && npm run lint && npm run type-check`
    57	
    58	---
    59	
    60	### 1.2 Design System Migration
    61	**Goal**: Extract and replicate Webflow's design system in Tailwind.
    62	
    63	**Tasks**:
    64	1. Extract CSS custom properties from `al-hayaat.webflow.css`
    65	2. Configure Tailwind theme with brand colors
    66	3. Create typography utilities matching Webflow styles
    67	4. Set up responsive breakpoints (mobile: 479px, tablet: 991px)
    68	5. Build spacing/padding utility classes
    69	6. Create button component variants (primary, secondary, icon, text)
    70	7. Document design tokens in `/lib/design-tokens.ts`
    71	
    72	**Prompt for AI Agent**:
    73	```
    74	Extract design system from Webflow CSS at c:\Users\mohdr\projects\webflow\al-hayaat.webflow\css\al-hayaat.webflow.css:
    75	
    76	1. Map CSS custom properties to Tailwind config:
    77	   - Color palette (--brand--blue, --brand--yellow, etc.)
    78	   - Typography scale (heading-style-h1 through h6)
    79	   - Spacing system (padding-global, padding-section-*)
    80	   
    81	2. Create tailwind.config.ts with:
    82	   - Custom colors matching brand palette
    83	   - Font families (Open Sans, Dongle, IBM Plex Sans, etc.)
    84	   - Responsive breakpoints (mobile, tablet, desktop)
    85	   - Container sizes (small: 48rem, medium: 64rem, large: 80rem)
    86	
    87	3. Build base Button component with variants:
    88	   - Primary (blue bg, yellow shadow, hover transform)
    89	   - Secondary (green bg)
    90	   - Icon (with leading/trailing icon support)
    91	   - Text (transparent)
    92	   - Size variants (small, regular, large)
    93	
    94	4. Create Typography component for headings h1-h6 matching Webflow styles
    95	```
    96	
    97	**Success Criteria**:
    98	- ✓ Tailwind config has all brand colors
    99	- ✓ Button component has 5 visual variants
   100	- ✓ Typography matches Webflow pixel-perfect
   101	
   102	**Dependencies**: Phase 1.1 complete
   103	
   104	---
   105	
   106	## Phase 2: Component Development (Weeks 2-3)
   107	
   108	### 2.1 Core Layout Components
   109	**Goal**: Build reusable layout components (Header, Footer, Container).
   110	
   111	**Tasks**:
   112	1. Build Navigation component with:
   113	   - Desktop menu (horizontal)
   114	   - Mobile hamburger menu (slide-out drawer)
   115	   - Sticky behavior on scroll
   116	   - Active link highlighting
   117	2. Build Footer component with social links, contact info
   118	3. Create Container component (small/medium/large variants)
   119	4. Build Section wrapper component with padding variants
   120	5. Implement mobile menu animations (Framer Motion)
   121	
   122	**Prompt for AI Agent**:
   123	```
   124	Build Navigation component based on Webflow structure at index.html:
   125	
   126	Requirements:
   127	- Sticky header with blur backdrop on scroll
   128	- Logo (left) + menu links (center) + donate CTA (right)
   129	- Mobile: Hamburger menu opens slide-out drawer from right
   130	- Navigation links: About, School Plan, Curriculum, Careers, Donate, Contact
   131	- Use shadcn/ui Sheet component for mobile drawer
   132	- Animate hamburger icon (3 lines → X) with Framer Motion
   133	- TypeScript types for navigation items
   134	- Accessible (ARIA labels, keyboard navigation)
   135	
   136	Reference HTML structure from lines 1-100 of index.html for exact layout.
   137	```
   138	
   139	**Success Criteria**:
   140	- ✓ Header sticky behavior working
   141	- ✓ Mobile menu slides in/out smoothly
   142	- ✓ Active link indicator works
   143	- ✓ Passes accessibility audit (Axe DevTools)
   144	
   145	**Dependencies**: Phase 1.2 complete
   146	
   147	---
   148	
   149	### 2.2 Reusable UI Components
   150	**Goal**: Build atomic components used across multiple pages.
   151	
   152	**Tasks**:
   153	1. HeroSection component (with background variants)
   154	2. FeatureCard component (icon + heading + description)
   155	3. WhyCard component (larger cards with decorative elements)
   156	4. CTASection component (call-to-action blocks)
   157	5. ImageWithSrcSet component (responsive images)
   158	6. Icon component (wrapper for SVG icons)
   159	7. Form components (Input, Textarea, Checkbox, Radio, Select)
   160	
   161	**Prompt for AI Agent**:
   162	```
   163	Create component library based on Webflow patterns:
   164	
   165	1. HeroSection: Full-width hero with decorative background
   166	   - Props: heading, subheading, ctaText, ctaLink, backgroundVariant
   167	   - Supports glitter-bg, dashlines, solid color backgrounds
   168	   - Responsive text sizing (4rem desktop → 2.5rem mobile)
   169	
   170	2. FeatureCard: Icon + content card
   171	   - Props: icon (ReactNode), title, description
   172	   - Used in grid layouts (2-4 columns)
   173	   - Hover effect: subtle lift + shadow
   174	
   175	3. Form components with shadcn/ui:
   176	   - Use react-hook-form for validation
   177	   - Error states with messages
   178	   - Loading states
   179	   - Accessible labels + ARIA
   180	
   181	Reference component patterns in index.html, about.html for structure.
   182	```
   183	
   184	**Success Criteria**:
   185	- ✓ 7+ reusable components built
   186	- ✓ All components have TypeScript prop types
   187	- ✓ Storybook stories created for each
   188	- ✓ Unit tests pass
   189	
   190	**Dependencies**: Phase 2.1 complete
   191	
   192	---
   193	
   194	## Phase 3: Page Development (Weeks 3-4)
   195	
   196	### 3.1 Static Pages (Home, About, Info Pages)
   197	**Goal**: Convert Webflow HTML pages to Next.js page components.
   198	
   199	**Tasks**:
   200	1. Home page (`/app/page.tsx`) - Hero, features, why-choose section
   201	2. About page (`/app/about/page.tsx`) - Team, mission, values
   202	3. School Plans page (`/app/school-plans/page.tsx`) - Timeline, roadmap
   203	4. Academic/Curriculum page (`/app/curriculum/page.tsx`) - Subjects, standards
   204	
   205	**Prompt for AI Agent**:
   206	```
   207	Convert index.html to Next.js home page:
   208	
   209	1. Analyze HTML structure in index.html
   210	2. Identify sections: Hero, Feature Grid, Why Al-Hayaat Cards, CTA
   211	3. Build /app/page.tsx using components from Phase 2.2
   212	4. Extract content to constants (headings, descriptions) in /lib/content/home.ts
   213	5. Implement responsive layouts matching Webflow (grid changes at breakpoints)
   214	6. Add metadata for SEO (title, description, Open Graph)
   215	7. Optimize images (use Next.js Image component)
   216	8. Add JSON-LD structured data for School schema
   217	
   218	Reference design from index.html, preserve exact copy and visual hierarchy.
   219	```
   220	
   221	**Success Criteria**:
   222	- ✓ 4 pages visually match Webflow
   223	- ✓ Lighthouse score 90+ (Performance, Accessibility, SEO)
   224	- ✓ Mobile responsive (test at 375px, 768px, 1440px)
   225	- ✓ Content separated from components
   226	
   227	**Dependencies**: Phase 2.2 complete
   228	
   229	---
   230	
   231	### 3.2 Interactive Pages (Contact, Careers, Donate)
   232	**Goal**: Build pages with forms and dynamic interactions.
   233	
   234	**Tasks**:
   235	1. Contact page with contact form
   236	2. Careers page with job listings
   237	3. Donate page with donation options
   238	4. Application form page
   239	
   240	**Prompt for AI Agent**:
   241	```
   242	Build contact page with functional form:
   243	
   244	1. Layout based on contact.html
   245	2. Implement form with react-hook-form + zod validation:
   246	   - Fields: name (required), email (required, valid email), phone (optional), message (required, 10+ chars)
   247	   - Client-side validation with error messages
   248	   - Submit handler (API route /api/contact)
   249	3. Display contact information (email, phone)
   250	4. Add social links (styled icons)
   251	5. Loading state during submission
   252	6. Success/error toast notifications (shadcn/ui Toast)
   253	7. Honeypot field for spam prevention
   254	
   255	Form should POST to /api/contact (to be built in Phase 4).
   256	```
   257	
   258	**Success Criteria**:
   259	- ✓ Form validation works (client-side)
   260	- ✓ Error messages display correctly
   261	- ✓ Submit triggers loading state
   262	- ✓ Accessible form labels
   263	
   264	**Dependencies**: Phase 3.1 complete
   265	
   266	---
   267	
   268	## Phase 4: Backend Development (Week 5)
   269	
   270	### 4.1 Database Setup & Prisma ORM
   271	**Goal**: Set up PostgreSQL database with Prisma schema.
   272	
   273	**Tasks**:
   274	1. Set up PostgreSQL database (local + production)
   275	2. Install and configure Prisma
   276	3. Define schema for:
   277	   - ContactSubmissions (name, email, phone, message, createdAt)
   278	   - JobApplications (name, email, resume, position, createdAt)
   279	   - NewsletterSubscribers (email, subscribedAt, active)
   280	   - Donations (amount, donor, method, createdAt)
   281	   - Users (for admin auth)
   282	4. Run migrations
   283	5. Seed database with initial data
   284	
   285	**Prompt for AI Agent**:
   286	```
   287	Set up Prisma with PostgreSQL:
   288	
   289	1. Install prisma, @prisma/client
   290	2. Initialize prisma (npx prisma init)
   291	3. Create schema.prisma with models:
   292	   - ContactSubmission
   293	   - JobApplication
   294	   - NewsletterSubscriber
   295	   - Donation
   296	   - User (for NextAuth)
   297	4. Configure DATABASE_URL in .env
   298	5. Create migration (npx prisma migrate dev)
   299	6. Create db seed script with sample data
   300	7. Generate Prisma Client
   301	
   302	Include proper indexes, timestamps, and validation constraints.
   303	```
   304	
   305	**Success Criteria**:
   306	- ✓ Database connected
   307	- ✓ Migrations run successfully
   308	- ✓ Prisma Client generates types
   309	- ✓ Seed script works
   310	
   311	**Dependencies**: None (parallel with Phase 3)
   312	
   313	---
   314	
   315	### 4.2 API Routes Implementation
   316	**Goal**: Build API endpoints for form submissions and data access.
   317	
   318	**Tasks**:
   319	1. `/api/contact` - POST contact form submissions
   320	2. `/api/jobs/apply` - POST job applications (with file upload)
   321	3. `/api/newsletter/subscribe` - POST email subscriptions
   322	4. `/api/donations` - POST donation records
   323	5. Email service integration (SendGrid/Resend)
   324	6. File upload service (AWS S3 or Vercel Blob)
   325	7. Rate limiting middleware
   326	8. Input validation (Zod schemas)
   327	
   328	**Prompt for AI Agent**:
   329	```
   330	Create API route /app/api/contact/route.ts:
   331	
   332	1. Accept POST requests with body: { name, email, phone?, message }
   333	2. Validate with Zod schema
   334	3. Save to database using Prisma (ContactSubmission model)
   335	4. Send notification email to admin@alhayaat.ca using Resend
   336	5. Send confirmation email to user
   337	6. Return success/error response
   338	7. Add rate limiting (max 5 requests/hour per IP)
   339	8. Include error handling and logging
   340	9. Add CORS headers
   341	
   342	Use Next.js 15 App Router API route format (route handlers).
   343	```
   344	
   345	**Success Criteria**:
   346	- ✓ All API routes respond correctly
   347	- ✓ Database inserts work
   348	- ✓ Emails sent successfully
   349	- ✓ Rate limiting prevents abuse
   350	- ✓ Validation catches invalid data
   351	
   352	**Dependencies**: Phase 4.1 complete
   353	
   354	---
   355	
   356	### 4.3 Authentication System (NextAuth.js)
   357	**Goal**: Implement admin authentication for dashboard.
   358	
   359	**Tasks**:
   360	1. Install and configure NextAuth.js v5
   361	2. Set up credentials provider (email + password)
   362	3. Protect admin routes with middleware
   363	4. Create login page
   364	5. Implement session management
   365	6. Add logout functionality
   366	
   367	**Prompt for AI Agent**:
   368	```
   369	Set up NextAuth.js v5 for admin authentication:
   370	
   371	1. Install next-auth@beta
   372	2. Create /app/api/auth/[...nextauth]/route.ts
   373	3. Configure providers: Credentials (email/password)
   374	4. Use Prisma adapter for session storage
   375	5. Hash passwords with bcrypt
   376	6. Create /app/login/page.tsx with login form
   377	7. Create middleware.ts to protect /admin routes
   378	8. Add signIn/signOut functions
   379	9. Create initial admin user in seed script
   380	
   381	Admin dashboard will show: contact submissions, job applications, newsletter subs, donations.
   382	```
   383	
   384	**Success Criteria**:
   385	- ✓ Login works with valid credentials
   386	- ✓ Protected routes redirect to login
   387	- ✓ Session persists across refreshes
   388	- ✓ Logout clears session
   389	
   390	**Dependencies**: Phase 4.1 complete
   391	
   392	---
   393	
   394	## Phase 5: Advanced Features (Week 6)
   395	
   396	### 5.1 Donation Integration (Stripe)
   397	**Goal**: Implement donation payment processing.
   398	
   399	**Tasks**:
   400	1. Set up Stripe account (test + production)
   401	2. Install @stripe/stripe-js
   402	3. Create donation form with amount selector
   403	4. Implement Stripe Checkout session
   404	5. Create webhook handler for payment confirmation
   405	6. Store donation records in database
   406	7. Send thank-you email to donors
   407	8. Generate tax receipts (PDF)
   408	
   409	**Prompt for AI Agent**:
   410	```
   411	Implement Stripe donation flow:
   412	
   413	1. Install @stripe/stripe-js, stripe (server SDK)
   414	2. Create /app/donate/page.tsx with:
   415	   - Amount selection (preset: $25, $50, $100, $250, custom)
   416	   - Donor information form (name, email, address)
   417	   - Payment button → Stripe Checkout
   418	3. Create API route /app/api/stripe/checkout-session/route.ts:
   419	   - Create Stripe Checkout Session
   420	   - Include metadata (donor info, tax receipt)
   421	   - Return session URL
   422	4. Create webhook /app/api/stripe/webhook/route.ts:
   423	   - Verify signature
   424	   - Handle checkout.session.completed event
   425	   - Save to Donation model
   426	   - Send thank-you email + tax receipt PDF
   427	5. Add Stripe publishable key to .env
   428	
   429	Use Stripe test mode initially.
   430	```
   431	
   432	**Success Criteria**:
   433	- ✓ Checkout session opens
   434	- ✓ Test payments succeed
   435	- ✓ Webhook captures payments
   436	- ✓ Donation records saved
   437	- ✓ Emails sent with receipts
   438	
   439	**Dependencies**: Phase 4.2 complete
   440	
   441	---
   442	
   443	### 5.2 Admin Dashboard
   444	**Goal**: Build protected admin interface to view submissions.
   445	
   446	**Tasks**:
   447	1. Create `/app/admin` layout with sidebar
   448	2. Dashboard overview page (stats)
   449	3. Contact submissions table (with pagination, filters)
   450	4. Job applications table (with resume download links)
   451	5. Newsletter subscribers table (with export CSV)
   452	6. Donations table (with total amount stats)
   453	7. Implement data tables with sorting/filtering (shadcn/ui DataTable)
   454	
   455	**Prompt for AI Agent**:
   456	```
   457	Build admin dashboard at /app/admin:
   458	
   459	1. Create protected layout /app/admin/layout.tsx:
   460	   - Check auth with getServerSession
   461	   - Redirect to /login if not authenticated
   462	   - Sidebar with navigation: Overview, Contacts, Applications, Newsletter, Donations
   463	2. Create /app/admin/page.tsx (Overview):
   464	   - Show cards: Total contacts, Applications, Subscribers, Donation amount
   465	   - Fetch counts from database (Prisma aggregations)
   466	3. Create /app/admin/contacts/page.tsx:
   467	   - DataTable with columns: Name, Email, Phone, Message (truncated), Date
   468	   - Pagination (10 per page)
   469	   - Search by name/email
   470	   - Row click → view full message modal
   471	4. Similar pages for applications, newsletter, donations
   472	
   473	Use shadcn/ui Table, Card, Badge components.
   474	```
   475	
   476	**Success Criteria**:
   477	- ✓ Admin routes protected
   478	- ✓ Data displays in tables
   479	- ✓ Pagination works
   480	- ✓ Search filters data
   481	- ✓ CSV export works
   482	
   483	**Dependencies**: Phase 4.3 complete
   484	
   485	---
   486	
   487	## Phase 6: Polish & Optimization (Week 7)
   488	
   489	### 6.1 Animations & Interactions
   490	**Goal**: Add smooth transitions matching Webflow feel.
   491	
   492	**Tasks**:
   493	1. Install framer-motion
   494	2. Add page transitions (fade in on mount)
   495	3. Scroll-triggered animations (fade up on scroll)
   496	4. Button hover micro-interactions
   497	5. Mobile menu slide animations
   498	6. Form submission loading states
   499	
   500	**Prompt for AI Agent**:
   501	```
   502	Add Framer Motion animations:
   503	
   504	1. Install framer-motion
   505	2. Create /components/animations/FadeIn.tsx:
   506	   - Fade + slide up animation on mount
   507	   - Use IntersectionObserver for scroll trigger
   508	3. Wrap sections in FadeIn component:
   509	   - Hero, Features, Why Cards, CTA
   510	4. Add button hover animations:
   511	   - Scale 1.02 + shadow lift (matching Webflow behavior)
   512	5. Animate mobile menu:
   513	   - Slide in from right with backdrop fade
   514	6. Add loading spinner for form submissions
   515	
   516	Keep animations subtle (0.3-0.5s duration, ease-out easing).
   517	```
   518	
   519	**Success Criteria**:
   520	- ✓ Page elements fade in smoothly
   521	- ✓ Scroll animations triggered at right time
   522	- ✓ No janky animations (60fps)
   523	- ✓ Reduced motion respected (prefers-reduced-motion)
   524	
   525	**Dependencies**: Phase 3.2 complete
   526	
   527	---
   528	
   529	### 6.2 SEO & Performance Optimization
   530	**Goal**: Achieve Lighthouse score 95+ across all categories.
   531	
   532	**Tasks**:
   533	1. Optimize images (Next.js Image, WebP format)
   534	2. Add metadata to all pages
   535	3. Implement JSON-LD structured data (School, FAQ, etc.)
   536	4. Create sitemap.xml and robots.txt
   537	5. Set up Open Graph images
   538	6. Implement lazy loading for below-fold content
   539	7. Code splitting (dynamic imports for heavy components)
   540	8. Font optimization (next/font)
   541	9. Add cache headers for static assets
   542	
   543	**Prompt for AI Agent**:
   544	```
   545	Optimize for SEO and performance:
   546	
   547	1. Replace all <img> with Next.js Image component
   548	2. Add metadata to each page in page.tsx files:
   549	   - title, description, keywords
   550	   - Open Graph (og:title, og:description, og:image)
   551	   - Twitter cards
   552	3. Create /app/sitemap.ts (dynamic sitemap generator)
   553	4. Create /app/robots.ts
   554	5. Add JSON-LD structured data to relevant pages:
   555	   - Home: School schema
   556	   - Careers: JobPosting schema
   557	   - Contact: LocalBusiness schema
   558	6. Optimize fonts:
   559	   - Use next/font/google for Open Sans, Dongle
   560	   - Preload critical fonts
   561	7. Lazy load non-critical components (dynamic imports)
   562	8. Run Lighthouse audit, fix issues
   563	
   564	Target: 95+ on all Lighthouse metrics.
   565	```
   566	
   567	**Success Criteria**:
   568	- ✓ Lighthouse Performance 95+
   569	- ✓ Lighthouse Accessibility 100
   570	- ✓ Lighthouse SEO 100
   571	- ✓ All images optimized
   572	- ✓ Sitemap accessible at /sitemap.xml
   573	
   574	**Dependencies**: Phase 3.2 complete
   575	
   576	---
   577	
   578	## Phase 7: Testing & Deployment (Week 8)
   579	
   580	### 7.1 Testing & Quality Assurance
   581	**Goal**: Ensure production readiness through comprehensive testing.
   582	
   583	**Tasks**:
   584	1. Write unit tests for utility functions
   585	2. Write component tests (React Testing Library)
   586	3. Write API route tests (integration tests)
   587	4. Test form submissions end-to-end
   588	5. Cross-browser testing (Chrome, Safari, Firefox, Edge)
   589	6. Mobile device testing (iOS Safari, Android Chrome)
   590	7. Accessibility audit (Axe DevTools, screen reader testing)
   591	8. Load testing (payment flows)
   592	9. Security audit (OWASP checklist)
   593	
   594	**Prompt for AI Agent**:
   595	```
   596	Create test suite:
   597	
   598	1. Unit tests for /lib utilities (Vitest)
   599	2. Component tests for Button, Form inputs (RTL):
   600	   - Render tests
   601	   - Interaction tests (click, type)
   602	   - Accessibility tests
   603	3. API route tests:
   604	   - Mock Prisma client
   605	   - Test validation (invalid inputs)
   606	   - Test success responses
   607	4. E2E test for contact form:
   608	   - Fill form → submit → verify DB insert
   609	   - Use Playwright
   610	5. Add npm script: npm run test:all (runs all tests)
   611	
   612	Aim for 80%+ code coverage.
   613	```
   614	
   615	**Success Criteria**:
   616	- ✓ 80%+ test coverage
   617	- ✓ All tests pass
   618	- ✓ No critical accessibility issues
   619	- ✓ Cross-browser compatibility confirmed
   620	- ✓ Security scan passes
   621	
   622	**Dependencies**: Phase 6.2 complete
   623	
   624	---
   625	
   626	### 7.2 Production Deployment
   627	**Goal**: Deploy to cloud platform with CI/CD pipeline.
   628	
   629	**Tasks**:
   630	1. Set up production database (PostgreSQL on AWS RDS/Azure/GCP)
   631	2. Configure environment variables in cloud platform
   632	3. Set up Docker containerization (optional for AWS/Azure/GCP)
   633	4. Deploy to cloud:
   634	   - AWS: ECS/Fargate or Amplify
   635	   - Azure: App Service or Container Apps
   636	   - GCP: Cloud Run or App Engine
   637	5. Set up CI/CD pipeline (GitHub Actions)
   638	6. Configure custom domain + SSL
   639	7. Set up monitoring (Sentry for errors, analytics)
   640	8. Configure email service (production SendGrid/Resend keys)
   641	9. Set Stripe to live mode
   642	10. Create deployment documentation
   643	
   644	**Prompt for AI Agent (AWS Example)**:
   645	```
   646	Deploy to AWS:
   647	
   648	1. Create Dockerfile for Next.js app:
   649	   - Multi-stage build (build → runtime)
   650	   - Use node:20-alpine
   651	   - Set NODE_ENV=production
   652	2. Set up AWS RDS PostgreSQL database
   653	3. Create ECR repository, push Docker image
   654	4. Create ECS task definition (Fargate):
   655	   - Environment variables from Secrets Manager
   656	   - Database connection string
   657	5. Set up Application Load Balancer
   658	6. Configure Route 53 for custom domain
   659	7. Add SSL certificate (ACM)
   660	8. Create GitHub Actions workflow:
   661	   - On push to main → build → test → deploy
   662	9. Add Sentry DSN to .env
   663	10. Document deployment process in DEPLOYMENT.md
   664	
   665	Include rollback instructions.
   666	```
   667	
   668	**Success Criteria**:
   669	- ✓ App accessible at production URL
   670	- ✓ SSL certificate valid
   671	- ✓ Database connected
   672	- ✓ Forms work in production
   673	- ✓ Payments complete successfully
   674	- ✓ CI/CD pipeline deploys on push
   675	- ✓ Error monitoring active
   676	
   677	**Dependencies**: Phase 7.1 complete
   678	
   679	---
   680	
   681	## Phase 8: Handoff & Documentation (Post-Launch)
   682	
   683	### 8.1 Documentation
   684	**Goal**: Provide comprehensive documentation for maintenance.
   685	
   686	**Tasks**:
   687	1. Create README.md (setup instructions)
   688	2. Create CONTRIBUTING.md (development workflow)
   689	3. Document API routes (endpoints, request/response schemas)
   690	4. Create admin user guide (how to use dashboard)
   691	5. Document environment variables
   692	6. Create runbook for common issues
   693	7. Code comments for complex logic
   694	8. Architecture decision records (ADRs)
   695	
   696	**Success Criteria**:
   697	- ✓ New developer can set up locally from README
   698	- ✓ All env vars documented
   699	- ✓ API docs complete
   700	
   701	---
   702	
   703	### 8.2 Future Roadmap
   704	**Goal**: Define next steps for future enhancements.
   705	
   706	**Suggested Future Phases**:
   707	1. **CMS Integration** (Content management for blog, jobs)
   708	   - Contentful, Strapi, or Sanity
   709	   - Admin content editor
   710	2. **Blog System** (Complete detail_blog.html)
   711	   - Post listing + detail pages
   712	   - Categories, tags, search
   713	   - RSS feed
   714	3. **Multi-language Support** (Arabic)
   715	   - i18n implementation
   716	   - RTL layout support
   717	4. **Parent Portal** (Authentication for parents)
   718	   - Student info, grades, announcements
   719	   - Event calendar
   720	5. **Search Functionality** (Site search)
   721	   - Algolia or Meilisearch integration
   722	6. **Analytics Dashboard** (Admin metrics)
   723	   - Traffic, conversions, donations
   724	
   725	---
   726	
   727	## Detailed Prompts Library
   728	
   729	### Prompt Template: Component Creation
   730	```
   731	Create [ComponentName] component in /components/[category]/[ComponentName].tsx:
   732	
   733	Requirements:
   734	- TypeScript with prop types interface
   735	- Tailwind CSS for styling
   736	- Responsive design (mobile-first)
   737	- Accessibility (ARIA, keyboard navigation)
   738	- Props: [list specific props]
   739	- Variants: [list variants if applicable]
   740	- States: default, hover, active, disabled, loading
   741	
   742	Additional context:
   743	[Reference Webflow HTML structure or design]
   744	
   745	Include:
   746	- Component file
   747	- Type definitions
   748	- Unit test (ComponentName.test.tsx)
   749	- Storybook story (ComponentName.stories.tsx)
   750	```
   751	
   752	### Prompt Template: Page Migration
   753	```
   754	Convert [page-name].html from Webflow to Next.js page at /app/[route]/page.tsx:
   755	
   756	1. Analyze HTML structure in [page-name].html
   757	2. Identify sections and their content
   758	3. Build page using components from /components
   759	4. Extract text content to /lib/content/[page-name].ts
   760	5. Add metadata (title, description, OG tags)
   761	6. Add JSON-LD structured data
   762	7. Optimize images with Next.js Image
   763	8. Implement responsive layouts
   764	
   765	Preserve:
   766	- Exact copy/text
   767	- Visual hierarchy
   768	- Spacing and padding
   769	- Color scheme
   770	- Responsive breakpoints
   771	
   772	Reference: c:\Users\mohdr\projects\webflow\al-hayaat.webflow\[page-name].html
   773	```
   774	
   775	### Prompt Template: API Route
   776	```
   777	Create API route /app/api/[endpoint]/route.ts:
   778	
   779	Functionality:
   780	- Method: [GET/POST/PUT/DELETE]
   781	- Request body: [schema]
   782	- Response: [schema]
   783	
   784	Implementation:
   785	1. Validate request with Zod schema
   786	2. [Database operation with Prisma]
   787	3. [External service call if needed]
   788	4. Error handling (try/catch)
   789	5. Return typed response
   790	
   791	Security:
   792	- Rate limiting
   793	- Input sanitization
   794	- Authentication check (if needed)
   795	
   796	Include error responses for:
   797	- 400 Bad Request (validation)
   798	- 401 Unauthorized (auth)
   799	- 500 Internal Server Error
   800	```
   801	
   802	---
   803	
   804	## Success Metrics
   805	
   806	### Technical Metrics
   807	- ✓ Lighthouse Performance: 95+
   808	- ✓ Lighthouse Accessibility: 100
   809	- ✓ Lighthouse SEO: 100
   810	- ✓ Test Coverage: 80%+
   811	- ✓ Build time: <2 minutes
   812	- ✓ First Contentful Paint: <1.5s
   813	- ✓ Time to Interactive: <3.5s
   814	
   815	### Functional Metrics
   816	- ✓ All 10 pages migrated
   817	- ✓ Contact form operational
   818	- ✓ Job application form operational
   819	- ✓ Newsletter signup operational
   820	- ✓ Donation payments working
   821	- ✓ Admin dashboard functional
   822	- ✓ Mobile responsive (all breakpoints)
   823	- ✓ Cross-browser compatible
   824	
   825	### Quality Metrics
   826	- ✓ Zero critical accessibility issues
   827	- ✓ No console errors in production
   828	- ✓ All images optimized (WebP)
   829	- ✓ All forms validated
   830	- ✓ Security headers configured
   831	- ✓ HTTPS enforced
   832	
   833	---
   834	
   835	## Risk Management
   836	
   837	| Risk | Impact | Mitigation |
   838	|------|--------|------------|
   839	| **Stripe integration delays** | High | Start integration early (Phase 5), use test mode extensively |
   840	| **Performance issues on mobile** | Medium | Regular Lighthouse audits, image optimization priority |
   841	| **Animation complexity** | Low | Use Framer Motion library, keep animations simple |
   842	| **Database migration issues** | Medium | Thorough testing in staging, backup strategy |
   843	| **Email delivery problems** | Medium | Use reliable service (Resend), implement retry logic |
   844	| **Cross-browser bugs** | Low | Test early and often, use CSS autoprefixer |
   845	
   846	---
   847	
   848	## Resources & References
   849	
   850	### Documentation Links
   851	- [Next.js 15 App Router](https://nextjs.org/docs)
   852	- [Tailwind CSS](https://tailwindcss.com/docs)
   853	- [shadcn/ui Components](https://ui.shadcn.com/)
   854	- [Prisma ORM](https://www.prisma.io/docs)
   855	- [NextAuth.js v5](https://authjs.dev/)
   856	- [Stripe Docs](https://stripe.com/docs)
   857	- [Framer Motion](https://www.framer.com/motion/)
   858	
   859	### Code References
   860	- Webflow source: `c:\Users\mohdr\projects\webflow\al-hayaat.webflow\`
   861	- Design system: `css/al-hayaat.webflow.css`
   862	- Page structures: `*.html` files
   863	
   864	---
   865	
   866	## Phase Dependencies Graph
   867	
   868	```
   869	Phase 1.1 (Setup)
   870	    ↓
   871	Phase 1.2 (Design System)
   872	    ↓
   873	Phase 2.1 (Layout Components)
   874	    ↓
   875	Phase 2.2 (UI Components)
   876	    ↓
   877	Phase 3.1 (Static Pages) ←─┐
   878	    ↓                        │
   879	Phase 3.2 (Interactive)     │
   880	    ↓                        │
   881	Phase 4.1 (Database) ───────┘
   882	    ↓
   883	Phase 4.2 (API Routes)
   884	    ↓
   885	Phase 4.3 (Auth)
   886	    ↓
   887	Phase 5.1 (Stripe)
   888	    ↓
   889	Phase 5.2 (Admin Dashboard)
   890	    ↓
   891	Phase 6.1 (Animations)
   892	    ↓
   893	Phase 6.2 (SEO)
   894	    ↓
   895	Phase 7.1 (Testing)
   896	    ↓
   897	Phase 7.2 (Deployment)
   898	    ↓
   899	Phase 8 (Documentation)
   900	```
   901	
   902	
