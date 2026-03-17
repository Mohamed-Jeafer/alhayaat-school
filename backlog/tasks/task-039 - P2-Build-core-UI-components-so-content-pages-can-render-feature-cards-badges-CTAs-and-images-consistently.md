---
id: TASK-039
title: >-
  [P2] Build core UI components so content pages can render feature cards,
  badges, CTAs, and images consistently
status: Done
assignee: []
created_date: '2026-03-15 13:21'
updated_date: '2026-03-16 05:04'
labels:
  - phase-2
  - ui-components
  - core
milestone: m-2
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a frontend developer building content-heavy pages for the Al-Hayaat School site, I want core UI components (FeatureCard, WhyCard, CTASection, Card, Badge, Icon, Image), so that features, highlights, and calls-to-action render consistently across multiple pages without duplicating layout and style logic.

**Business Context**
These seven components appear on the home page, about page, programs page, and admissions page. Without them, each page would implement its own card, badge, and CTA pattern leading to visual and code inconsistency.

**Technical Specification**
- Rendering: All Server Components - no interactivity needed
- Data: Props-driven - all text and image props passed from parent pages which source from content JSON files
- Infrastructure: N/A
- Stack constraints: shadcn/ui Card as base for Card component, lucide-react for Icon, next/image wrapper for Image, Tailwind for variants
- Phase dependencies: TASK-038 (layout primitives for composition), TASK-013 (HeroSection - already built)
- Spec reference: .kiro/specs/phase-2-component-library.md, docs/COMPONENT-LIBRARY-SPEC.md

**Component Props**
| Component | Key Props |
|-----------|-----------|
| FeatureCard | icon, title, description, variant?: 'default' or 'highlighted' |
| WhyCard | icon, title, description, index: number |
| CTASection | heading, body, primaryCta: LinkProps, secondaryCta?: LinkProps, variant?: 'primary' or 'secondary' |
| Card | children, className?, hover?: boolean |
| Badge | label, variant?: 'default' or 'primary' or 'success' or 'warning' or 'error' |
| Icon | name: LucideIconName, size?: 'sm' or 'md' or 'lg', className? |
| Image | src, alt, width?, height?, fill?, className? |

**Reusable Components**
- FeatureCard, src/components/ui/FeatureCard.tsx
- WhyCard, src/components/ui/WhyCard.tsx
- CTASection, src/components/ui/CTASection.tsx
- Card, src/components/ui/Card.tsx (wraps shadcn Card)
- Badge, src/components/ui/Badge.tsx (wraps shadcn Badge)
- Icon, src/components/ui/Icon.tsx (wraps lucide-react)
- Image, src/components/ui/Image.tsx (wraps next/image)

**Testing & Validation**
- Unit: FeatureCard all variants - verify icon, title, description render with correct variant class
- Unit: Badge each variant - verify text contrast meets WCAG AA
- Unit: Image - verify alt prop passed through, never empty string
- Visual: compare FeatureCard and CTASection against Webflow home page at 375px, 768px, 1440px
- Lighthouse Accessibility >95

**Recommended Skills**
- `#senior-fullstack` - shadcn/ui composition, lucide-react icon mapping
- `#frontend-design` - card layout, badge colour contrast, CTA hierarchy

**Story Points**: 5
*Sizing rationale: Seven components covering multiple page sections - FeatureCard and CTASection have multiple variants adding moderate complexity.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given a FeatureCard is rendered - When the component renders - Then it shows an icon, title, and description with the correct variant colour applied
- [ ] #2 Given a CTASection is rendered with primary variant - When the component renders - Then the background, heading, body text, and button are all visible and sourced from props
- [ ] #3 Given a Badge is rendered with any variant - When the component renders - Then the text has sufficient colour contrast against its background
- [ ] #4 Given an Image component wraps next/image - When rendered without an explicit alt prop - Then it reads alt from the content JSON and never renders an empty alt string
- [ ] #5 Edge case: missing icon - Given a FeatureCard receives an undefined icon prop - When it renders - Then a default placeholder icon renders without crashing
- [ ] #6 Edge case: mobile viewport - Given any core UI component renders on a 375px screen - When the layout responds - Then no text or element overflows the viewport width
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 FeatureCard, WhyCard, CTASection, Card, Badge, Icon, and Image components exported from src/components/ui/index.ts
- [ ] #3 All variants use design tokens - no hardcoded hex colour values
- [ ] #4 TypeScript props interfaces exported alongside each component
- [ ] #5 axe-core zero critical violations on each component in isolation
<!-- DOD:END -->
