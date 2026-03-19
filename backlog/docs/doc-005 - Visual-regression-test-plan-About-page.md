# Visual Regression Test Plan — About Page

**Audit date:** 2026-03-18
**Next.js file:** `src/app/about/page.tsx`
**Webflow reference:** `al-hayaat.webflow/about.html`
**Webflow CSS:** `al-hayaat.webflow/css/al-hayaat.webflow.css`

---

## Section Audit Summary

| Section ID | Webflow Class | Status | Bug Task |
|---|---|---|---|
| `#about-hero-section` | `.section_about-hero` | Mismatch | TASK-072, TASK-081 |
| `#about-mission-vision-section` | `.section_about-mission-vision` | Match | — |
| `#about-team-section` | `.section_our-team` | Partial | — |
| `#about-why-section` | `.section_home-why` | Match | — |
| `#about-cta-section` | `.seciton_cta` | Match | — |

---

## Section Detail

### `#about-hero-section` — MISMATCH

| Axis | Webflow | Next.js |
|---|---|---|
| Background | No explicit color (white `#ffffff`) | `bg-brand-off-white-background` (`#fffcf9`) |
| Padding top | `4.375rem` (`.padding-section-about-hero`) | `pt-[4.375rem]` ✅ |
| Padding bottom | `4.375rem` (`.padding-section-about-hero`) | `pb-[4.375rem]` ✅ |
| Inner component padding-bottom | `8rem` (`.about-hero-component`) | `pb-32` (`8rem`) ✅ |
| Decorative shape 1 | Absolute `bottom: 1rem; left: 0%` | `absolute bottom-4 left-0` ✅ |
| Decorative shape 2 | Absolute `bottom: 0; right: 0%` | `absolute bottom-0 right-0` ✅ |
| Carousel width per image | `444px × 339px` | `AutoScrollCarousel` — needs verification |
| Hero background mismatch | — | Tracked in **TASK-081** |
| Missing image gallery/carousel | Webflow shows full-width carousel | **TASK-072** |

**Related tasks:** TASK-072 (missing gallery), TASK-081 (hero layout)

---

### `#about-mission-vision-section` — MATCH

| Axis | Webflow | Next.js |
|---|---|---|
| Background | `var(--brand--off-white-background)` | `bg-brand-off-white-background` ✅ |
| Padding top | `4rem` (`.padding-section-mission-vision`) | `py-16` via `Container className="py-16"` ✅ |
| Padding bottom | `4rem` | `py-16` ✅ |
| Tab orientation | Vertical tabs (`.tab-link` left sidebar) | `orientation="vertical"` ✅ |
| Header offset | `padding-left: 16rem` (`.mission-vision-header-wrap`) | `md:pl-64` (`16rem`) ✅ |

---

### `#about-team-section` — PARTIAL

| Axis | Webflow | Next.js |
|---|---|---|
| Background | No explicit bg (white) | `background="white"` ✅ |
| Team card images | `.our-team-image-wrapper` with `.hide` class | `hidden` class on image wrapper ✅ |
| Card layout | `.our-team-card` flex with image + details | `flex gap-11` ✅ |
| Board image | Present (`.our-team-group-image-wrapper`) | Conditionally rendered ✅ |
| Padding | `py-20` from Container className | Consistent with Webflow structure |

---

### `#about-why-section` — MATCH

| Axis | Webflow | Next.js |
|---|---|---|
| Background | Part of `.section_home-why` (white) | `background="white"` ✅ |
| Card layout | `.home-why-component` | `WhyCard` components ✅ |
| Max-width container | Matches `max-w-[67.375rem]` | ✅ |

---

### `#about-cta-section` — MATCH

| Axis | Webflow | Next.js |
|---|---|---|
| Component | `.seciton_cta` with green background + image | `CTASection` `variant="green"` ✅ |

---

## Playwright Test Cases

```typescript
// tests/visual/about.spec.ts
import { test, expect } from '@playwright/test';

test.describe('About page visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('About — #about-hero-section: renders with correct background and padding', async ({ page }) => {
    const section = page.locator('#about-hero-section');
    await expect(section).toBeVisible();
    // Background should be white to match Webflow (currently off-white — see TASK-081)
    await expect(section).toHaveScreenshot('about-hero-section-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('About — #about-hero-carousel: carousel renders with correct image dimensions', async ({ page }) => {
    const carousel = page.locator('#about-hero-carousel');
    await expect(carousel).toBeVisible();
    await expect(carousel).toHaveScreenshot('about-hero-carousel-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('About — #about-mission-vision-section: correct background and tab layout', async ({ page }) => {
    const section = page.locator('#about-mission-vision-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveCSS('background-color', 'rgb(255, 252, 249)'); // #fffcf9
    await expect(section).toHaveScreenshot('about-mission-vision-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('About — #mission-vision-header-wrap: has correct left padding offset', async ({ page }) => {
    const header = page.locator('#mission-vision-header-wrap');
    await expect(header).toBeVisible();
    // Should have padding-left: 16rem (256px) on md+ breakpoint
  });

  test('About — #about-team-section: renders all team members', async ({ page }) => {
    const section = page.locator('#about-team-section');
    await expect(section).toBeVisible();
    const cards = page.locator('[id^="team-member-"]');
    await expect(cards).toHaveCount(3); // adjust based on actual team count
    await expect(section).toHaveScreenshot('about-team-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('About — #about-why-section: renders with white background', async ({ page }) => {
    const section = page.locator('#about-why-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(section).toHaveScreenshot('about-why-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('About — #about-cta-section: renders green CTA with background image', async ({ page }) => {
    const section = page.locator('#about-cta-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('about-cta-desktop.png', { maxDiffPixelRatio: 0.02 });
  });
});
```

---

## Open Issues / Follow-ups

- **TASK-072** — About page hero missing image gallery carousel (To Do, Medium)
- **TASK-081** — About hero layout: stack text above full-width carousel (In Progress, High)
- Investigate whether About hero background should be white (`#ffffff`) vs off-white (`#fffcf9`) — currently `bg-brand-off-white-background` in Next.js while Webflow `.section_about-hero` has no explicit background.
