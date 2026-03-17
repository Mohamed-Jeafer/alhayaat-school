---
title: "Phase 6: Stripe Integration"
status: pending
priority: high
dependencies: ["phase-4-database-integration"]
estimated_hours: 24
phase: 6
---

# Phase 6: Stripe Integration

## Overview
Implement complete Stripe payment flow for donations including checkout sessions, webhook handling, receipt generation, and thank-you emails.

## Goals
- Set up Stripe account (test + production)
- Build donation flow with Stripe Checkout
- Implement webhook handler for payment confirmation
- Generate PDF tax receipts
- Send thank-you emails with receipts
- Display donations in admin dashboard

## Prerequisites
- Phase 4 completed (donate page exists)
- Stripe account created
- Resend email service configured

## Tasks

### Task 1: Stripe Setup
**Estimated**: 2 hours

**Dependencies**:
```bash
npm install stripe @stripe/stripe-js
```

**Environment Variables**:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Stripe Configuration**:
- Create product: "Donation to Al-Hayaat School"
- Enable payment methods: Card, Apple Pay, Google Pay
- Set up webhook endpoint

---

### Task 2: Donation Page Enhancement
**Estimated**: 4 hours

**Page**: `app/donate/page.tsx` (update existing)

**Features**:
- Amount selection (preset: $25, $50, $100, $250, custom)
- Donor information form
- Payment button → Stripe Checkout
- Loading state during redirect

**Form Fields**:
- Amount (required)
- Donor name (required)
- Email (required)
- Address (optional, for tax receipt)
- Anonymous donation (checkbox)

---

### Task 3: Checkout Session API
**Estimated**: 4 hours

**API**: `app/api/stripe/checkout-session/route.ts`

**Features**:
- Create Stripe Checkout Session
- Store metadata (donor info)
- Return session URL for redirect

```typescript
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const { amount, donorName, donorEmail, donorAddress } = await req.json()
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'cad',
        product_data: {
          name: 'Donation to Al-Hayaat School',
        },
        unit_amount: amount * 100, // Convert to cents
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/donate`,
    metadata: {
      donorName,
      donorEmail,
      donorAddress: donorAddress || '',
    },
  })
  
  return Response.json({ url: session.url })
}
```

---

### Task 4: Webhook Handler
**Estimated**: 6 hours

**API**: `app/api/stripe/webhook/route.ts`

**Features**:
- Verify Stripe signature
- Handle `checkout.session.completed` event
- Save donation to database
- Generate PDF receipt
- Send thank-you email

```typescript
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createDonation } from '@/lib/db/queries'
import { generateReceipt } from '@/lib/pdf/receipt'
import { sendThankYouEmail } from '@/lib/email/donations'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    // Save to database
    const donation = await createDonation({
      amount: session.amount_total! / 100,
      donorName: session.metadata!.donorName,
      donorEmail: session.metadata!.donorEmail,
      stripeSessionId: session.id,
    })
    
    // Generate PDF receipt
    const receiptPdf = await generateReceipt(donation)
    
    // Send email
    await sendThankYouEmail({
      to: session.metadata!.donorEmail,
      donorName: session.metadata!.donorName,
      amount: session.amount_total! / 100,
      receiptPdf,
    })
  }
  
  return Response.json({ received: true })
}
```

---

### Task 5: PDF Receipt Generation
**Estimated**: 4 hours

**Dependencies**:
```bash
npm install @react-pdf/renderer
```

**File**: `lib/pdf/receipt.ts`

**Features**:
- Official tax receipt format
- School logo and information
- Donation details
- Receipt number
- Date and signature

```typescript
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { fontSize: 20, marginBottom: 20 },
  // ... more styles
})

export function DonationReceipt({ donation }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>Al-Hayaat School</Text>
          <Text>Official Donation Receipt</Text>
        </View>
        <View>
          <Text>Receipt No: {donation.id}</Text>
          <Text>Date: {new Date(donation.created_at).toLocaleDateString()}</Text>
          <Text>Donor: {donation.donor_name}</Text>
          <Text>Amount: ${donation.amount.toFixed(2)} CAD</Text>
        </View>
      </Page>
    </Document>
  )
}
```

---

### Task 6: Thank You Email Template
**Estimated**: 2 hours

**File**: `lib/email/templates/donation-thank-you.tsx`

**Features**:
- Personalized message
- Donation amount
- Receipt attached
- Tax information
- Social sharing links

---

### Task 7: Success Page
**Estimated**: 2 hours

**Page**: `app/donate/success/page.tsx`

**Features**:
- Thank you message
- Donation confirmation
- Receipt download link
- Social sharing
- Return to home CTA

**Query Session**:
```typescript
const searchParams = useSearchParams()
const sessionId = searchParams.get('session_id')

// Fetch session details
const session = await stripe.checkout.sessions.retrieve(sessionId)
```

---

## Webhook Configuration

### Local Testing (Stripe CLI)
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Production Setup
1. Add webhook endpoint in Stripe Dashboard
2. URL: `https://www.alhayaat.ca/api/stripe/webhook`
3. Events to listen: `checkout.session.completed`
4. Copy webhook secret to Azure Key Vault

---

## Testing Checklist

### Test Mode
- [ ] Use test card: 4242 4242 4242 4242
- [ ] Checkout session opens
- [ ] Payment succeeds
- [ ] Webhook receives event
- [ ] Donation saved to database
- [ ] Email sent with receipt
- [ ] Receipt PDF generated correctly

### Production Mode
- [ ] Real payment test with small amount
- [ ] Webhook configured in Stripe Dashboard
- [ ] Production keys in Azure Key Vault
- [ ] Email delivery confirmed

---

## Success Criteria

- [x] Checkout session opens successfully
- [x] Test payments complete
- [x] Webhook captures payments
- [x] Donations saved to database
- [x] Thank-you email sent with PDF receipt
- [x] Donations visible in admin dashboard
- [x] Receipt download works
- [x] Error handling robust

---

## Deliverables

1. **Donation Flow**
   - Enhanced donate page
   - Checkout session API
   - Success page

2. **Webhook System**
   - Webhook handler
   - Signature verification
   - Event processing

3. **Receipt System**
   - PDF generation
   - Email templates
   - Receipt download

4. **Admin Integration**
   - Donations table in admin
   - Stripe session details
   - Receipt regeneration

---

## Security Considerations

- Verify webhook signatures
- Store Stripe keys in Key Vault
- Use HTTPS in production
- Validate amounts server-side
- Rate limit checkout creation

---

## Next Phase

Proceed to **Phase 7: Polish & Optimization**
