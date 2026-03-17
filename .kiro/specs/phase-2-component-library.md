---
title: "Phase 2: Core Component Library"
status: pending
priority: high
dependencies: ["phase-1-foundation-design-system"]
estimated_hours: 40
phase: 2
---

# Phase 2: Core Component Library

## Overview
Build the complete reusable component library consisting of 45 components organized by category. This phase creates all UI building blocks needed for the website pages.

## Goals
- Build 7 layout components
- Build 15 UI components
- Build 10 form components with validation
- Build 6 data display components
- Build 4 feedback components
- Build 3 animation components

## Prerequisites
- Phase 1 completed (design system configured)
- Button and Typography components working
- Tailwind CSS configured with brand tokens

## Reference Files
- `COMPONENT-LIBRARY-SPEC.md` - Complete component specifications
- `MIGRATION-PLAN-VALIDATION.md` - Validated component requirements

## Component Build Order

### Week 1: Layout & Core UI (Days 1-5)
- Day 1: Layout components (Navigation, Footer, Container, Section, Grid, PageHeader, Layout)
- Day 2-3: Core UI components (HeroSection, FeatureCard, WhyCard, CTASection, Card)
- Day 4: Supporting UI (Badge, Icon, Image)
- Day 5: Testing and refinement

### Week 2: Forms & Data Display (Days 6-10)
- Day 6-7: Form components (Form, Input, Textarea, Select, Checkbox, Radio, RadioGroup)
- Day 8: Advanced forms (FileUpload, FormField, SubmitButton)
- Day 9: Data display (Table, DataCard, EmptyState, LoadingSpinner, Skeleton, Pagination)
- Day 10: Feedback & animations (Toast, Alert, Modal, ConfirmDialog, FadeIn, SlideIn, AnimatedCounter)

## Tasks

### Task 1: Layout Components (7 components)
**Estimated**: 8 hours

**Components**:
1. Navigation - Sticky header with mobile menu
2. Footer - Multi-column footer
3. Container - Width wrapper
4. Section - Page section wrapper
5. Grid - Responsive grid
6. PageHeader - Breadcrumb + title
7. Layout - Root layout wrapper

**Key Implementation**: Navigation component with mobile menu using shadcn/ui Sheet

```bash
npx shadcn-ui@latest add sheet
```

**Files to Create**:
- `components/layout/Navigation.tsx`
- `components/layout/Footer.tsx`
- `components/layout/Container.tsx`
- `components/layout/Section.tsx`
- `components/layout/Grid.tsx`
- `components/layout/PageHeader.tsx`
- `components/layout/Layout.tsx`

---

### Task 2: Core UI Components (8 components)
**Estimated**: 10 hours

**Components**:
1. HeroSection - Full-width hero with backgrounds
2. FeatureCard - Icon + title + description
3. WhyCard - Larger feature card
4. CTASection - Call-to-action block
5. Card - Generic card container
6. Badge - Status indicator
7. Icon - SVG wrapper
8. Image - Next.js Image wrapper

**Key Features**:
- HeroSection supports 3 background variants (glitter, dashlines, solid)
- FeatureCard with hover animations
- Image component with responsive sizes

**Files to Create**:
- `components/ui/HeroSection.tsx`
- `components/ui/FeatureCard.tsx`
- `components/ui/WhyCard.tsx`
- `components/ui/CTASection.tsx`
- `components/ui/Card.tsx`
- `components/ui/Badge.tsx`
- `components/ui/Icon.tsx`
- `components/ui/Image.tsx`

---

### Task 3: Form Components (10 components)
**Estimated**: 12 hours

**Components**:
1. Form - react-hook-form wrapper
2. Input - Text input with validation
3. Textarea - Multi-line input
4. Select - Dropdown
5. Checkbox - Single checkbox
6. Radio - Radio button
7. RadioGroup - Radio group
8. FileUpload - Drag-drop file upload
9. FormField - Field wrapper
10. SubmitButton - Submit with loading

**Dependencies**:
```bash
npm install react-hook-form zod @hookform/resolvers
npx shadcn-ui@latest add form input textarea select checkbox radio-group
```

**Key Features**:
- Zod schema validation
- Error message display
- Loading states
- Accessible form controls

**Files to Create**:
- `components/forms/Form.tsx`
- `components/forms/Input.tsx`
- `components/forms/Textarea.tsx`
- `components/forms/Select.tsx`
- `components/forms/Checkbox.tsx`
- `components/forms/Radio.tsx`
- `components/forms/RadioGroup.tsx`
- `components/forms/FileUpload.tsx`
- `components/forms/FormField.tsx`
- `components/forms/SubmitButton.tsx`

---

### Task 4: Data Display Components (6 components)
**Estimated**: 6 hours

**Components**:
1. Table - Data table with sorting
2. DataCard - Stat/metric card
3. EmptyState - No data placeholder
4. LoadingSpinner - Loading indicator
5. Skeleton - Content placeholder
6. Pagination - Page navigation

**Dependencies**:
```bash
npx shadcn-ui@latest add table skeleton
```

**Files to Create**:
- `components/ui/Table.tsx`
- `components/ui/DataCard.tsx`
- `components/ui/EmptyState.tsx`
- `components/ui/LoadingSpinner.tsx`
- `components/ui/Skeleton.tsx`
- `components/ui/Pagination.tsx`

---

### Task 5: Feedback Components (4 components)
**Estimated**: 4 hours

**Components**:
1. Toast - Notification (shadcn/ui)
2. Alert - Inline alert
3. Modal - Dialog overlay
4. ConfirmDialog - Confirmation modal

**Dependencies**:
```bash
npx shadcn-ui@latest add toast alert dialog
```

**Files to Create**:
- `components/ui/Toast.tsx` (use shadcn)
- `components/ui/Alert.tsx`
- `components/ui/Modal.tsx`
- `components/ui/ConfirmDialog.tsx`

---

### Task 6: Animation Components (3 components)
**Estimated**: 4 hours

**Components**:
1. FadeIn - Fade animation with scroll trigger
2. SlideIn - Slide animation
3. AnimatedCounter - Number count-up

**Dependencies**:
```bash
npm install framer-motion
```

**Key Features**:
- IntersectionObserver for scroll triggers
- Respects prefers-reduced-motion
- Configurable timing

**Files to Create**:
- `components/animations/FadeIn.tsx`
- `components/animations/SlideIn.tsx`
- `components/animations/AnimatedCounter.tsx`

---

### Task 7: Component Index & Documentation
**Estimated**: 2 hours

**Acceptance Criteria**:
- [ ] Central export file created
- [ ] Component usage examples documented
- [ ] Storybook or component playground (optional)

**File**: `components/index.ts`

```typescript
// Layout
export { Navigation } from './layout/Navigation'
export { Footer } from './layout/Footer'
export { Container } from './layout/Container'
export { Section } from './layout/Section'
export { Grid } from './layout/Grid'
export { PageHeader } from './layout/PageHeader'
export { Layout } from './layout/Layout'

// UI
export { Button } from './ui/Button'
export { HeroSection } from './ui/HeroSection'
export { FeatureCard } from './ui/FeatureCard'
// ... all UI components

// Forms
export { Form } from './forms/Form'
export { Input } from './forms/Input'
// ... all form components

// Animations
export { FadeIn } from './animations/FadeIn'
export { SlideIn } from './animations/SlideIn'
export { AnimatedCounter } from './animations/AnimatedCounter'
```

---

## Component Testing Strategy

### Unit Tests
Test critical components with React Testing Library:
- Button variants and states
- Form validation
- Input error handling

### Visual Testing
Create component playground page: `app/components/page.tsx`

### Accessibility Testing
- Keyboard navigation
- Screen reader compatibility
- ARIA attributes
- Color contrast

---

## Success Criteria

- [x] All 45 components built and typed
- [x] Components render without errors
- [x] Form validation working
- [x] Mobile responsive
- [x] Accessible (ARIA labels, keyboard nav)
- [x] Central export file created
- [x] Component documentation complete

---

## Deliverables

1. **Layout Components** (7)
   - Navigation, Footer, Container, Section, Grid, PageHeader, Layout

2. **UI Components** (15)
   - HeroSection, FeatureCard, WhyCard, CTASection, Card, Badge, Icon, Image, etc.

3. **Form Components** (10)
   - Form, Input, Textarea, Select, Checkbox, Radio, FileUpload, etc.

4. **Data Display** (6)
   - Table, DataCard, EmptyState, LoadingSpinner, Skeleton, Pagination

5. **Feedback** (4)
   - Toast, Alert, Modal, ConfirmDialog

6. **Animations** (3)
   - FadeIn, SlideIn, AnimatedCounter

7. **Documentation**
   - Component usage examples
   - Props documentation
   - Accessibility notes

---

## Next Phase

After completing Phase 2, proceed to **Phase 3: Content Extraction & Static Pages** which will:
- Extract content from Webflow HTML to TypeScript constants
- Build Home, About, School Plans, and Curriculum pages
- Migrate and optimize images
- Configure SEO metadata
