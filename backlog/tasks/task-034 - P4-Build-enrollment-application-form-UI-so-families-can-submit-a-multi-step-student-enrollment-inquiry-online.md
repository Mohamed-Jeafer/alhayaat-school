---
id: TASK-034
title: >-
  [P4] Build enrollment application form UI so families can submit a multi-step
  student enrollment inquiry online
status: To Do
assignee: []
created_date: '2026-03-15 13:18'
labels:
  - phase-4
  - page
  - forms
  - enrollment
milestone: m-5
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a parent visiting the Al-Hayaat School website, I want to complete a multi-step enrollment application form, so that I can submit my child's enrollment inquiry with all required details without needing to print or email paperwork.

**Business Context**
The current Webflow enrollment page is a static informational page with no form. A multi-step form reduces drop-off by breaking a complex application into manageable sections, and stores submissions for school review.

**Technical Specification**
- Rendering: SSR page with client-side multi-step state (useState for step), form submission to POST /api/application (TASK-032)
- Data: src/content/application-form.json for all field labels, help text, and placeholder copy
- Infrastructure: No file uploads on UI - covered in TASK-032
- Stack constraints: react-hook-form + Zod (applicationSchema from TASK-024), shadcn/ui form primitives, step state in component, no external state management
- Phase dependencies: TASK-024 (applicationSchema), TASK-032 (API endpoint), P2 form components
- Spec reference: .kiro/specs/phase-4-database-integration.md

**Form Sections**
| Step | Section | Key Fields |
|------|---------|-----------|
| 1 | Student Information | firstName, lastName, dateOfBirth, gradeApplyingFor, previousSchool |
| 2 | Guardian Information | guardianName, relationship, phone, email, address |
| 3 | Academic Background | currentGrade, subjects, specialNeeds (optional), languagesSpoken |
| 4 | Additional Information | howDidYouHear, additionalNotes (optional), agreeToTerms checkbox |

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| ERR_VALIDATION_FAILED | Step validation failed | Highlight invalid fields, prevent step advance |
| ERR_SUBMISSION_FAILED | API error on submit | Toast: "Submission failed, please try again" |
| ERR_NETWORK | Network failure mid-submit | Toast with retry button |

**Content Extraction**
- Source file: al-hayaat.webflow/admissions.html
- Target file: src/content/application-form.json
- Extract: page hero, section titles, all field labels, help text, placeholder copy, terms text

**Reusable Components**
- Form, Input, Select, Checkbox, RadioGroup - base form components (reuse P2)
- SubmitButton - step advance and final submit (reuse P2)
- Progress - step indicator showing 1 of 4 (reuse P2), src/components/ui/Progress.tsx
- Toast - error and success feedback (reuse P2)

**Testing & Validation**
- Unit: step 1 validation - missing required field prevents advance to step 2
- Unit: step navigation - Back button returns to previous step without clearing data
- Unit: step 4 submit - calls POST /api/application with all 4 sections merged
- Unit: verify all field labels from application-form.json - no hardcoded strings
- Visual: compare against Webflow admissions page at 375px, 768px, 1440px
- Lighthouse Accessibility >95, axe-core zero critical violations

**Recommended Skills**
- `#senior-fullstack` - multi-step form state, react-hook-form with step validation
- `#frontend-design` - progress indicator, step layout, mobile form UX

**Story Points**: 5
*Sizing rationale: Multi-step form with 4 sections, step validation, and progress indicator - higher complexity than a single-page form.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the form is on step 1 - When the user clicks Next with a missing required field - Then validation errors highlight the field and the step does not advance
- [ ] #2 Given the form is on step 2 or later - When the user clicks Back - Then the previous step displays with all previously entered data intact
- [ ] #3 Given all 4 steps are completed - When the user submits - Then the form calls POST /api/application with all sections merged into a single payload
- [ ] #4 Given the API returns an error - When the submission fails - Then a Toast displays with an error message and a retry option
- [ ] #5 Edge case: mobile viewport - Given the user is on a 375px screen - When any step renders - Then all fields and the step indicator are accessible without horizontal scrolling
- [ ] #6 Edge case: direct URL access - Given a user navigates directly to the application page - Then the form always starts at step 1
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 src/content/application-form.json created with all field labels and help text extracted from al-hayaat.webflow/admissions.html
- [ ] #3 All visible text sourced from application-form.json - no hardcoded strings in JSX
- [ ] #4 Progress component correctly reflects current step (1 of 4)
- [ ] #5 react-hook-form validation runs per-step before advancing
- [ ] #6 WCAG 2.1 AA - all form inputs have associated labels and aria-describedby for help text
- [ ] #7 Lighthouse Accessibility >95
<!-- DOD:END -->
