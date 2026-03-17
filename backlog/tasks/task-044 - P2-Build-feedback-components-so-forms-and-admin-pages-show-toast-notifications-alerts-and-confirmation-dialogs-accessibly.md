---
id: TASK-044
title: >-
  [P2] Build feedback components so forms and admin pages show toast
  notifications, alerts, and confirmation dialogs accessibly
status: Done
assignee: []
created_date: '2026-03-15 13:24'
updated_date: '2026-03-16 05:04'
labels:
  - phase-2
  - ui-components
  - feedback
milestone: m-2
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a frontend developer building forms and interactive flows for the Al-Hayaat School site, I want feedback components (Toast, Alert, Modal, ConfirmDialog), so that form success/error states, inline warnings, and destructive action confirmations follow a consistent accessible pattern.

**Business Context**
Form success and error states use Toast across all Phase 4 forms. Admin pages use ConfirmDialog before deleting records. Inline validation warnings use Alert. Without these shared components, each form or admin page would implement its own notification pattern with inconsistent accessibility.

**Technical Specification**
- Rendering: Client Components - all require event handling and state
- Data: Props-driven - content passed from calling component
- Infrastructure: N/A
- Stack constraints: shadcn/ui Toast or Sonner for Toast, shadcn Dialog for Modal and ConfirmDialog, Tailwind for Alert variants, Radix UI focus trap via Dialog under the hood
- Phase dependencies: TASK-039 (core UI - Badge and Icon reused in Alert)
- Spec reference: .kiro/specs/phase-2-component-library.md, docs/COMPONENT-LIBRARY-SPEC.md

**Component Props**
| Component | Key Props |
|-----------|-----------|
| Toast | message, variant?: 'success' or 'error' or 'warning' or 'info', duration?: number |
| Alert | children, variant?: 'info' or 'success' or 'warning' or 'error', title?: string |
| Modal | children, isOpen, onClose, title, description? |
| ConfirmDialog | isOpen, onClose, onConfirm, title, body, confirmLabel?, cancelLabel? |

**Reusable Components**
- Toast, src/components/ui/Toast.tsx (wraps shadcn Toast or Sonner)
- Alert, src/components/ui/Alert.tsx (wraps shadcn Alert)
- Modal, src/components/ui/Modal.tsx (wraps shadcn Dialog)
- ConfirmDialog, src/components/ui/ConfirmDialog.tsx (uses Modal internally)

**Testing & Validation**
- Unit: Toast success variant - verify green background and checkmark icon
- Unit: Toast auto-dismiss - verify toast disappears after duration prop
- Unit: Modal - verify Escape key closes modal and focus returns to trigger
- Unit: Alert error variant - verify role=alert and error colour
- Unit: ConfirmDialog - verify confirm and cancel buttons both call correct handlers
- Lighthouse Accessibility >95, axe-core zero critical violations

**Recommended Skills**
- `#senior-fullstack` - focus trapping, ARIA dialog patterns, toast state management
- `#frontend-design` - toast positioning, confirmation dialog UX

**Story Points**: 3
*Sizing rationale: Four feedback components - Modal and ConfirmDialog focus trapping adds accessibility complexity, shadcn Dialog handles most of it.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given a Toast is triggered - When success or error is returned from a form submission - Then the toast appears with the correct variant colour and dismisses after 5 seconds
- [ ] #2 Given an Alert is rendered with error variant - When the component renders - Then it has role=alert and the error message is announced by screen readers on mount
- [ ] #3 Given a Modal is opened - When the modal is visible - Then focus is trapped inside the modal and pressing Escape closes it
- [ ] #4 Given a ConfirmDialog is triggered - When the dialog renders - Then it shows a heading, body, confirm button, and cancel button with clear labels
- [ ] #5 Edge case: mobile viewport - Given a Modal or ConfirmDialog renders on a 375px screen - When it appears - Then it does not overflow the viewport and the close button is reachable
- [ ] #6 Edge case: multiple Toasts - Given three consecutive API calls each trigger a toast - When they all fire within 1 second - Then all three toasts queue and are visible simultaneously
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 Toast, Alert, Modal, and ConfirmDialog components exported from src/components/ui/index.ts
- [ ] #3 Toast uses shadcn/ui Sonner or Toast primitive - no custom notification implementation
- [ ] #4 Modal and ConfirmDialog trap focus using shadcn Dialog - no custom focus trap implementation
- [ ] #5 All dialogs have aria-modal=true, aria-labelledby pointing to dialog heading
- [ ] #6 TypeScript props interfaces exported alongside each component
<!-- DOD:END -->
