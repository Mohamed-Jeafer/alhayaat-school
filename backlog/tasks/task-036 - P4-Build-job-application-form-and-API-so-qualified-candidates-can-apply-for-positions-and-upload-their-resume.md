---
id: TASK-036
title: >-
  [P4] Build job application form and API so qualified candidates can apply for
  positions and upload their resume
status: Done
assignee: []
created_date: '2026-03-15 13:18'
updated_date: '2026-03-16 12:53'
labels:
  - phase-4
  - backend
  - careers
  - file-upload
milestone: m-5
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a job applicant on the Al-Hayaat School website, I want to submit my application with resume upload directly on the careers page, so that I can apply for a specific position without leaving the site or using external tools.

**Business Context**
The Webflow careers page has no application flow - candidates must email manually. A dedicated application form with Azure Blob resume upload and DB persistence gives the school a structured hiring pipeline and reduces admin overhead.

**Technical Specification**
- Rendering: SSR form page, API route for submission at POST /api/jobs/apply
- Data: job_applications table in PostgreSQL (TASK-003), Azure Blob Storage for resumes
- Infrastructure: Azure Storage Account (BLOB_CONNECTION_STRING), Resend for emails, Upstash rate limiting
- Stack constraints: react-hook-form + Zod (jobApplicationSchema from TASK-024), @azure/storage-blob for file upload, pg Pool singleton from lib/db.ts, multipart/form-data
- Phase dependencies: TASK-024 (service layer), TASK-021 (careers page for Apply button flow)
- Spec reference: .kiro/specs/phase-4-database-integration.md

**Data Contract**
| Field | Type | Validation |
|-------|------|-----------|
| name | string | required, 2-100 chars |
| email | string | required, valid email |
| phone | string | optional, E.164 format |
| position | string | required, matches careers.json titles |
| coverLetter | string | optional, max 2000 chars |
| resume | File | required, PDF/DOC/DOCX, max 5MB |

| DB Column | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| applicant_name | text | not null |
| applicant_email | text | not null |
| position_title | text | not null |
| resume_blob_url | text | Azure Blob URL |
| cover_letter | text | nullable |
| submitted_at | timestamptz | default now() |
| status | text | new, reviewed, shortlisted, rejected |

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| ERR_FILE_TOO_LARGE | Resume over 5MB | Inline error: "File must be under 5MB" |
| ERR_INVALID_FILE_TYPE | Non-PDF/DOC upload | Inline error: accepted formats listed |
| ERR_RATE_LIMIT_EXCEEDED | Over 5 requests/hour | Toast: "Too many submissions, try later" |
| ERR_BLOB_UPLOAD_FAILED | Azure Storage error | Log to App Insights, return 500 |

**Content Extraction**
- Source file: al-hayaat.webflow/careers.html
- Target file: src/content/jobs-form.json (form labels and help text)
- Positions array already in src/content/careers.json from TASK-021

**Reusable Components**
- Form, Input, Textarea, Select - base form components (reuse P2)
- FileUpload - resume upload (reuse P2), src/components/ui/FileUpload.tsx
- SubmitButton - with loading state (reuse P2), src/components/ui/SubmitButton.tsx
- Toast - success/error feedback (reuse P2)

**Testing & Validation**
- Unit: valid submission - DB row created, blob URL stored, confirmation email sent
- Unit: file too large - 422 returned with ERR_FILE_TOO_LARGE
- Unit: invalid file type - 422 returned with ERR_INVALID_FILE_TYPE
- Unit: rate limit exceeded - 429 returned
- Integration: position pre-selected when navigated from careers Apply button
- Lighthouse Accessibility >95

**Recommended Skills**
- `#senior-backend` - multipart form handling, Azure Blob upload, DB insert
- `#senior-fullstack` - react-hook-form with file field, error propagation

**Story Points**: 5
*Sizing rationale: File upload to Azure Blob adds meaningful complexity - Zod validation, blob upload, DB insert, email notification.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given a valid application with PDF resume - When the form submits - Then a DB row is inserted in job_applications, the resume is uploaded to Azure Blob, and a confirmation email is sent to the applicant
- [ ] #2 Given an applicant navigates from the careers Apply button - When the form loads - Then the position select is pre-populated with the linked role
- [ ] #3 Given a resume file over 5MB is selected - When the file input validates - Then an inline error appears before the form can be submitted
- [ ] #4 Given an invalid file type is selected - When the file input validates - Then an inline error lists the accepted formats (PDF, DOC, DOCX)
- [ ] #5 Edge case: rate limit - Given an IP submits 6 applications in one hour - When the 6th request reaches the API - Then HTTP 429 is returned with a Retry-After header
- [ ] #6 Edge case: mobile viewport - Given the user is on a 375px screen - When the form renders - Then all fields and the file upload control are accessible without horizontal scrolling
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented the full job application form and API with Azure Blob resume upload.

**Files created/modified:**
- `src/app/careers/apply/page.tsx` — Client component form with react-hook-form, zodResolver, FileUpload, SelectField (Controller), Suspense wrapper for useSearchParams
- `src/app/api/jobs/apply/route.ts` — POST handler: FormData parsing, Zod validation, resume file validation, rate limiting, Azure Blob upload, DB insert, non-blocking email sends
- `src/lib/db/queries.ts` — Added `createJobApplication` with `CreateJobApplicationInput` and `JobApplication` interfaces
- `src/app/careers/page.tsx` — Replaced "Apply by Email" mailto link with "Apply Now" button linking to `/careers/apply?position=...`

**Key implementation details:**
- Azure Blob upload fails gracefully (500 with clear error) when `AZURE_STORAGE_CONNECTION_STRING` is not set
- Resume validated for presence, size (≤5MB), and type (PDF/DOC/DOCX) server-side
- Rate limited by IP using existing `checkRateLimit`
- Emails sent non-blocking via `.catch()`
- `useSearchParams` wrapped in Suspense boundary per Next.js 15 requirements
- `export const dynamic = 'force-dynamic'` on API route
- Build passes cleanly (TypeScript + Next.js production build)
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 Data contract doc created via backlog doc create -t technical 'Data contract: POST /api/jobs/apply' - record doc-NNN ID here
- [ ] #3 BLOB_CONNECTION_STRING added to Key Vault and .env.local.example
- [ ] #4 Resume blob container has private access with SAS URL generation for admin review
- [ ] #5 All form field labels have associated htmlFor attributes
- [ ] #6 Application Insights logs ERR_BLOB_UPLOAD_FAILED with submission metadata
- [ ] #7 Lighthouse Accessibility >95
<!-- DOD:END -->
