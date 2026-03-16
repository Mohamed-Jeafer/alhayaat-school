---
id: TASK-040
title: >-
  [P2] Build interactive UI components so pages can render accordions, tabs,
  tooltips, and progress indicators accessibly
status: Done
assignee: []
created_date: '2026-03-15 13:22'
updated_date: '2026-03-16 05:04'
labels:
  - phase-2
  - ui-components
  - interactive
milestone: m-2
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a frontend developer building feature-rich pages for the Al-Hayaat School site, I want interactive UI components (Accordion, Tabs, Tooltip, Avatar, Divider, Progress), so that FAQ sections, tabbed content, and multi-step indicators work consistently without reimplementing accessibility patterns.

**Business Context**
These six components are used on the FAQ page (Accordion), programs page (Tabs), admin interface (Avatar), and enrollment form (Progress). They all require correct ARIA implementation for screen readers - using shadcn/ui primitives ensures this without custom accessibility engineering.

**Technical Specification**
- Rendering: Client Components (require event handlers) wrapped in 'use client' boundary
- Data: Props-driven - content passed from parent page components
- Infrastructure: N/A
- Stack constraints: shadcn/ui Accordion, Tabs, Tooltip, Avatar as base primitives, Tailwind for custom variants, Radix UI under the hood
- Phase dependencies: TASK-038 (layout primitives), TASK-039 (core UI, Badge reused in some components)
- Spec reference: .kiro/specs/phase-2-component-library.md, docs/COMPONENT-LIBRARY-SPEC.md

**Component Props**
| Component | Key Props |
|-----------|-----------|
| Accordion | items: AccordionItem[], type?: 'single' or 'multiple', defaultOpen?: string |
| Tabs | tabs: TabItem[], defaultTab?: string, className? |
| Tooltip | children, content: string or ReactNode, side?: 'top' or 'bottom' or 'left' or 'right' |
| Avatar | src?, alt, initials?, size?: 'sm' or 'md' or 'lg' |
| Divider | orientation?: 'horizontal' or 'vertical', label?: string |
| Progress | value: number, max?: number, label?: string, showValue?: boolean |

**Reusable Components**
- Accordion, src/components/ui/Accordion.tsx (wraps shadcn Accordion)
- Tabs, src/components/ui/Tabs.tsx (wraps shadcn Tabs)
- Tooltip, src/components/ui/Tooltip.tsx (wraps shadcn Tooltip)
- Avatar, src/components/ui/Avatar.tsx (wraps shadcn Avatar)
- Divider, src/components/ui/Divider.tsx
- Progress, src/components/ui/Progress.tsx (wraps shadcn Progress)

**Testing & Validation**
- Unit: Accordion single-open mode - verify only one item open at a time
- Unit: Avatar with broken image src - verify initials fallback renders
- Unit: Progress with value=75 - verify aria-valuenow=75 attribute
- Unit: Tooltip keyboard - verify tooltip appears on focus
- Lighthouse Accessibility >95, axe-core zero critical violations

**Recommended Skills**
- `#senior-fullstack` - Radix UI / shadcn primitives, ARIA attributes, Client Component boundaries
- `#frontend-design` - interactive component animation, focus states

**Story Points**: 5
*Sizing rationale: Six interactive components requiring ARIA-correct implementation - Radix UI primitives reduce effort but correct prop mapping and styling needs careful testing.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given an Accordion with multiple items - When a user clicks a collapsed item - Then it expands and any previously open item collapses
- [ ] #2 Given Tabs with multiple panels - When a user clicks a tab - Then the corresponding panel becomes visible and other panels are hidden
- [ ] #3 Given a Tooltip wraps a trigger element - When the user hovers or focuses the trigger - Then the tooltip content appears after a short delay without obscuring nearby content
- [ ] #4 Given an Avatar with a valid image src - When the image loads - Then the image renders in a circle; when the image fails - Then initials or a placeholder icon renders instead
- [ ] #5 Edge case: mobile viewport - Given any interactive component renders on a 375px screen - When the layout responds - Then no popover or tooltip clips outside the viewport
- [ ] #6 Edge case: keyboard - Given a user tabs to an Accordion trigger - When they press Enter or Space - Then the item expands without requiring a mouse click
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 Accordion, Tabs, Tooltip, Avatar, Divider, and Progress components exported from src/components/ui/index.ts
- [ ] #3 All shadcn/ui primitives used as base - no custom implementation of Accordion or Tabs from scratch
- [ ] #4 Each interactive component has appropriate ARIA attributes (aria-expanded, aria-controls, role=tab, etc.)
- [ ] #5 TypeScript props interfaces exported alongside each component
<!-- DOD:END -->
