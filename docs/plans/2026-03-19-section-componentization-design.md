# Section Componentization Design

**Date:** 2026-03-19  
**Author:** AI Pair Programming Session  
**Status:** Approved — Ready for Implementation

---

## Problem Statement

Currently, ~25 sections across 8 pages are written as inline JSX inside page files. This makes
individual sections hard to replace, reuse, or edit in isolation — a change to one section
requires editing the page file directly, and structural patterns (like heading + subtext intros)
are duplicated across multiple pages.

## Goal

Convert every inline section into a standalone UI component so that:
- Any section is **plug-and-play** — swap it by changing one import
- Structural changes to a shared pattern (e.g., intro sections) propagate everywhere
- Page files become thin orchestrators — they import content JSON, import section components, wire props

---

## Decisions Made

| Decision | Choice | Rationale |
|---|---|---|
| Include hidden sections? | Yes — at low priority | Future-proof; can be repurposed when activated |
| Generic vs page-specific components? | Generic for structurally similar sections | `PageIntroSection` replaces 6 identical heading+body patterns |
| Folder location | New `src/components/sections/` | Separates section-level components from reusable UI primitives in `ui/` |
| Migrate existing section components? | Yes — `WhySection`, `CTASection`, `SupportMissionSection` | One canonical home for all sections |
| Approach | Extract + Standardize | Clean TypeScript interface, content JSON compliance, `next/image` — done right once |

---

## Architecture

### Folder Structure

```
src/components/sections/
├── index.ts                          ← barrel export for all sections
│
│  ── Migrated from ui/ ──
├── WhySection.tsx
├── CTASection.tsx
├── SupportMissionSection.tsx
│
│  ── Generic (reused across multiple pages) ──
├── PageIntroSection.tsx              ← replaces all heading+subtext inline sections
│
│  ── Home ──
├── HomeHeroSection.tsx               (high priority)
├── HomeCurriculumSection.tsx         (medium priority)
├── HomeFeatureSection.tsx            (low priority — currently hidden)
├── HomeGrowthPlanSection.tsx         (low priority — currently hidden)
├── HomeCollaboratorsSection.tsx      (low priority — currently hidden)
├── HomeNewsSection.tsx               (low priority — currently hidden)
│
│  ── About ──
├── AboutHeroCarouselSection.tsx      (medium priority)
├── AboutMissionVisionSection.tsx     (medium priority)
├── AboutTeamSection.tsx              (medium priority)
│
│  ── Admissions ──
├── AdmissionsBannerSection.tsx       (medium priority)
├── AdmissionsEnrollmentCardsSection.tsx (medium priority)
├── AdmissionsHowToApplySection.tsx   (medium priority)
├── AdmissionsRequirementsSection.tsx (medium priority)
├── AdmissionsFeesTableSection.tsx    (medium priority)
│
│  ── Curriculum ──
├── CurriculumContentSection.tsx      (medium priority)
├── CurriculumGrowthSection.tsx       (medium priority)
│
│  ── Careers ──
├── CareersWhyJoinSection.tsx         (medium priority)
├── CareersOpeningsSection.tsx        (medium priority)
│
│  ── Contact ──
├── ContactInfoSection.tsx            (medium priority)
│
│  ── Donate ──
├── DonateVerseSection.tsx            (medium priority)
├── DonateInfoSection.tsx             (medium priority)
│
│  ── School Plan ──
└── SchoolPlanCardsSection.tsx        (medium priority)
```

### Component Contract Pattern

Every section component follows this pattern:

```typescript
// Props typed, all text sourced from content JSON (no hardcoded strings in JSX)
interface ExampleSectionProps {
  headline: string;
  body: string;
  className?: string;   // escape hatch for one-off spacing overrides
}

export function ExampleSection({ headline, body, className }: ExampleSectionProps) {
  return (
    <Section className={className}>
      <Container>
        <h2>{headline}</h2>
        <p>{body}</p>
      </Container>
    </Section>
  );
}
```

### Page File Pattern (after componentization)

Pages become thin orchestrators:

```tsx
// src/app/careers/page.tsx — after componentization
import content from '@/content/careers.json';
import { PageIntroSection, CareersWhyJoinSection, CareersOpeningsSection } from '@/components/sections';

export default function CareersPage() {
  return (
    <>
      <GreenHero title={content.hero.title} />
      <PageIntroSection headline={content.intro.headline} body={content.intro.body} />
      <CareersWhyJoinSection items={content.whyJoin.items} />
      <CareersOpeningsSection positions={content.openings} />
      <CTASection {...content.cta} />
    </>
  );
}
```

---

## Standards Applied to Every Component (Approach 2)

1. **Props-driven** — all visible text via typed props, sourced from `src/content/{page}.json` at the page level
2. **No hardcoded strings in JSX** — content JSON is the single source of truth
3. **`next/image` exclusively** — no raw `<img>` tags
4. **Tailwind only** — no inline styles; all visual elements reference design tokens from `tailwind.config.ts` or shadcn/ui primitives
5. **`className?` escape hatch** — accepts optional className for one-off overrides without forking the component
6. **Barrel export** — every component added to `src/components/sections/index.ts`
7. **No duplicate components** — `variant` props for visual differences

---

## Story Inventory (28 stories)

| # | Component | Type | Priority | Milestone |
|---|-----------|------|----------|-----------|
| 1 | `sections/` barrel + `index.ts` setup | UI_COMPONENT | high | m-2 |
| 2 | Migrate `WhySection` → `sections/` | UI_COMPONENT | high | m-2 |
| 3 | Migrate `CTASection` → `sections/` | UI_COMPONENT | high | m-2 |
| 4 | Migrate `SupportMissionSection` → `sections/` | UI_COMPONENT | high | m-2 |
| 5 | `PageIntroSection` generic | UI_COMPONENT | high | m-2 |
| 6 | `HomeHeroSection` | UI_COMPONENT | high | m-2 |
| 7 | `HomeCurriculumSection` | UI_COMPONENT | medium | m-2 |
| 8 | `AboutHeroCarouselSection` | UI_COMPONENT | medium | m-2 |
| 9 | `AboutMissionVisionSection` | UI_COMPONENT | medium | m-2 |
| 10 | `AboutTeamSection` | UI_COMPONENT | medium | m-2 |
| 11 | `AdmissionsBannerSection` | UI_COMPONENT | medium | m-2 |
| 12 | `AdmissionsEnrollmentCardsSection` | UI_COMPONENT | medium | m-2 |
| 13 | `AdmissionsHowToApplySection` | UI_COMPONENT | medium | m-2 |
| 14 | `AdmissionsRequirementsSection` | UI_COMPONENT | medium | m-2 |
| 15 | `AdmissionsFeesTableSection` | UI_COMPONENT | medium | m-2 |
| 16 | `CurriculumContentSection` | UI_COMPONENT | medium | m-2 |
| 17 | `CurriculumGrowthSection` | UI_COMPONENT | medium | m-2 |
| 18 | `CareersWhyJoinSection` | UI_COMPONENT | medium | m-2 |
| 19 | `CareersOpeningsSection` | UI_COMPONENT | medium | m-2 |
| 20 | `ContactInfoSection` | UI_COMPONENT | medium | m-2 |
| 21 | `DonateVerseSection` | UI_COMPONENT | medium | m-2 |
| 22 | `DonateInfoSection` | UI_COMPONENT | medium | m-2 |
| 23 | `SchoolPlanCardsSection` | UI_COMPONENT | medium | m-2 |
| 24 | `HomeFeatureSection` | UI_COMPONENT | low | m-2 |
| 25 | `HomeGrowthPlanSection` | UI_COMPONENT | low | m-2 |
| 26 | `HomeCollaboratorsSection` | UI_COMPONENT | low | m-2 |
| 27 | `HomeNewsSection` | UI_COMPONENT | low | m-2 |
| 28 | Update all page files to use `sections/` imports | UI_COMPONENT | high | m-2 |

---

## Test Requirements Per Story

Every UI_COMPONENT story includes:
- **Gherkin happy path** — component renders with all props on desktop (1440px)
- **Edge case: missing optional data** — component renders gracefully when optional props are absent
- **Edge case: mobile viewport** — layout correct at 375px, no horizontal scroll
- **Unit tests** — render with all props, render with missing optionals, snapshot
- **Visual comparison** — against Webflow source at 375px, 768px, 1440px
- **Lighthouse targets** — Performance >90, Accessibility >95, SEO >90
- **axe-core** — zero critical violations

---

## Dependencies

- Story 1 (barrel setup) must complete before stories 2–28
- Stories 2–4 (migrations) should complete before story 28 (page wiring)
- Story 5 (`PageIntroSection`) should complete before stories 7–23 that use it
- Story 28 (page wiring) is the final integration task — depends on all component stories
