---
title: "Phase 5: Authentication & Admin Dashboard"
status: pending
priority: high
dependencies: ["phase-4-database-integration"]
estimated_hours: 32
phase: 5
---

# Phase 5: Authentication & Admin Dashboard

## Overview
Implement authentication system and build admin dashboard for managing submissions, applications, and content. This phase provides the backend management interface.

## Goals
- Set up NextAuth.js with credentials provider
- Create login page with secure authentication
- Protect admin routes with middleware
- Build admin dashboard with overview stats
- Create data tables for all submissions
- Implement CSV export functionality

## Prerequisites
- Phase 4 completed (database integration working)
- Database queries available
- User table created in database

## Tasks

### Task 1: NextAuth.js Setup
**Estimated**: 6 hours

**Dependencies**:
```bash
npm install next-auth bcryptjs
npm install -D @types/bcryptjs
```

**File**: `app/api/auth/[...nextauth]/route.ts`

**Features**:
- Credentials provider
- Password hashing with bcrypt
- Session management
- Database session storage

**Environment Variables**:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
```

---

### Task 2: Login Page
**Estimated**: 4 hours

**Page**: `app/login/page.tsx`

**Features**:
- Email + password form
- Client-side validation
- Error messages
- Redirect to /admin on success
- Remember me option

**Form Fields**:
- Email (required)
- Password (required)
- Remember me (checkbox)

---

### Task 3: Middleware for Route Protection
**Estimated**: 3 hours

**File**: `middleware.ts`

**Protected Routes**:
- `/admin/*` - Requires authentication
- Redirect to `/login` if not authenticated

```typescript
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/login',
  },
})

export const config = {
  matcher: ['/admin/:path*'],
}
```

---

### Task 4: Admin Dashboard Overview
**Estimated**: 6 hours

**Page**: `app/admin/page.tsx`

**Features**:
- Overview cards with stats
- Recent submissions preview
- Quick actions
- Charts (optional)

**Stats to Display**:
- Total contact submissions
- Total job applications
- Newsletter subscribers
- Total donations amount
- Recent activity

**Components**:
- DataCard for stats
- Table for recent items
- Charts (optional, using recharts)

---

### Task 5: Contact Submissions Table
**Estimated**: 4 hours

**Page**: `app/admin/contacts/page.tsx`

**Features**:
- Paginated table (10 per page)
- Search by name/email
- Sort by date
- View full message in modal
- Export to CSV
- Mark as read/unread

**Table Columns**:
- Name
- Email
- Phone
- Message (truncated)
- Date
- Actions

---

### Task 6: Job Applications Table
**Estimated**: 4 hours

**Page**: `app/admin/applications/page.tsx`

**Features**:
- Paginated table
- Filter by position
- Download resume
- View application details
- Export to CSV
- Status tracking (new/reviewed/contacted)

---

### Task 7: Newsletter Subscribers
**Estimated**: 2 hours

**Page**: `app/admin/newsletter/page.tsx`

**Features**:
- List of subscribers
- Export to CSV
- Unsubscribe functionality
- Search by email

---

### Task 8: Donations Table
**Estimated**: 3 hours

**Page**: `app/admin/donations/page.tsx`

**Features**:
- List of donations
- Total amount calculation
- Filter by date range
- Export to CSV
- Stripe session details

---

## CSV Export Functionality

**Utility**: `lib/utils/csv-export.ts`

```typescript
export function exportToCSV(data: any[], filename: string) {
  const csv = convertToCSV(data)
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}
```

---

## Initial Admin User Setup

**Script**: `scripts/create-admin.ts`

```typescript
import bcrypt from 'bcryptjs'
import { pool } from '@/lib/db/connection'

async function createAdmin() {
  const email = 'admin@alhayaat.ca'
  const password = 'change-this-password'
  const hashedPassword = await bcrypt.hash(password, 10)
  
  await pool.query(
    'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
    [email, hashedPassword, 'admin']
  )
  
  console.log('Admin user created')
}

createAdmin()
```

---

## Success Criteria

- [x] Login works with valid credentials
- [x] Protected routes redirect to login
- [x] Admin dashboard displays stats
- [x] Data tables show all submissions
- [x] Pagination works
- [x] Search and filter work
- [x] CSV export works
- [x] Session persists across refreshes

---

## Deliverables

1. **Authentication**
   - NextAuth.js configured
   - Login page
   - Middleware for route protection

2. **Admin Pages**
   - Dashboard overview
   - Contact submissions table
   - Job applications table
   - Newsletter subscribers
   - Donations table

3. **Utilities**
   - CSV export function
   - Admin user creation script

---

## Next Phase

Proceed to **Phase 6: Stripe Integration**
