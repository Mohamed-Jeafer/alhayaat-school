---
id: TASK-129.05
title: 'LOCAL-05: Test school enrollment application saves JSONB data'
status: To Do
assignee: []
created_date: '2026-04-11 13:23'
labels:
  - local
dependencies:
  - TASK-129.01
parent_task_id: TASK-129
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
User completes multi-step enrollment form  POST /api/application  4 JSONB blobs saved in applications table (student_data, guardian_data, academic_data, additional_data).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Complete and submit the enrollment/admissions application form at /admissions/apply
- [ ] #2 API returns 200
- [ ] #3 Row exists in applications with status='pending' and all 4 JSONB fields populated
- [ ] #4 JSONB fields contain the correct submitted values (spot-check student name, guardian email)
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Navigate to /admissions/apply
2. Complete all steps of the multi-step form
3. Submit
4. SELECT id, status, student_data->>'firstName' as student_name, submitted_at FROM applications ORDER BY submitted_at DESC LIMIT 1;
<!-- SECTION:PLAN:END -->
