# Component Library Specification

## Overview
Complete specification for all 39 reusable components in the Al-Hayaat School website.

---

## Layout Components (7)

### 1. Navigation
**File**: `/components/layout/Navigation.tsx`

**Purpose**: Main site navigation with sticky header and mobile menu

**Props**:
```typescript
interface NavigationProps {
  links: Array<{ label: string; href: string; }>;
  logoSrc: string;
  ctaButton?: { text: string; href: string; };
  variant?: 'transparent' | 'solid' | 'sticky';
}
```

**Features**:
- Sticky header with blur backdrop on scroll
- Horizontal menu for desktop
- Hamburger menu with slide-out drawer for mobile
- Active link highlighting
- Keyboard navigation support
- ARIA labels for accessibility

**Dependencies**: shadcn/ui Sheet, Framer Motion

---

### 2. Footer
**File**: `/components/layout/Footer.tsx`

**Purpose**: Site footer with links and social media

**Props**:
```typescript
interface FooterProps {
  sections: Array<{
    title: string;
    links: Array<{ label: string; href: string; }>;
  }>;
  socialLinks: Array<{ platform: string; url: string; icon: React.ReactNode; }>;
  copyright: string;
}
```

**Features**:
- Multi-column layout
- Social media icons
- Newsletter signup form
- Copyright notice

---

### 3. Container
**File**: `/components/layout/Container.tsx`

**Purpose**: Content width wrapper with responsive sizing

**Props**:
```typescript
interface ContainerProps {
  size?: 'small' | 'medium' | 'large' | 'full';
  padding?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

**Sizes**:
- small: 48rem (768px)
- medium: 64rem (1024px)
- large: 80rem (1280px)
- full: 100%

---

### 4. Section
**File**: `/components/layout/Section.tsx`

**Purpose**: Page section wrapper with consistent spacing

**Props**:
```typescript
interface SectionProps {
  background?: 'white' | 'gray' | 'blue' | 'gradient';
  padding?: 'none' | 'small' | 'medium' | 'large';
  children: React.ReactNode;
  className?: string;
}
```

**Padding Scale**:
- none: 0
- small: 2rem (mobile) / 4rem (desktop)
- medium: 4rem (mobile) / 6rem (desktop)
- large: 6rem (mobile) / 8rem (desktop)

---

### 5. Grid
**File**: `/components/layout/Grid.tsx`

**Purpose**: Responsive grid layout

**Props**:
```typescript
interface GridProps {
  columns?: 1 | 2 | 3 | 4;
  gap?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  className?: string;
}
```

**Responsive Behavior**:
- Mobile: Always 1 column
- Tablet: 2 columns (if columns >= 2)
- Desktop: Full column count

---

### 6. PageHeader
**File**: `/components/layout/PageHeader.tsx`

**Purpose**: Page title with breadcrumbs

**Props**:
```typescript
interface PageHeaderProps {
  title: string;
  breadcrumbs?: Array<{ label: string; href?: string; }>;
  description?: string;
}
```

---

### 7. Layout
**File**: `/components/layout/Layout.tsx`

**Purpose**: Root layout wrapper

**Props**:
```typescript
interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  showFooter?: boolean;
}
```

---

## UI Components (15)

### 8. Button
**File**: `/components/ui/Button.tsx`

**Purpose**: Primary interaction element

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  className?: string;
}
```

**Variants**:
- primary: Blue background, yellow shadow, hover transform
- secondary: Green background
- outline: Border only, transparent background
- ghost: No border, transparent background
- icon: Square, icon only

---

### 9. HeroSection
**File**: `/components/ui/HeroSection.tsx`

**Purpose**: Full-width hero banner

**Props**:
```typescript
interface HeroSectionProps {
  heading: string;
  subheading?: string;
  cta?: { text: string; href: string; };
  backgroundVariant?: 'glitter' | 'dashlines' | 'solid' | 'image';
  backgroundImage?: string;
}
```

**Features**:
- Responsive text sizing (4rem → 2.5rem)
- Decorative backgrounds from Webflow
- CTA button integration

---

### 10. FeatureCard
**File**: `/components/ui/FeatureCard.tsx`

**Purpose**: Icon + title + description card

**Props**:
```typescript
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: { text: string; href: string; };
}
```

**Features**:
- Hover effect: subtle lift + shadow
- Used in grid layouts (2-4 columns)

---

### 11. WhyCard
**File**: `/components/ui/WhyCard.tsx`

**Purpose**: Larger feature card with decorative elements

**Props**:
```typescript
interface WhyCardProps {
  title: string;
  description: string;
  decorativeElement?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'orange';
}
```

---

### 12. CTASection
**File**: `/components/ui/CTASection.tsx`

**Purpose**: Call-to-action block

**Props**:
```typescript
interface CTASectionProps {
  heading: string;
  description?: string;
  primaryCta: { text: string; href: string; };
  secondaryCta?: { text: string; href: string; };
  background?: 'blue' | 'gradient' | 'image';
}
```

---

### 13. Card
**File**: `/components/ui/Card.tsx`

**Purpose**: Generic card container

**Props**:
```typescript
interface CardProps {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'small' | 'medium' | 'large';
  children: React.ReactNode;
  className?: string;
}
```

---

### 14. Badge
**File**: `/components/ui/Badge.tsx`

**Purpose**: Status/label indicator

**Props**:
```typescript
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}
```

---

### 15. Icon
**File**: `/components/ui/Icon.tsx`

**Purpose**: SVG icon wrapper

**Props**:
```typescript
interface IconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}
```

---

### 16. Image
**File**: `/components/ui/Image.tsx`

**Purpose**: Responsive image with Next.js optimization

**Props**:
```typescript
interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  className?: string;
}
```

---

### 17-22. Additional UI Components
- **Accordion**: Collapsible content sections
- **Tabs**: Tabbed content interface
- **Tooltip**: Hover information display
- **Avatar**: User profile image
- **Divider**: Visual separator
- **Progress**: Progress indicator

---

## Form Components (10)

### 23. Form
**File**: `/components/forms/Form.tsx`

**Purpose**: Form wrapper with validation

**Props**:
```typescript
interface FormProps<T extends FieldValues> {
  onSubmit: (data: T) => Promise<void>;
  schema: ZodSchema<T>;
  children: React.ReactNode;
  className?: string;
}
```

**Features**:
- react-hook-form integration
- Zod schema validation
- Error handling
- Loading states

---

### 24. Input
**File**: `/components/forms/Input.tsx`

**Purpose**: Text input field

**Props**:
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}
```

---

### 25. Textarea
**File**: `/components/forms/Textarea.tsx`

**Purpose**: Multi-line text input

**Props**:
```typescript
interface TextareaProps {
  label: string;
  placeholder?: string;
  rows?: number;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}
```

---

### 26. Select
**File**: `/components/forms/Select.tsx`

**Purpose**: Dropdown selection

**Props**:
```typescript
interface SelectProps {
  label: string;
  options: Array<{ value: string; label: string; }>;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}
```

---

### 27. Checkbox
**File**: `/components/forms/Checkbox.tsx`

**Purpose**: Single checkbox

**Props**:
```typescript
interface CheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
}
```

---

### 28. Radio
**File**: `/components/forms/Radio.tsx`

**Purpose**: Radio button

**Props**:
```typescript
interface RadioProps {
  label: string;
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
}
```

---

### 29. RadioGroup
**File**: `/components/forms/RadioGroup.tsx`

**Purpose**: Radio button group

**Props**:
```typescript
interface RadioGroupProps {
  label: string;
  options: Array<{ value: string; label: string; }>;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
}
```

---

### 30. FileUpload
**File**: `/components/forms/FileUpload.tsx`

**Purpose**: File input with drag-drop

**Props**:
```typescript
interface FileUploadProps {
  label: string;
  accept?: string;
  maxSize?: number; // in MB
  onUpload: (file: File) => Promise<void>;
  error?: string;
  required?: boolean;
}
```

**Features**:
- Drag and drop support
- File type validation
- Size validation
- Upload progress indicator

---

### 31. FormField
**File**: `/components/forms/FormField.tsx`

**Purpose**: Field wrapper with label + error

**Props**:
```typescript
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
}
```

---

### 32. SubmitButton
**File**: `/components/forms/SubmitButton.tsx`

**Purpose**: Form submit button with loading state

**Props**:
```typescript
interface SubmitButtonProps {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}
```

---

## Data Display Components (6)

### 33. Table
**File**: `/components/ui/Table.tsx`

**Purpose**: Data table

**Props**:
```typescript
interface TableProps<T> {
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
  }>;
  data: T[];
  sortable?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
}
```

---

### 34. DataCard
**File**: `/components/ui/DataCard.tsx`

**Purpose**: Stat/metric card

**Props**:
```typescript
interface DataCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; direction: 'up' | 'down'; };
  description?: string;
}
```

---

### 35. EmptyState
**File**: `/components/ui/EmptyState.tsx`

**Purpose**: No data placeholder

**Props**:
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { text: string; onClick: () => void; };
}
```

---

### 36. LoadingSpinner
**File**: `/components/ui/LoadingSpinner.tsx`

**Purpose**: Loading indicator

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}
```

---

### 37. Skeleton
**File**: `/components/ui/Skeleton.tsx`

**Purpose**: Content placeholder

**Props**:
```typescript
interface SkeletonProps {
  variant?: 'text' | 'card' | 'image' | 'circle';
  count?: number;
  className?: string;
}
```

---

### 38. Pagination
**File**: `/components/ui/Pagination.tsx`

**Purpose**: Page navigation

**Props**:
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
}
```

---

## Feedback Components (4)

### 39. Toast
**File**: `/components/ui/Toast.tsx` (shadcn/ui)

**Purpose**: Notification message

**Props**:
```typescript
interface ToastProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}
```

---

### 40. Alert
**File**: `/components/ui/Alert.tsx`

**Purpose**: Inline alert message

**Props**:
```typescript
interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  description: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}
```

---

### 41. Modal
**File**: `/components/ui/Modal.tsx`

**Purpose**: Dialog overlay

**Props**:
```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

---

### 42. ConfirmDialog
**File**: `/components/ui/ConfirmDialog.tsx`

**Purpose**: Confirmation modal

**Props**:
```typescript
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'default' | 'danger';
}
```

---

## Animation Components (3)

### 43. FadeIn
**File**: `/components/animations/FadeIn.tsx`

**Purpose**: Fade in on mount/scroll

**Props**:
```typescript
interface FadeInProps {
  delay?: number;
  duration?: number;
  triggerOnScroll?: boolean;
  children: React.ReactNode;
}
```

**Features**:
- IntersectionObserver for scroll trigger
- Configurable animation timing
- Respects prefers-reduced-motion

---

### 44. SlideIn
**File**: `/components/animations/SlideIn.tsx`

**Purpose**: Slide in animation

**Props**:
```typescript
interface SlideInProps {
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}
```

---

### 45. AnimatedCounter
**File**: `/components/animations/AnimatedCounter.tsx`

**Purpose**: Number count-up animation

**Props**:
```typescript
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}
```

---

## Component Index

**File**: `/components/index.ts`

```typescript
// Layout
export { Navigation } from './layout/Navigation';
export { Footer } from './layout/Footer';
export { Container } from './layout/Container';
export { Section } from './layout/Section';
export { Grid } from './layout/Grid';
export { PageHeader } from './layout/PageHeader';
export { Layout } from './layout/Layout';

// UI
export { Button } from './ui/Button';
export { HeroSection } from './ui/HeroSection';
export { FeatureCard } from './ui/FeatureCard';
export { WhyCard } from './ui/WhyCard';
export { CTASection } from './ui/CTASection';
export { Card } from './ui/Card';
export { Badge } from './ui/Badge';
export { Icon } from './ui/Icon';
export { Image } from './ui/Image';
export { Table } from './ui/Table';
export { DataCard } from './ui/DataCard';
export { EmptyState } from './ui/EmptyState';
export { LoadingSpinner } from './ui/LoadingSpinner';
export { Skeleton } from './ui/Skeleton';
export { Pagination } from './ui/Pagination';
export { Toast } from './ui/Toast';
export { Alert } from './ui/Alert';
export { Modal } from './ui/Modal';
export { ConfirmDialog } from './ui/ConfirmDialog';

// Forms
export { Form } from './forms/Form';
export { Input } from './forms/Input';
export { Textarea } from './forms/Textarea';
export { Select } from './forms/Select';
export { Checkbox } from './forms/Checkbox';
export { Radio } from './forms/Radio';
export { RadioGroup } from './forms/RadioGroup';
export { FileUpload } from './forms/FileUpload';
export { FormField } from './forms/FormField';
export { SubmitButton } from './forms/SubmitButton';

// Animations
export { FadeIn } from './animations/FadeIn';
export { SlideIn } from './animations/SlideIn';
export { AnimatedCounter } from './animations/AnimatedCounter';
```

---

**Total: 45 Components** (39 core + 6 additional UI components)

This specification provides a complete blueprint for building the component library with consistent interfaces, clear responsibilities, and reusable patterns.
