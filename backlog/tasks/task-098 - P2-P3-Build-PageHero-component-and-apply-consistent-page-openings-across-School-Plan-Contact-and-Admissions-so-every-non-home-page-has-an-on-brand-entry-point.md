---
id: TASK-098
title: >-
  [P2/P3] Build PageHero component and apply consistent page openings across
  School Plan, Contact, and Admissions so every non-home page has an on-brand
  entry point
status: Done
assignee:
  - mohdr
created_date: '2026-03-19 11:42'
labels:
  - phase-2
  - phase-3
  - ui-component
  - page-migration
  - design-consistency
milestone: m-3
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Story**
As a prospective parent or community member navigating the Al-Hayaat School website, I want every page to open with a clear, on-brand title and context, so that I always know where I am and what the page is about without feeling disoriented.

**Business Context**
A UX/UI audit of all non-home pages (documented in `public/page-hero-audit.html`) revealed three pages with D/C-grade openings: School Plan has no H1 title at all — it jumps directly into a body paragraph; Contact and Admissions use a generic gray `PageHeader` component that is visually disconnected from the brand identity established on About and Curriculum. The Webflow version has the same inconsistencies — it is not a source of truth for this design decision. Three options were evaluated with the stakeholder; Option A was chosen: build a shared `PageHero` and apply it only to the three weak pages, leaving Careers (green full-bleed hero) and Donate (Quranic verse opener) unchanged as their divergence is contextually justified.

**Audit reference:** `public/page-hero-audit.html` — preserved for designer review. Accessible at `/page-hero-audit.html` in development.

**Technical Specification**
- Rendering: SSG — all hero content is static; sourced from `src/content/*.json`
- Data: Static props from existing content JSON files; one new key added: `hero.subtitle` in `src/content/school-plan.json`
- Infrastructure: None — static page changes, no Azure impact
- Stack constraints: Tailwind design tokens only, no inline styles; `next/image` not required (text-only hero); reuse existing `FadeIn` and `Container` primitives
- Phase dependencies: TASK-038 (layout primitives), TASK-052 (design tokens)
- Spec reference: `docs/DESIGN-SYSTEM.md`, `docs/COMPONENT-ARCHITECTURE.md`

**Design Decision Log**
Option A (chosen): Shared PageHero for 3 weak pages; Careers + Donate stay unique.
Option B (rejected): Extend Careers full-bleed green hero to all pages — damages Donate spiritual tone; too heavy.
Option C (rejected): Remove Careers hero; flatten all pages — step backward; doesn’t fix School Plan.

**Pages affected:**
School Plan: Before = no title, jumps to paragraph (D-grade). After = PageHero with title + subtitle.
Contact: Before = generic gray PageHeader (C-grade). After = PageHero with title + subtitle.
Admissions: Before = generic gray PageHeader + banner (C-grade). After = PageHero with title + subtitle; banner preserved below.

**Pages intentionally unchanged:** About (A), Curriculum (A-), Careers (A), Donate (B+).

**Component specification — PageHero — src/components/layout/PageHero.tsx**
Props: title (string, required H1), subtitle (string, optional paragraph), id (string, optional section ID for Playwright), className (string, optional override).
Background: bg-brand-off-white-background (#FFFCF9) matching About hero. Padding: pt-[4.375rem] pb-[4.375rem]. Title: h1 centered text-brand-black. Subtitle: centered text-[1.2rem] font-medium leading-[1.3] text-brand-black/80. Max-width wrapper: max-w-[48.5625rem]. Wrapped in FadeIn animation.

**Content Extraction**
- src/content/school-plan.json — added hero.subtitle key
- src/content/contact.json — uses existing hero.heading + hero.subtext
- src/content/admissions.json — uses existing hero.headline + hero.subtext
All text sourced from JSON; no hardcoded strings in JSX.

**Recommended Skills**
- #frontend-design — brand alignment, Tailwind design tokens, visual consistency
- #senior-fullstack — component architecture, variant props, single-source pattern

**Story Points:** 3
Sizing rationale: New component is simple (title + subtitle + wrapper), applied to 3 pages with existing content data — no API, DB, or new content extraction needed.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Given a user navigates to /school-plan — When the page loads — Then an H1 heading 'School Plans' is visible at the top of the page with a subtitle paragraph below it, and the background is the brand off-white color (#FFFCF9)
- [ ] #2 Given a user navigates to /contact — When the page loads — Then the page opens with a branded PageHero (not a generic gray header), the H1 reads 'Contact', and the subtitle paragraph is visible
- [ ] #3 Given a user navigates to /admissions — When the page loads — Then the page opens with a branded PageHero, the H1 reads 'Admission', and the colorful banner image is still visible below the hero
- [ ] #4 Given a user navigates to /careers, /donate, /about, or /curriculum — When the page loads — Then the page opening is identical to before this change (no regression)
- [ ] #5 Given a user is on a 375px wide screen — When any of the three updated pages loads — Then the H1 and subtitle are legible, centered, and no horizontal scroll occurs
- [ ] #6 Given the PageHero component — When rendered with only a title prop — Then it renders correctly without the subtitle element in the DOM
- [ ] #7 Given all hero text on the three updated pages — When inspecting JSX source — Then all visible strings are sourced from src/content/*.json with no hardcoded text in JSX
<!-- AC:END -->
