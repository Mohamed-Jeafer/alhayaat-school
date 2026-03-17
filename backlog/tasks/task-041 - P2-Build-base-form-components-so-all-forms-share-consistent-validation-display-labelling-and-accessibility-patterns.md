---
id: TASK-041
title: >-
  [P2] Build base form components so all forms share consistent validation
  display, labelling, and accessibility patterns
status: Done
assignee: []
created_date: '2026-03-15 13:22'
updated_date: '2026-03-16 05:04'
labels:
  - phase-2
  - ui-components
  - forms
milestone: m-2
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a frontend developer building interactive forms for the Al-Hayaat School site, I want base form components (Form, Input, Textarea, Select, Checkbox, Radio, RadioGroup, FormField), so that contact forms, application forms, and admin forms share a consistent validation pattern and accessible markup.

**Business Context**
Without shared form components, each form page would implement its own error display and label association, leading to accessibility failures and inconsistent UX. These components are consumed by TASK-016 (contact form), TASK-034 (enrollment form), and TASK-036 (job application form).

**Technical Specification**
- Rendering: Client Components (require event handling and react-hook-form integration)
- Data: N/A - structural form primitives
- Infrastructure: N/A
- Stack constraints: react-hook-form for form state, Zod resolvers for validation, shadcn/ui form primitives, all error messages pass through FormField
- Phase dependencies: None - base form components are a Phase 2 deliverable
- Spec reference: .kiro/specs/phase-2-component-library.md, docs/COMPONENT-LIBRARY-SPEC.md

**Component Props**
| Component | Key Props |
|-----------|-----------|
| Form | children, form: UseFormReturn from react-hook-form, onSubmit |
| Input | type?, placeholder?, disabled?, error?, ...register props |
| Textarea | placeholder?, rows?, disabled?, error? |
| Select | options: SelectOption[], placeholder?, disabled?, error? |
| Checkbox | label, checked?, onChange?, disabled?, error? |
| Radio | label, value, disabled? |
| RadioGroup | name, options: RadioOption[], value?, onChange? |
| FormField | label, name, required?, error?, helpText?, children |

**Reusable Components**
- Form, src/components/ui/Form.tsx
- Input, src/components/ui/Input.tsx
- Textarea, src/components/ui/Textarea.tsx
- Select, src/components/ui/Select.tsx (wraps shadcn Select)
- Checkbox, src/components/ui/Checkbox.tsx (wraps shadcn Checkbox)
- Radio, src/components/ui/Radio.tsx
- RadioGroup, src/components/ui/RadioGroup.tsx
- FormField, src/components/ui/FormField.tsx

**Testing & Validation**
- Unit: Input with error prop - verify border-red and role=alert on error message
- Unit: Checkbox - verify checked state toggles on click and Space keypress
- Unit: Select - verify options render, keyboard navigation works
- Unit: FormField with helpText - verify helpText visible, associated via aria-describedby
- Lighthouse Accessibility >95, axe-core zero critical violations

**Recommended Skills**
- `#senior-fullstack` - react-hook-form integration, ARIA form patterns
- `#frontend-design` - form layout, error state styling

**Story Points**: 5
*Sizing rationale: Eight components covering all form input types - ARIA accessibility patterns and react-hook-form integration add meaningful complexity.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given a Form is rendered - When the user submits with react-hook-form - Then errors are displayed inline below each failing field using the FormField component
- [ ] #2 Given an Input has an error state - When the field renders with an error message - Then the border turns red and the message appears below the input with role=alert
- [ ] #3 Given a Select has options - When the user opens it - Then options are keyboard navigable and the selected value is announced by screen readers
- [ ] #4 Given a Checkbox is rendered - When the user clicks or presses Space on it - Then the checked state toggles and an associated label is visible
- [ ] #5 Edge case: required field left empty - Given a required Input is submitted empty - When react-hook-form validates - Then an error message appears below the field
- [ ] #6 Edge case: mobile viewport - Given any base form component renders on a 375px screen - When the layout responds - Then the field and its label are accessible without horizontal scrolling
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 Form, Input, Textarea, Select, Checkbox, Radio, RadioGroup, and FormField components exported from src/components/ui/index.ts
- [ ] #3 All form components work with react-hook-form register and Controller
- [ ] #4 FormField wraps each input with label, error message, and help text slots
- [ ] #5 All inputs have associated htmlFor labels - no unlabelled fields
- [ ] #6 WCAG 2.1 AA - error messages have role=alert, required fields have aria-required
<!-- DOD:END -->
