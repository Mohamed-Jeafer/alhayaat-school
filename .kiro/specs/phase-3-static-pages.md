---
title: "Phase 3: Content Extraction & Static Pages"
status: pending
priority: high
dependencies: ["phase-2-component-library"]
estimated_hours: 32
phase: 3
---

# Phase 3: Content Extraction & Static Pages

## Overview
Extract content from Webflow HTML files, migrate images, and build static pages using the component library. This phase converts the Webflow design into Next.js pages.

## Goals
- Extract content from Webflow HTML to TypeScript constants
- Build 5 static pages (Home, About, School Plans, Curriculum, Admission)
- Migrate and optimize 128 images
- Configure SEO metadata for all pages
- Implement responsive design

## Prerequisites
- Phase 2 completed (all components available)
- Access to `al-hayaat.webflow/` directory
- Component library tested and working

## Reference Files
- `al-hayaat.webflow/index.html` - Home page content
- `al-hayaat.webflow/about.html` - About page content
- `al-hayaat.webflow/school-plans.html` - School plans content
- `al-hayaat.webflow/academic-and-curriculum.html` - Curriculum content
- `al-hayaat.webflow/admission.html` - Admission page content
- `MIGRATION-PLAN-VALIDATION.md` - Validated page structure

## Tasks

### Task 1: Content Extraction System
**Estimated**: 4 hours

**Acceptance Criteria**:
- [ ] Content extraction utility created
- [ ] TypeScript interfaces for content types
- [ ] Content organized by page

**File Structure**:
```
lib/content/
├── types.ts          # Content type definitions
├── home.ts           # Home page content
├── about.ts          # About page content
├── school-plans.ts   # School plans content
├── curriculum.ts     # Curriculum content
└── admission.ts      # Admission content
```

**Content Types**: `lib/content/types.ts`
```typescript
export interface FeatureCard {
  icon: string
  title: string
  description: string
}

export interface HeroContent {
  heading: string
  subheading: string
  ctaText: string
  ctaHref: string
  backgroundVariant: 'glitter' | 'dashlines' | 'solid'
}

export interface CTASection {
  heading: string
  description: string
  primaryCta: { text: string; href: string }
  secondaryCta?: { text: string; href: string }
}
```

---

### Task 2: Image Migration & Optimization
**Estimated**: 6 hours

**Acceptance Criteria**:
- [ ] All 128 images migrated to `/public/images`
- [ ] Images converted to WebP format
- [ ] Responsive variants generated
- [ ] Image manifest created

**Image Processing**:
```bash
npm install sharp
```

**Script**: `scripts/optimize-images.ts`
```typescript
import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'

const sizes = [375, 768, 1024, 1440, 1920]

async function optimizeImage(inputPath: string, outputDir: string) {
  const filename = path.basename(inputPath, path.extname(inputPath))
  
  // Generate WebP versions at different sizes
  for (const size of sizes) {
    await sharp(inputPath)
      .resize(size, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(path.join(outputDir, `${filename}-${size}w.webp`))
  }
}
```

**Image Organization**:
```
public/images/
├── backgrounds/
│   ├── glitter-bg.webp
│   └── dashlines.webp
├── decorative/
│   ├── Ellipse-*.webp
│   └── Polygon-*.webp
├── photos/
│   └── MUN03*.webp
├── icons/
│   └── *.svg
└── logo/
    └── al-hayaat-logo.png
```

---

### Task 3: Home Page
**Estimated**: 6 hours

**Page**: `app/page.tsx`

**Sections**:
1. Hero section with glitter background
2. Vision statement
3. Feature cards (4 cards)
4. Why Al-Hayaat section
5. Collaborators section
6. Donation progress
7. News/Blog section

**Content File**: `lib/content/home.ts`
```typescript
export const homeContent = {
  hero: {
    heading: 'Al-Hayaat School',
    subheading: 'Bridging education and values',
    ctaText: 'Enroll now',
    ctaHref: '/application',
    backgroundVariant: 'glitter' as const,
  },
  vision: {
    text: 'With constant mindfulness of Allah, the Most High...',
  },
  features: [
    {
      icon: 'faith',
      title: 'Faith-based education',
      description: '...',
    },
    // ... 3 more cards
  ],
  // ... more sections
}
```

**SEO Metadata**:
```typescript
export const metadata: Metadata = {
  title: 'Al-Hayaat School | Bridging Education and Values',
  description: 'Faith-based education with comprehensive curriculum...',
  openGraph: {
    title: 'Al-Hayaat School',
    description: '...',
    images: ['/images/og-image.jpg'],
  },
}
```

---

### Task 4: About Page
**Estimated**: 4 hours

**Page**: `app/about/page.tsx`

**Sections**:
1. Page header with breadcrumbs
2. Mission statement
3. Values section
4. Team section (if applicable)
5. History timeline

**Content**: Extract from `about.html`

---

### Task 5: School Plans Page
**Estimated**: 4 hours

**Page**: `app/school-plans/page.tsx`

**Sections**:
1. Page header
2. Plan overview
3. Grade levels
4. Curriculum highlights
5. Schedule information

**Content**: Extract from `school-plans.html`

---

### Task 6: Curriculum Page
**Estimated**: 4 hours

**Page**: `app/academic-and-curriculum/page.tsx`

**Sections**:
1. Page header
2. Academic philosophy
3. Subject areas
4. studies program
5. Extracurricular activities

**Content**: Extract from `academic-and-curriculum.html`

---

### Task 7: Admission Page
**Estimated**: 4 hours

**Page**: `app/admission/page.tsx`

**Note**: This page was identified in validation but not in original plan

**Sections**:
1. Page header
2. Admission process
3. Requirements
4. Important dates
5. CTA to application form

**Content**: Extract from `admission.html`

---

## SEO Configuration

### Sitemap
**File**: `app/sitemap.ts`
```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.alhayaat.ca',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://www.alhayaat.ca/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // ... all pages
  ]
}
```

### Robots.txt
**File**: `app/robots.ts`
```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://www.alhayaat.ca/sitemap.xml',
  }
}
```

### JSON-LD Structured Data
```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'School',
  name: 'Al-Hayaat School',
  url: 'https://www.alhayaat.ca',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CA',
  },
}
```

---

## Responsive Design Checklist

- [ ] Mobile (375px): Single column, stacked layout
- [ ] Tablet (768px): 2-column grids
- [ ] Desktop (1440px): Full layout with proper spacing
- [ ] Images responsive with proper sizes prop
- [ ] Navigation mobile menu working
- [ ] Touch targets minimum 44x44px

---

## Success Criteria

- [x] All 5 pages built and match Webflow design
- [x] Content separated into TypeScript constants
- [x] Images optimized (WebP format)
- [x] SEO metadata configured for all pages
- [x] Sitemap and robots.txt generated
- [x] Mobile responsive at all breakpoints
- [x] Lighthouse score 90+ (initial)
- [x] No console errors

---

## Deliverables

1. **Pages**
   - Home (`app/page.tsx`)
   - About (`app/about/page.tsx`)
   - School Plans (`app/school-plans/page.tsx`)
   - Curriculum (`app/academic-and-curriculum/page.tsx`)
   - Admission (`app/admission/page.tsx`)

2. **Content Files**
   - `lib/content/home.ts`
   - `lib/content/about.ts`
   - `lib/content/school-plans.ts`
   - `lib/content/curriculum.ts`
   - `lib/content/admission.ts`

3. **Images**
   - 128 optimized images in `/public/images`
   - Responsive variants
   - Image manifest

4. **SEO**
   - Sitemap
   - Robots.txt
   - Metadata for all pages
   - JSON-LD structured data

---

## Next Phase

After completing Phase 3, proceed to **Phase 4: Database Integration & Interactive Pages**
