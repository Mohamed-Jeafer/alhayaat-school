---
id: TASK-003
title: Database Schema Setup
status: To Do
assignee: []
created_date: '2026-03-15 10:51'
labels:
  - phase-0
  - database
milestone: m-0
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create the PostgreSQL schema SQL file with all 5 tables and deploy to the dev database. Includes indexes and a seed data script.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 scripts/db/schema.sql created with all 5 tables
- [ ] #2 Tables: contact_submissions, job_applications, newsletter_subscribers, donations, users
- [ ] #3 Indexes on created_at columns for contact_submissions, job_applications, donations
- [ ] #4 Schema deployed to dev database via psql
- [ ] #5 scripts/db/seed.sql created with sample data
- [ ] #6 scripts/db/verify.sql created to confirm table structure
<!-- AC:END -->
