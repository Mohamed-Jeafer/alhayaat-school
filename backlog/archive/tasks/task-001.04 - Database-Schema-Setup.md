---
id: TASK-001.04
title: Database Schema Setup
status: To Do
assignee: []
created_date: '2026-03-08 17:52'
updated_date: '2026-03-15 10:43'
labels:
  - phase-0
  - database
milestone: m-0
dependencies: []
parent_task_id: TASK-001
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create schema.sql with 5 tables (contact_submissions, job_applications, newsletter_subscribers, donations, users) and deploy to dev database
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 scripts/db/schema.sql created with all 5 tables
- [ ] #2 contact_submissions table created (id, name, email, phone, message, created_at)
- [ ] #3 job_applications table created (id, name, email, position, resume_url, created_at)
- [ ] #4 newsletter_subscribers table created (id, email, subscribed_at, active)
- [ ] #5 donations table created (id, amount, donor_name, donor_email, stripe_session_id, created_at)
- [ ] #6 users table created (id, email, password_hash, role, created_at)
- [ ] #7 Indexes created on created_at columns
- [ ] #8 Schema deployed to dev database
- [ ] #9 Connection verified from local environment
- [ ] #10 Seed data script created
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Schema File: scripts/db/schema.sql

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

CREATE INDEX idx_contact_created ON contact_submissions(created_at DESC);
CREATE INDEX idx_applications_created ON job_applications(created_at DESC);
CREATE INDEX idx_donations_created ON donations(created_at DESC);
```

## Deployment
```bash
psql $DATABASE_URL -f scripts/db/schema.sql
```

## Verification
```bash
psql $DATABASE_URL -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"
```
Expected: 5 tables listed
<!-- SECTION:PLAN:END -->
