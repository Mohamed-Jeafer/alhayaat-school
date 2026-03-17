---
title: "Phase 0: Infrastructure Setup"
status: pending
priority: high
dependencies: []
estimated_hours: 16
phase: 0
---

# Phase 0: Infrastructure Setup

## Overview
Set up the complete infrastructure foundation including GitHub repository, Azure resources, and CI/CD pipelines. This phase establishes the deployment pipeline and environments before any code development.

## Goals
- Create GitHub repository with proper structure
- Deploy Azure infrastructure using Bicep IaC
- Configure CI/CD pipelines with GitHub Actions
- Set up dev, staging, and production environments
- Establish database and secrets management

## Prerequisites
- Azure subscription with appropriate permissions
- GitHub account with repository creation rights
- Azure CLI installed locally
- Git installed and configured

## Tasks

### Task 1: GitHub Repository Setup
**Estimated**: 2 hours

**Acceptance Criteria**:
- [ ] Repository created: `al-hayaat-nextjs`
- [ ] README.md with project overview
- [ ] .gitignore configured for Next.js
- [ ] Branch protection rules on `main` and `develop`
- [ ] Repository secrets configured

**Implementation Steps**:
1. Create new GitHub repository
2. Initialize with README, .gitignore (Node)
3. Create `develop` branch
4. Configure branch protection:
   - Require PR reviews for `main`
   - Require status checks to pass
   - No direct pushes to `main`

**Files to Create**:
- `README.md`
- `.gitignore`

---

### Task 2: Next.js Project Initialization
**Estimated**: 2 hours

**Acceptance Criteria**:
- [ ] Next.js 15 project initialized
- [ ] TypeScript configured
- [ ] Tailwind CSS installed
- [ ] ESLint and Prettier configured
- [ ] Project builds successfully

**Implementation Steps**:
```bash
npx create-next-app@latest al-hayaat-nextjs --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd al-hayaat-nextjs
npm install
npm run build
```

**Configuration Files**:
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind configuration
- `.eslintrc.json` - ESLint rules
- `.prettierrc` - Code formatting

---

### Task 3: Azure Bicep Infrastructure
**Estimated**: 6 hours

**Acceptance Criteria**:
- [ ] Bicep files created for all resources
- [ ] Parameter files for dev/staging/prod
- [ ] Infrastructure deploys successfully
- [ ] All resources accessible

**Resources to Provision**:
1. **App Service Plan**
   - Dev: B1 (Basic)
   - Staging: S1 (Standard)
   - Prod: P1V2 (Premium)

2. **App Service (Web App)**
   - Linux, Node.js 20
   - Environment-specific naming: `al-hayaat-{env}`

3. **PostgreSQL Flexible Server**
   - Dev: Burstable B1ms
   - Staging: General Purpose D2s_v3
   - Prod: General Purpose D2s_v3
   - Database: `alhayaat_db`

4. **Storage Account**
   - Standard LRS
   - Blob container: `resumes`

5. **Key Vault**
   - Store: DATABASE_URL, NEXTAUTH_SECRET, STRIPE_SECRET_KEY

6. **Application Insights**
   - Monitoring and logging

**Files to Create**:
```
infrastructure/
├── main.bicep
├── modules/
│   ├── app-service.bicep
│   ├── database.bicep
│   ├── storage.bicep
│   └── keyvault.bicep
└── parameters/
    ├── dev.json
    ├── staging.json
    └── prod.json
```

**Deployment Command**:
```bash
az deployment group create \
  --resource-group rg-alhayaat-dev \
  --template-file infrastructure/main.bicep \
  --parameters infrastructure/parameters/dev.json
```

---

### Task 4: GitHub Actions Workflows
**Estimated**: 4 hours

**Acceptance Criteria**:
- [ ] CI workflow runs on PR
- [ ] Deploy workflows for each environment
- [ ] Secrets configured in GitHub
- [ ] Successful test deployment

**Workflows to Create**:

1. **CI Workflow** (`.github/workflows/ci.yml`)
   - Trigger: Pull requests to `develop` or `main`
   - Steps: Install, lint, type-check, build
   
2. **Deploy Dev** (`.github/workflows/deploy-dev.yml`)
   - Trigger: Push to `develop` branch
   - Deploy to Azure dev environment
   
3. **Deploy Staging** (`.github/workflows/deploy-staging.yml`)
   - Trigger: Manual workflow dispatch
   - Deploy to Azure staging environment
   
4. **Deploy Production** (`.github/workflows/deploy-prod.yml`)
   - Trigger: Push to `main` branch
   - Requires manual approval
   - Deploy to Azure production environment

**GitHub Secrets Required**:
- `AZURE_CREDENTIALS` - Service principal JSON
- `AZURE_WEBAPP_NAME_DEV`
- `AZURE_WEBAPP_NAME_STAGING`
- `AZURE_WEBAPP_NAME_PROD`

---

### Task 5: Database Schema Setup
**Estimated**: 2 hours

**Acceptance Criteria**:
- [ ] Schema SQL file created
- [ ] Schema deployed to dev database
- [ ] Connection verified from local
- [ ] Seed data script created

**Schema File**: `scripts/db/schema.sql`

```sql
-- Contact submissions
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Job applications
CREATE TABLE job_applications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  resume_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT true
);

-- Donations
CREATE TABLE donations (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  donor_name VARCHAR(255),
  donor_email VARCHAR(255),
  stripe_session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_contact_created ON contact_submissions(created_at DESC);
CREATE INDEX idx_applications_created ON job_applications(created_at DESC);
CREATE INDEX idx_donations_created ON donations(created_at DESC);
```

**Deployment**:
```bash
psql $DATABASE_URL -f scripts/db/schema.sql
```

---

## Environment Variables

Create `.env.local` template:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/alhayaat_db

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=

# Stripe (test keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email (Resend)
RESEND_API_KEY=

# Application Insights
APPLICATIONINSIGHTS_CONNECTION_STRING=
```

---

## Verification Steps

### 1. Repository Verification
```bash
git clone https://github.com/your-org/al-hayaat-nextjs.git
cd al-hayaat-nextjs
npm install
npm run dev
```
Expected: App runs on http://localhost:3000

### 2. Azure Resources Verification
```bash
az resource list --resource-group rg-alhayaat-dev --output table
```
Expected: All 6 resources listed

### 3. Database Connection Verification
```bash
psql $DATABASE_URL -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"
```
Expected: 5 tables listed

### 4. CI/CD Verification
- Create test PR → CI workflow runs
- Merge to develop → Deploy dev workflow runs
- Check Azure portal → App deployed

---

## Success Criteria

- [x] GitHub repository created and configured
- [x] Next.js project initialized and building
- [x] Azure infrastructure deployed (all 6 resources)
- [x] Database schema deployed and accessible
- [x] CI workflow passing on PRs
- [x] Dev environment deployed and accessible
- [x] Environment variables configured in Azure Key Vault
- [x] Documentation complete (README, deployment guide)

---

## Deliverables

1. **GitHub Repository**
   - Initialized Next.js 15 project
   - Branch protection configured
   - Secrets configured

2. **Infrastructure Code**
   - `infrastructure/` directory with Bicep files
   - Parameter files for 3 environments
   - Deployment scripts

3. **CI/CD Pipelines**
   - 4 GitHub Actions workflows
   - Automated deployment to dev
   - Manual deployment to staging/prod

4. **Database**
   - Schema SQL file
   - Seed data script
   - Migration strategy documented

5. **Documentation**
   - README with setup instructions
   - Environment variables guide
   - Deployment runbook

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Azure quota limits | High | Request quota increase early |
| Database connection issues | Medium | Test connection strings thoroughly |
| GitHub Actions failures | Medium | Test workflows in fork first |
| Key Vault access issues | High | Configure managed identity properly |

---

## Next Phase

After completing Phase 0, proceed to **Phase 1: Foundation & Design System** which will:
- Extract design tokens from Webflow CSS
- Configure Tailwind with brand colors
- Build base Button component
- Set up database connection utilities
