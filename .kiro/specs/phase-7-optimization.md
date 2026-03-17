---
title: "Phase 7: Polish & Optimization"
status: pending
priority: medium
dependencies: ["phase-6-stripe-integration"]
estimated_hours: 32
phase: 7
---

# Phase 7: Polish & Optimization

## Overview
Optimize performance, add animations, improve SEO, and polish the user experience. This phase ensures the website is production-ready with excellent performance scores.

## Goals
- Add Framer Motion animations throughout
- Optimize images and fonts
- Implement lazy loading
- Enhance SEO with metadata and structured data
- Achieve Lighthouse score 95+
- Add error boundaries and loading states
- Implement accessibility improvements

## Prerequisites
- All previous phases completed
- Website functional end-to-end

## Tasks

### Task 1: Framer Motion Animations
**Estimated**: 8 hours

**Dependencies**:
```bash
npm install framer-motion
```

**Animations to Add**:
1. Hero section fade-in
2. Feature cards stagger animation
3. Scroll-triggered animations
4. Button hover effects
5. Mobile menu slide-in
6. Page transitions

**Implementation**:
```typescript
// components/animations/FadeIn.tsx
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}
```

**Accessibility**:
- Respect `prefers-reduced-motion`
- Keep animations subtle (0.3-0.5s)
- No animations that cause motion sickness

---

### Task 2: Image Optimization
**Estimated**: 4 hours

**Optimizations**:
1. Replace all `<img>` with Next.js `<Image>`
2. Add proper `sizes` prop
3. Use `priority` for above-fold images
4. Lazy load below-fold images
5. Ensure all images have alt text

**Example**:
```typescript
import Image from 'next/image'

<Image
  src="/images/hero-bg.webp"
  alt="Al-Hayaat School building"
  width={1920}
  height={1080}
  sizes="100vw"
  priority
  quality={85}
/>
```

---

### Task 3: Font Optimization
**Estimated**: 2 hours

**Optimizations**:
1. Use `next/font/google`
2. Preload critical fonts
3. Add `font-display: swap`
4. Subset fonts if possible

**Implementation**:
```typescript
import { IBM_Plex_Sans, Dongle, Open_Sans } from 'next/font/google'

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})
```

---

### Task 4: SEO Enhancement
**Estimated**: 6 hours

**Tasks**:
1. Add metadata to all pages
2. Create Open Graph images
3. Add Twitter Card metadata
4. Implement JSON-LD structured data
5. Create dynamic sitemap
6. Optimize robots.txt

**Structured Data Types**:
- School (homepage)
- LocalBusiness (contact page)
- JobPosting (careers page)
- BreadcrumbList (all pages)

**Example**:
```typescript
export const metadata: Metadata = {
  title: 'Al-Hayaat School',
  description: 'Faith-based education...',
  openGraph: {
    title: 'Al-Hayaat School',
    description: '...',
    url: 'https://www.alhayaat.ca',
    siteName: 'Al-Hayaat School',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
    }],
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Al-Hayaat School',
    description: '...',
    images: ['/og-image.jpg'],
  },
}
```

---

### Task 5: Performance Optimization
**Estimated**: 6 hours

**Optimizations**:
1. Code splitting with dynamic imports
2. Lazy load non-critical components
3. Add loading.tsx for route segments
4. Add error.tsx for error boundaries
5. Optimize bundle size
6. Implement route prefetching

**Dynamic Imports**:
```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
})
```

**Bundle Analysis**:
```bash
npm install @next/bundle-analyzer
```

---

### Task 6: Error Boundaries & Loading States
**Estimated**: 4 hours

**Files to Create**:
- `app/error.tsx` - Global error boundary
- `app/loading.tsx` - Global loading state
- `app/admin/error.tsx` - Admin error boundary
- `app/admin/loading.tsx` - Admin loading state

**Error Boundary**:
```typescript
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

---

### Task 7: Accessibility Audit
**Estimated**: 4 hours

**Checklist**:
- [ ] All images have alt text
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Form labels associated with inputs
- [ ] Error messages accessible

**Tools**:
- Axe DevTools
- Lighthouse accessibility audit
- Screen reader testing (NVDA/JAWS)

---

## Lighthouse Optimization Targets

### Performance: 95+
- First Contentful Paint < 1.8s
- Largest Contentful Paint < 2.5s
- Total Blocking Time < 200ms
- Cumulative Layout Shift < 0.1

### Accessibility: 100
- All WCAG AA criteria met
- Proper ARIA usage
- Keyboard navigation

### Best Practices: 100
- HTTPS enabled
- No console errors
- Proper image formats

### SEO: 100
- Meta descriptions
- Proper heading structure
- Mobile-friendly
- Structured data

---

## Success Criteria

- [x] Lighthouse Performance 95+
- [x] Lighthouse Accessibility 100
- [x] Lighthouse SEO 100
- [x] Animations smooth (60fps)
- [x] No console errors
- [x] All images optimized
- [x] Fonts optimized
- [x] Error boundaries working
- [x] Loading states implemented

---

## Deliverables

1. **Animations**
   - Framer Motion integrated
   - Scroll animations
   - Page transitions

2. **Performance**
   - Images optimized
   - Fonts optimized
   - Code splitting
   - Bundle size reduced

3. **SEO**
   - Metadata complete
   - Structured data
   - Sitemap
   - Open Graph images

4. **Error Handling**
   - Error boundaries
   - Loading states
   - Fallback UI

5. **Accessibility**
   - WCAG AA compliant
   - Keyboard navigation
   - Screen reader friendly

---

## Next Phase

Proceed to **Phase 8: Testing & Deployment**
