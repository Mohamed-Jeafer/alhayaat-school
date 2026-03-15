---
id: TASK-013
title: >-
  [P2] Build HeroSection component with background variants and CTA so key pages
  have a high-impact entry point
status: To Do
assignee: []
created_date: '2026-03-15 13:06'
labels:
  - phase-2
  - component-library
  - ui
milestone: m-2
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a prospective parent visiting the Al-Hayaat School website, I want to see a full-width hero section with the school's headline, subtext, and a clear call-to-action button, so that I immediately understand the school's value proposition and know how to take the next step.

**Business Context**
The Webflow hero uses a background image with overlaid text in non-semantic markup — poor LCP score (~3.2s) and inaccessible to screen readers. Replacing with `next/image` priority loading and semantic HTML targets LCP under 2.5s and achieves WCAG 2.1 AA compliance.

**Technical Specification**
- Rendering: SSG — hero content is static, sourced from `src/content/{page}.json`
- Data: Static props from page content JSON (headline, subtext, CTA label, CTA href, backgroundVariant, backgroundImage)
- Infrastructure: Static asset served from Azure CDN via App Service
- Stack constraints: `next/image` with `priority` flag, shadcn/ui `Button`, Tailwind responsive classes, backgroundVariant prop (`glitter` | `dashlines` | `solid` | `image`) — no inline styles
- Phase dependencies: TASK-013 (Section/Container primitives), P1 design tokens
- Spec reference: `.kiro/specs/phase-2-component-library.md`

**Error Handling**
| Code | Meaning | UI Recovery |
|------|---------|-------------|
| Image 404 | Hero background image missing | Show solid colour fallback using brand primary token |
| Empty headline | Content JSON has blank headline field | Render placeholder text in dev, log warning to App Insights |
| CTA href broken | Link resolves to 404 | Log to App Insights, button still renders |

**Content Extraction**
- Source file: `al-hayaat.webflow/index.html`
- Target file: `src/content/home.json`
- Sections to extract: `home-hero`
- Shared content: None — hero is page-specific per page
- Webflow markup patterns: `.section.hero-section` with inline background-image style — extract image filename only, resolve path via next/image
- Extraction example:
```json
{
  "hero": {
    "id": "home-hero",
    "headline": "Al-Hayaat School",
    "subtext": "Nurturing young minds through academic excellence and spiritual development",
    "cta": { "label": "Enroll Now", "href": "/admissions" },
    "backgroundVariant": "glitter",
    "backgroundImage": "hero-bg.webp"
  }
}
```

**Reusable Components**
- `HeroSection` — full-width hero with background variants and CTA (new), `src/components/ui/HeroSection.tsx`
- `Button` — shadcn/ui CTA button (reuse from P1), `src/components/ui/Button.tsx`
- `Section` — page section wrapper (reuse from TASK-013), `src/components/layout/Section.tsx`

**Testing & Validation**
- Unit: render with all 4 backgroundVariant values, render with missing image (solid fallback), snapshot test
- Unit: render without CTA prop — CTA button must not render
- Visual: compare against Webflow home page hero at 375px, 768px, 1440px
- Lighthouse targets: Performance >90 (LCP target <2.5s), Accessibility >95
- axe-core: zero critical violations, non-empty alt attribute on hero image

**Recommended Skills**
- `#senior-fullstack` — Next.js Image optimisation, SSG data flow, component architecture
- `#frontend-design` — responsive hero layout, Tailwind utility classes, visual fidelity to Webflow source

**Story Points**: 3
*Sizing rationale: Single well-defined component with static data and content extraction — no API or DB work.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the home page loads - When the HeroSection renders - Then the headline, subtext, and CTA button are visible above the fold on desktop at 1440px with the correct background variant
- [ ] #2 Given the hero image is present - When the HeroSection renders - Then next/image loads the image with the priority flag and a non-empty alt attribute
- [ ] #3 Given backgroundVariant='glitter' is passed - When the HeroSection renders - Then the decorative glitter pattern displays without inline styles
- [ ] #4 Edge case: missing image - Given backgroundImage prop is absent - When HeroSection renders - Then a solid brand-colour fallback displays and no broken image icon appears
- [ ] #5 Edge case: mobile viewport - Given the user is on a 375px wide screen - When the HeroSection renders - Then text is legible at min 16px, the CTA button is full-width, and no horizontal scroll occurs
- [ ] #6 Edge case: no CTA - Given no cta prop is passed - When HeroSection renders - Then no button renders and no console error is thrown
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 src/content/home.json created with home-hero section extracted from al-hayaat.webflow/index.html
- [ ] #3 All hero text sourced from content JSON — no hardcoded strings in JSX
- [ ] #4 Content block IDs follow {page}-{section}-{element} convention
- [ ] #5 No raw <img> tags — next/image used with priority flag
- [ ] #6 No inline styles — background variants use Tailwind design tokens
- [ ] #7 WCAG 2.1 AA checked (manual + axe-core) — image alt text present
- [ ] #8 Lighthouse Performance >90 and Accessibility >95
- [ ] #9 Verification script passes (scripts/verify/)
<!-- DOD:END -->
