---
id: TASK-042
title: >-
  [P2] Build advanced form components so file upload and submit buttons work
  consistently with accessible feedback
status: Done
assignee: []
created_date: '2026-03-15 13:23'
updated_date: '2026-03-16 05:04'
labels:
  - phase-2
  - ui-components
  - forms
  - file-upload
milestone: m-2
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a frontend developer building job application and file upload forms for the Al-Hayaat School site, I want advanced form components (FileUpload, SubmitButton), so that resume uploads and form submissions work consistently with accessible feedback across all forms.

**Business Context**
FileUpload and SubmitButton are more complex than base form primitives - FileUpload requires drag-and-drop, file validation, and accessible feedback. SubmitButton needs a loading state to prevent double-submission. Both are reused across job application, enrollment, and contact forms.

**Technical Specification**
- Rendering: Client Components - require event handling for drag/drop and click
- Data: N/A - FileUpload emits File object to parent; actual upload handled by API route (TASK-036)
- Infrastructure: N/A - upload happens in the API route, not in this component
- Stack constraints: HTML file input with custom drop zone styling, no third-party file upload library, Tailwind for drag-over state, shadcn Button for SubmitButton base
- Phase dependencies: TASK-041 (base form components - FormField, error display patterns)
- Spec reference: .kiro/specs/phase-2-component-library.md, docs/COMPONENT-LIBRARY-SPEC.md

**Component Props**
| Component | Key Props |
|-----------|-----------|
| FileUpload | accept: string[], maxSize: number (bytes), onChange: (file: File or null) => void, error?, label? |
| SubmitButton | children, isLoading?: boolean, loadingText?: string, disabled?, className? |

**Reusable Components**
- FileUpload, src/components/ui/FileUpload.tsx
- SubmitButton, src/components/ui/SubmitButton.tsx

**Testing & Validation**
- Unit: FileUpload valid file - verify onChange called with File object
- Unit: FileUpload file too large - verify inline error, onChange not called
- Unit: FileUpload disallowed type - verify inline error, onChange not called
- Unit: SubmitButton isLoading=true - verify spinner shown, button disabled, text changed
- Lighthouse Accessibility >95, axe-core zero critical violations

**Recommended Skills**
- `#senior-fullstack` - HTML drag-and-drop events, accessible file input patterns
- `#frontend-design` - drop zone styling, loading state button UX

**Story Points**: 3
*Sizing rationale: Two components but FileUpload drag-and-drop and file validation add meaningful complexity over simple inputs.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given a FileUpload renders - When a user selects a file within allowed type and size limits - Then the filename and size appear in the control and the file is available to the form
- [ ] #2 Given a user selects a file over the maxSize limit - When the input validates - Then an inline error appears with the size limit and the file is rejected
- [ ] #3 Given a user selects a disallowed file type - When the input validates - Then an inline error lists the accepted types and the file is rejected
- [ ] #4 Given a SubmitButton is in the loading state - When isLoading is true - Then a spinner is shown, the button text changes to the loadingText prop, and the button is disabled
- [ ] #5 Edge case: drag and drop - Given the FileUpload accepts drag events - When a user drags a valid file onto the drop zone - Then the file is accepted identical to click selection
- [ ] #6 Edge case: mobile viewport - Given FileUpload renders on a 375px screen - When the layout responds - Then the drop zone and file name are readable without overflow
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 FileUpload and SubmitButton components exported from src/components/ui/index.ts
- [ ] #3 FileUpload emits onChange with the File object - parent component handles API upload
- [ ] #4 SubmitButton disabled state prevents double-submission
- [ ] #5 FileUpload drop zone has aria-label and keyboard-accessible click fallback
- [ ] #6 TypeScript props interfaces exported alongside each component
<!-- DOD:END -->
