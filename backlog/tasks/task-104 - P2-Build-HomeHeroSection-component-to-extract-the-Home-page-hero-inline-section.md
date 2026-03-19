---
id: TASK-104
title: >-
  [P2] Build HomeHeroSection component to extract the Home page hero inline
  section
status: Done
assignee: []
created_date: '2026-03-19 15:16'
updated_date: '2026-03-19 17:50'
labels:
  - UI_COMPONENT
  - section-componentization
  - refactor
milestone: m-2
dependencies:
  - TASK-099
references:
  - docs/plans/2026-03-19-section-componentization-design.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
## Story
As a prospective parent visiting the school website, I want the home page hero to load fast with the school headline, subtext, and CTA clearly visible above the fold, so that I immediately understand the school's value proposition.

## Business Context
The Home page hero is the highest-visibility section on the site — it is the first thing every visitor sees. Currently it is 40+ lines of inline JSX in `src/app/page.tsx` with background images (glitter, dashlines, dots), a headline, subtext, and a CTA button. Extracting it to `HomeHeroSection` makes it replaceable with a single import swap and enables isolated testing of the above-the-fold experience.

## Technical Specification
- Create `src/components/sections/HomeHeroSection.tsx`
- Props: `{ headline: string; subtext: string; cta: { label: string; href: string }; className?: string }`
- Background decorative images (glitter, dashlines, dots) handled internally via `next/image` with `fill` or explicit sizing
- Uses `next/image` with `priority` flag for above-the-fold images
- Remove inline hero JSX from `src/app/page.tsx` and replace with `<HomeHeroSection {...content.hero} />`
- Rendering: SSG — hero content is static
- Stack constraints: Tailwind only, `next/image` exclusively, shadcn/ui Button, no inline styles
- Phase dependencies: TASK-099 (sections/ barrel)
- Spec reference: `docs/plans/2026-03-19-section-componentization-design.md`

## Content Extraction
- Source file: `al-hayaat.webflow/index.html`
- Target file: `src/content/home.json`
- Sections to extract: `home-hero`
- Shared content: None — hero is page-specific
- Webflow markup patterns: Background image in inline style; extract image filenames and alt text
- Extraction example:
```json
{
  "hero": {
    "id": "home-hero",
    "headline": "Al-Hayaat School",
    "subtext": "Nurturing young minds through academic excellence and spiritual development",
    "cta": { "label": "Enroll now", "href": "/admissions" }
  }
}
```

## Reusable Components
- `HomeHeroSection` — `src/components/sections/HomeHeroSection.tsx`
- `Button` — shadcn/ui Button with variant support

## Testing & Validation
- Unit: render with all props, render with missing optional className, snapshot
- Visual: compare against `al-hayaat.webflow/index.html` hero at 375px, 768px, 1440px
- Lighthouse targets: Performance >90 (priority image load), Accessibility >95, SEO >90
- axe-core: hero image has non-empty alt attribute, CTA button has accessible label

## Recommended Skills
- `#senior-fullstack` — Next.js Image optimization, component extraction
- `#frontend-design` — hero layout fidelity, background image layering

## Story Points: 3
*Sizing rationale: Complex background layer setup, priority image loading, CTA wiring, content JSON extraction.*

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 `src/components/sections/HomeHeroSection.tsx` created with typed props
- [ ] #2 Added to `src/components/sections/index.ts`
- [ ] #3 Inline hero JSX removed from `src/app/page.tsx`
- [ ] #4 All hero text sourced from `src/content/home.json` — no hardcoded strings
- [ ] #5 `next/image` with `priority` used for above-the-fold image
- [ ] #6 No raw `<img>` tags
- [ ] #7 No inline styles
- [ ] #8 WCAG 2.1 AA: hero image has descriptive alt text, CTA button is keyboard-accessible
- [ ] #9 Lighthouse Performance >90 on Home page
- [ ] #10 Code reviewed and merged to `develop`
<!-- SECTION:DESCRIPTION:END -->

<!-- DOD:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given the Home page loads, When HomeHeroSection renders, Then the headline, subtext, and CTA button are visible above the fold on desktop (1440px) and match the Webflow source
- [ ] #2 Given the Home page loads, When the hero image renders, Then it uses next/image with priority flag and has a non-empty alt attribute
- [ ] #3 Given a slow 3G connection, When the Home page loads, Then a low-quality placeholder displays until the full hero image loads
- [ ] #4 Given the user is on a 375px wide screen, When HomeHeroSection renders, Then the text is legible (min 16px), the CTA button is full-width and tappable, and no horizontal scroll occurs
- [ ] #5 Given a developer swaps HomeHeroSection for a different component in page.tsx, When the page renders, Then the hero area is fully replaced with zero residual inline JSX from the old implementation
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Extracted 33-line hero section from src/app/page.tsx into HomeHeroSection component. Props: headline, subtext, cta, background (glitter/dashlines/dots), className?. All three background images use next/image with priority on glitter. Barrel updated. Zero TS errors. page.tsx is shorter.
<!-- SECTION:FINAL_SUMMARY:END -->
