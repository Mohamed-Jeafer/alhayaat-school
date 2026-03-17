---
title: "Phase 4: Database Integration & Interactive Pages"
status: pending
priority: high
dependencies: ["phase-2-component-library", "phase-3-static-pages"]
estimated_hours: 32
phase: 4
---

# Phase 4: Database Integration & Interactive Pages

## Overview
Build interactive pages with forms, integrate database operations, and set up email notifications. This phase brings dynamic functionality to the website.

## Goals
- Build Contact page with form submission
- Build Careers page with job applications
- Build Donate page (without Stripe initially)
- Build Application form page
- Create API routes for all forms
- Integrate email service (Resend)
- Implement rate limiting

## Prerequisites
- Phase 2 completed (component library ready)
- Phase 3 completed (static pages built)
- Database queries from Phase 1 available
- Resend API key obtained

## Tasks

### Task 1: Contact Page & API
**Estimated**: 6 hours

**Page**: `app/contact/page.tsx`
**API**: `app/api/contact/route.ts`

**Form Fields**:
- Name (required)
- Email (required)
- Phone (optional)
- Message (required)
- Honeypot field (spam prevention)

**Features**:
- Client-side validation with Zod
- Rate limiting (5 requests/hour per IP)
- Email to admin
- Confirmation email to user
- Toast notifications

**Dependencies**:
```bash
npm install resend
npm install @vercel/rate-limit
```

---

### Task 2: Careers Page & Job Applications
**Estimated**: 8 hours

**Page**: `app/careers/page.tsx`
**API**: `app/api/jobs/apply/route.ts`

**Features**:
- Job listings (hardcoded initially)
- Application form with resume upload
- Upload to Azure Blob Storage
- Store application in database
- Email notification to admin

**Form Fields**:
- Name (required)
- Email (required)
- Position (required, dropdown)
- Resume (required, PDF/DOCX, max 5MB)
- Cover letter (optional)

**Azure Storage Setup**:
```bash
npm install @azure/storage-blob
```

---

### Task 3: Donate Page (Pre-Stripe)
**Estimated**: 4 hours

**Page**: `app/donate/page.tsx`

**Features**:
- Amount selection (preset + custom)
- Donor information form
- Payment methods display
- Progress bar toward goal
- Placeholder for Stripe integration

**Note**: Stripe integration happens in Phase 6

---

### Task 4: Application Form Page
**Estimated**: 6 hours

**Page**: `app/application/page.tsx`
**API**: `app/api/application/route.ts`

**Form Sections**:
1. Student Information
2. Parent/Guardian Information
3. Academic Background
4. Additional Information

**Features**:
- Multi-step form
- Form state persistence
- Document uploads
- Email confirmation

---

### Task 5: Email Integration (Resend)
**Estimated**: 4 hours

**Setup**:
```typescript
// lib/email/client.ts
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)
```

**Email Templates**:
- Contact confirmation
- Admin notification
- Job application confirmation
- Application submission confirmation

**File**: `lib/email/templates.ts`

---

### Task 6: Rate Limiting
**Estimated**: 2 hours

**Implementation**:
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'),
})
```

---

### Task 7: Form Validation Schemas
**Estimated**: 2 hours

**File**: `lib/validations/forms.ts`

```typescript
import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export const jobApplicationSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  position: z.string().min(1, 'Please select a position'),
  resume: z.instanceof(File).refine(
    (file) => file.size <= 5 * 1024 * 1024,
    'Resume must be less than 5MB'
  ),
})
```

---

## Success Criteria

- [x] Contact form submits successfully
- [x] Job applications saved with resume upload
- [x] Emails sent (admin + user confirmation)
- [x] Rate limiting prevents spam
- [x] Form validation works client and server-side
- [x] Error handling robust
- [x] All data persisted to database

---

## Deliverables

1. **Pages**
   - Contact page with form
   - Careers page with listings
   - Donate page (pre-Stripe)
   - Application form page

2. **API Routes**
   - `/api/contact`
   - `/api/jobs/apply`
   - `/api/application`
   - `/api/newsletter/subscribe`

3. **Email System**
   - Resend integration
   - Email templates
   - Notification system

4. **Utilities**
   - Rate limiting
   - Form validation schemas
   - File upload handling

---

## Next Phase

Proceed to **Phase 5: Authentication & Admin Dashboard**
