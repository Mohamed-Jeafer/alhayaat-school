---
id: TASK-015
title: '[P6a] Configure Stripe payment infrastructure'
status: Done
assignee: []
created_date: '2026-03-15 13:11'
updated_date: '2026-03-15 21:21'
labels:
  - stripe
  - infrastructure
  - P6
milestone: m-6
dependencies: []
references:
  - .kiro/specs/phase-6-stripe-integration.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Story Type: INFRASTRUCTURE

**Story**
As a school administrator, I want Stripe payment credentials and webhook configuration deployed to Azure Key Vault so that the application can securely process donations without exposing secrets in source code.

**Business Context**
The Webflow site uses a static Stripe payment link (buy.stripe.com) with no donor data capture, no webhook, and no receipt automation. The migration requires a full Stripe integration using the API — secrets must be stored in Azure Key Vault (not env files) to meet production security requirements.

**Technical Specification**
- Rendering: N/A — infrastructure only
- Data: Azure Key Vault secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Infrastructure: Azure Key Vault (existing), Azure App Service environment variable binding, Stripe Dashboard webhook endpoint configuration
- Stack constraints: `npm install stripe @stripe/stripe-js`; Stripe instance initialized as singleton in `lib/stripe.ts` — never instantiate inside a route or component
- Phase dependencies: TASK-006 (Azure infrastructure), TASK-001 (GitHub repo)
- Spec reference: `.kiro/specs/phase-6-stripe-integration.md`

**Stripe Configuration Steps**
1. Create product: "Donation to Al-Hayaat School" (currency: CAD)
2. Enable payment methods: Card, Apple Pay, Google Pay
3. Register webhook endpoint: `https://www.alhayaat.ca/api/stripe/webhook`
4. Listen for events: `checkout.session.completed`, `payment_intent.payment_failed`
5. Copy `STRIPE_WEBHOOK_SECRET` to Key Vault
6. For local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

**Singleton Pattern**
```typescript
// lib/stripe.ts — singleton Stripe client
import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20',
    })
  }
  return stripeInstance
}
```

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| ERR_STRIPE_KEY_MISSING | `STRIPE_SECRET_KEY` not bound to App Service | Deployment blocked; alert via GitHub Actions step |
| ERR_WEBHOOK_SECRET_MISSING | `STRIPE_WEBHOOK_SECRET` not in Key Vault | Webhook endpoint returns 500; alert via App Insights |
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the Next.js app starts in any environment, when lib/stripe.ts is imported, then a single Stripe instance is created using process.env.STRIPE_SECRET_KEY and no duplicate instantiation occurs
- [ ] #2 Given the Azure App Service is deployed, when the app boots, then STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are resolved from Key Vault references with no plain-text secrets in appsettings or source code
- [ ] #3 Given the Stripe Dashboard webhook is configured, when a test checkout.session.completed event is sent via Stripe CLI, then the endpoint at /api/stripe/webhook responds with HTTP 200
- [ ] #4 Given the CI/CD pipeline runs, when the deploy-prod.yml workflow executes, then a verification step confirms all three Stripe environment variables are bound before the deployment proceeds
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
src/lib/stripe.ts singleton created with getStripe() lazy init and ERR_STRIPE_KEY_MISSING guard. Stripe v20.4.1 installed (API version 2026-02-25.clover). deploy-prod.yml verifies STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET before deployment. Azure Bicep Key Vault module configures RBAC for App Service managed identity to read secrets.
<!-- SECTION:FINAL_SUMMARY:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Stripe singleton created in lib/stripe.ts — never instantiated inline in routes or components
- [ ] #2 Three Stripe secrets stored in Azure Key Vault: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- [ ] #3 App Service env var bindings reference Key Vault (not plain text)
- [ ] #4 Stripe CLI local webhook forwarding verified in dev
- [ ] #5 Webhook endpoint registered in Stripe Dashboard pointing to https://www.alhayaat.ca/api/stripe/webhook with checkout.session.completed event
- [ ] #6 Error dictionary doc created via `backlog doc create -t reference "Error dictionary: stripe-setup"` — record doc-NNN ID
- [ ] #7 Application Insights alert configured for ERR_STRIPE_KEY_MISSING and ERR_WEBHOOK_SECRET_MISSING
<!-- DOD:END -->
