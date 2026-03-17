---
id: TASK-045
title: >-
  [P2] Build animation components so page sections and counters animate smoothly
  while respecting reduced-motion preferences
status: Done
assignee: []
created_date: '2026-03-15 13:24'
updated_date: '2026-03-15 23:46'
labels:
  - phase-2
  - ui-components
  - animation
milestone: m-2
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a frontend developer building the home page and stats sections of the Al-Hayaat School site, I want animation components (FadeIn, SlideIn, AnimatedCounter), so that page sections reveal smoothly on scroll and statistics animate on view, matching the visual polish of the original Webflow site.

**Business Context**
The Webflow site uses scroll-triggered fade and slide animations on section reveals, and animated number counters on the stats section of the home page. These three components replicate that behaviour in Next.js while respecting the prefers-reduced-motion accessibility setting.

**Technical Specification**
- Rendering: Client Components - require IntersectionObserver for scroll-triggered reveal
- Data: N/A - animation behaviour controlled by props
- Infrastructure: N/A
- Stack constraints: IntersectionObserver for scroll trigger, Tailwind CSS animation classes, requestAnimationFrame for AnimatedCounter, no Framer Motion or GSAP (keep bundle lean)
- Phase dependencies: None - these are purely visual enhancement components
- Spec reference: .kiro/specs/phase-2-component-library.md, docs/COMPONENT-LIBRARY-SPEC.md

**Component Props**
| Component | Key Props |
|-----------|-----------|
| FadeIn | children, duration?: number (ms), delay?: number (ms), once?: boolean |
| SlideIn | children, direction?: 'up' or 'down' or 'left' or 'right', duration?: number, delay?: number |
| AnimatedCounter | target: number, duration?: number (ms), suffix?: string, prefix?: string |

**Reusable Components**
- FadeIn, src/components/ui/FadeIn.tsx
- SlideIn, src/components/ui/SlideIn.tsx
- AnimatedCounter, src/components/ui/AnimatedCounter.tsx

**Testing & Validation**
- Unit: FadeIn - verify opacity class applied on mount, removed when intersection observed
- Unit: AnimatedCounter - verify value reaches target after duration ms
- Unit: reduced motion - verify no animation class applied when prefers-reduced-motion active
- Visual: home page stats section animation at 375px and 1440px
- Lighthouse Performance >90 (verify animations do not cause layout shift)

**Recommended Skills**
- `#senior-fullstack` - IntersectionObserver, requestAnimationFrame, CSS transitions
- `#frontend-design` - animation easing, scroll reveal timing

**Story Points**: 3
*Sizing rationale: Three animation components - IntersectionObserver and requestAnimationFrame add moderate complexity, but no third-party animation library keeps it contained.*
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given a FadeIn wraps a component - When the parent renders - Then the child fades in with a configurable duration and delay
- [ ] #2 Given a SlideIn wraps a component - When the parent renders - Then the child slides in from the configured direction (up, down, left, or right)
- [ ] #3 Given an AnimatedCounter renders - When the component mounts - Then the number animates from 0 to the target value over the specified duration
- [ ] #4 Edge case: reduced motion - Given the user has prefers-reduced-motion set to reduce - When any animation component renders - Then the animation is skipped and content appears immediately without motion
- [ ] #5 Edge case: AnimatedCounter with large value - Given the target value is 10000 - When the counter animates - Then it reaches the exact target value without rounding errors
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code reviewed and merged to develop
- [ ] #2 FadeIn, SlideIn, and AnimatedCounter components exported from src/components/ui/index.ts
- [ ] #3 All animations use CSS transitions or Tailwind animation classes - no JavaScript animation loops
- [ ] #4 All animation components honour prefers-reduced-motion via Tailwind motion-reduce variant
- [ ] #5 AnimatedCounter uses requestAnimationFrame for smooth counting
<!-- DOD:END -->
