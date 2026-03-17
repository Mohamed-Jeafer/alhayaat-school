---
title: "Phase 1: Foundation & Design System"
status: pending
priority: high
dependencies: ["phase-0-infrastructure-setup"]
estimated_hours: 24
phase: 1
---

# Phase 1: Foundation & Design System

## Overview
Extract the design system from Webflow CSS and establish the foundation for the Next.js application. This includes configuring Tailwind with brand tokens, building base components, and setting up database utilities.

## Goals
- Extract complete design system from Webflow CSS
- Configure Tailwind with brand colors, fonts, and spacing
- Build foundational Button and Typography components
- Set up database connection with pg library
- Create query utility functions

## Prerequisites
- Phase 0 completed (infrastructure deployed)
- Access to `al-hayaat.webflow/css/al-hayaat.webflow.css`
- Database connection string available

## Reference Files
- `al-hayaat.webflow/css/al-hayaat.webflow.css` - Source of design tokens
- `MIGRATION-PLAN-VALIDATION.md` - Validated design system details

## Tasks

### Task 1: Extract Design Tokens from Webflow CSS
**Estimated**: 4 hours

**Acceptance Criteria**:
- [ ] All CSS variables extracted and documented
- [ ] Color palette complete (15 colors)
- [ ] Typography scale documented (6 heading levels)
- [ ] Spacing system extracted
- [ ] Container sizes documented

**Design Tokens to Extract**:

**Colors** (from `:root` variables):
```css
--brand--font-color-black: #1e1e1e
--brand--blue: #1453a5
--brand--yellow: #ffcc29
--brand--green: #097a53
--brand--font-color-white: white
--brand--off-white: #f4f4f4
--brand--orange: #f7932d
--brand--orange-light: #fbbb7d
--brand--off-white-background: #fffcf9
--brand--cyan-light: #8fd4d7
--brand--green-2: #54bf9e
--brand--blue-light: #72b3e2
--brand--cyan: #12b6b5
--brand--yellow-light: #ffe08a
--brand--black: black
```

**Typography**:
- **H1 (Dongle)**: 6.9375rem (111px), line-height: 0.65
- **H1 (Open Sans)**: 4rem (64px), font-weight: 600
- **H2**: 5.625rem (90px), line-height: 0.7
- **H3**: 4rem (64px), line-height: 0.75
- **H4**: 3rem (48px), line-height: 0.8
- **H5**: 2.5rem (40px), line-height: 0.75
- **Body**: IBM Plex Sans, 1rem (16px)

**Spacing**:
- `padding-global`: 2.5rem (40px)
- `padding-section-small`: 3rem (48px)
- `padding-section-medium`: 5rem (80px)
- `padding-section-large`: 8rem (128px)

**Containers**:
- `container-small`: 48rem (768px)
- `container-medium`: 64rem (1024px)
- `container-large`: 80rem (1280px)

**Breakpoints**:
- Mobile: 479px
- Tablet: 991px
- Desktop: 1440px

**Deliverable**: `lib/design-tokens.ts`

---

### Task 2: Configure Tailwind CSS
**Estimated**: 3 hours

**Acceptance Criteria**:
- [ ] Tailwind config extends with brand colors
- [ ] Custom fonts configured
- [ ] Spacing scale matches Webflow
- [ ] Container sizes defined
- [ ] Breakpoints match Webflow

**File**: `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1453a5',
          yellow: '#ffcc29',
          green: '#097a53',
          'green-2': '#54bf9e',
          orange: '#f7932d',
          'orange-light': '#fbbb7d',
          cyan: '#12b6b5',
          'cyan-light': '#8fd4d7',
          'blue-light': '#72b3e2',
          'yellow-light': '#ffe08a',
          'off-white': '#f4f4f4',
          'off-white-bg': '#fffcf9',
          black: '#1e1e1e',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
        display: ['Dongle', 'sans-serif'],
        heading: ['Open Sans', 'sans-serif'],
      },
      fontSize: {
        'h1-display': ['6.9375rem', { lineHeight: '0.65' }],
        'h1': ['4rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h2': ['5.625rem', { lineHeight: '0.7' }],
        'h3': ['4rem', { lineHeight: '0.75' }],
        'h4': ['3rem', { lineHeight: '0.8' }],
        'h5': ['2.5rem', { lineHeight: '0.75' }],
      },
      spacing: {
        'section-sm': '3rem',
        'section-md': '5rem',
        'section-lg': '8rem',
      },
      maxWidth: {
        'container-sm': '48rem',
        'container-md': '64rem',
        'container-lg': '80rem',
      },
      screens: {
        'mobile': '479px',
        'tablet': '991px',
        'desktop': '1440px',
      },
    },
  },
  plugins: [],
}
export default config
```

**Font Setup**: Install Google Fonts
```bash
npm install @next/font
```

**File**: `app/layout.tsx` - Configure fonts
```typescript
import { IBM_Plex_Sans, Dongle, Open_Sans } from 'next/font/google'

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
})

const dongle = Dongle({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-dongle',
})

const openSans = Open_Sans({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-open-sans',
})
```

---

### Task 3: Build Button Component
**Estimated**: 4 hours

**Acceptance Criteria**:
- [ ] Button component with 4 variants (primary, secondary, text, icon)
- [ ] 3 sizes (sm, md, lg)
- [ ] Loading and disabled states
- [ ] TypeScript props interface
- [ ] Accessible (ARIA labels, keyboard navigation)

**Note**: Validation report identified only 4 button variants in Webflow (not 5). Do not implement outline/ghost variants unless explicitly designed.

**File**: `components/ui/Button.tsx`

```typescript
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-brand-blue text-white shadow-[3px_3px_0_0_#ffcc29] hover:translate-x-[3.5px] hover:translate-y-[3.5px] hover:shadow-none',
        secondary: 'bg-brand-green text-white hover:bg-brand-green-2',
        text: 'bg-transparent text-brand-black hover:bg-brand-off-white',
        icon: 'bg-brand-blue text-white hover:bg-brand-blue-light',
      },
      size: {
        sm: 'h-9 px-5 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

**Dependencies**:
```bash
npm install class-variance-authority clsx tailwind-merge lucide-react
```

**Test File**: `components/ui/Button.test.tsx`

---

### Task 4: Build Typography Components
**Estimated**: 3 hours

**Acceptance Criteria**:
- [ ] Heading components (H1-H5) with proper styling
- [ ] Two H1 variants (Dongle display, Open Sans heading)
- [ ] Text component for body text
- [ ] TypeScript props interfaces

**File**: `components/ui/Typography.tsx`

```typescript
import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

// H1 Display (Dongle)
export const H1Display = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn('font-display text-h1-display text-brand-black', className)}
    {...props}
  />
))
H1Display.displayName = 'H1Display'

// H1 Heading (Open Sans)
export const H1 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn('font-heading text-h1 text-brand-black', className)}
    {...props}
  />
))
H1.displayName = 'H1'

// H2-H5 components...
export const H2 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('font-display text-h2 text-brand-black', className)}
    {...props}
  />
))
H2.displayName = 'H2'

// ... H3, H4, H5 similar pattern

// Body Text
export const Text = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('font-sans text-base text-brand-black', className)}
    {...props}
  />
))
Text.displayName = 'Text'
```

---

### Task 5: Database Connection Setup
**Estimated**: 4 hours

**Acceptance Criteria**:
- [ ] pg library installed and configured
- [ ] Connection pool created
- [ ] Environment variables configured
- [ ] Connection tested successfully
- [ ] Error handling implemented

**File**: `lib/db/connection.ts`

```typescript
import { Pool, PoolConfig } from 'pg'

const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}

export const pool = new Pool(poolConfig)

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Database connected')
})

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err)
  process.exit(-1)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await pool.end()
  console.log('Database pool closed')
  process.exit(0)
})
```

**Dependencies**:
```bash
npm install pg
npm install -D @types/pg
```

---

### Task 6: Create Query Utility Functions
**Estimated**: 4 hours

**Acceptance Criteria**:
- [ ] Query functions for all tables
- [ ] Parameterized queries (SQL injection prevention)
- [ ] TypeScript interfaces for data models
- [ ] Error handling
- [ ] Transaction support

**File**: `lib/db/queries.ts`

```typescript
import { pool } from './connection'
import { QueryResult } from 'pg'

// Type definitions
export interface ContactSubmission {
  id: number
  name: string
  email: string
  phone?: string
  message: string
  created_at: Date
}

export interface ContactSubmissionInput {
  name: string
  email: string
  phone?: string
  message: string
}

// Contact submissions
export async function createContactSubmission(
  data: ContactSubmissionInput
): Promise<ContactSubmission> {
  const query = `
    INSERT INTO contact_submissions (name, email, phone, message, created_at)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING *
  `
  const values = [data.name, data.email, data.phone || null, data.message]
  
  try {
    const result: QueryResult<ContactSubmission> = await pool.query(query, values)
    return result.rows[0]
  } catch (error) {
    console.error('Error creating contact submission:', error)
    throw new Error('Failed to create contact submission')
  }
}

export async function getAllContactSubmissions(): Promise<ContactSubmission[]> {
  const query = `
    SELECT * FROM contact_submissions
    ORDER BY created_at DESC
  `
  
  try {
    const result: QueryResult<ContactSubmission> = await pool.query(query)
    return result.rows
  } catch (error) {
    console.error('Error fetching contact submissions:', error)
    throw new Error('Failed to fetch contact submissions')
  }
}

// Similar functions for:
// - Job applications
// - Newsletter subscribers
// - Donations
// - Users
```

**File**: `lib/db/types.ts` - All TypeScript interfaces

---

### Task 7: Create Utility Functions
**Estimated**: 2 hours

**Acceptance Criteria**:
- [ ] cn() utility for className merging
- [ ] Validation helpers
- [ ] Date formatting utilities

**File**: `lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount)
}
```

---

## Verification Steps

### 1. Design Tokens Verification
```bash
# Check Tailwind config
npm run build
# Should compile without errors
```

### 2. Button Component Verification
Create test page: `app/test/page.tsx`
```typescript
import { Button } from '@/components/ui/Button'

export default function TestPage() {
  return (
    <div className="p-8 space-y-4">
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="text">Text Button</Button>
      <Button variant="icon">Icon Button</Button>
      <Button loading>Loading...</Button>
    </div>
  )
}
```

### 3. Database Connection Verification
```bash
# Test connection
node -e "require('./lib/db/connection').pool.query('SELECT NOW()').then(r => console.log(r.rows))"
```

### 4. Query Functions Verification
Create test script: `scripts/test-db.ts`
```typescript
import { createContactSubmission } from '@/lib/db/queries'

async function test() {
  const result = await createContactSubmission({
    name: 'Test User',
    email: 'test@example.com',
    message: 'Test message',
  })
  console.log('Created:', result)
}

test()
```

---

## Success Criteria

- [x] Design tokens extracted and documented
- [x] Tailwind configured with brand colors and fonts
- [x] Button component built with 4 variants
- [x] Typography components created (H1-H5, Text)
- [x] Database connection established
- [x] Query utility functions created
- [x] All components render correctly
- [x] Database queries execute successfully

---

## Deliverables

1. **Design System**
   - `lib/design-tokens.ts`
   - `tailwind.config.ts`
   - Font configuration in `app/layout.tsx`

2. **UI Components**
   - `components/ui/Button.tsx`
   - `components/ui/Typography.tsx`
   - `lib/utils.ts`

3. **Database Layer**
   - `lib/db/connection.ts`
   - `lib/db/queries.ts`
   - `lib/db/types.ts`

4. **Documentation**
   - Design system documentation
   - Component usage examples
   - Database query examples

---

## Next Phase

After completing Phase 1, proceed to **Phase 2: Core Component Library** which will:
- Build 39 reusable components
- Create layout components (Navigation, Footer, Container, etc.)
- Build UI components (HeroSection, FeatureCard, CTASection, etc.)
- Create form components with validation
