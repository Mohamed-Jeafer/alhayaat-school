---
id: TASK-134
title: >-
  Future: Expand Stripe webhook beyond checkout.session.completed — subscribe to
  additional events and productize reactions
status: To Do
assignee: []
created_date: '2026-04-20 00:24'
labels:
  - stripe
  - webhooks
  - backlog
  - enhancement
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Today the app only handles checkout.session.completed in handleDonationWebhook (donation.service.ts). Stripe allows many event types; subscribing broadly (or by curated categories) enables richer automation, observability, and customer experience without changing the happy-path donation flow until each handler is implemented.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Document which Stripe events are candidates vs explicitly out of scope (PCI, idempotency, replay)
- [ ] #2 Decide webhook API version alignment with src/lib/stripe.ts apiVersion
- [ ] #3 Implement new handlers incrementally behind feature flags or safe no-ops with structured logging
<!-- AC:END -->
