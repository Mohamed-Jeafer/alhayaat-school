# Visual Regression Test Plan — School Plan Page

**Audit date:** 2026-03-18
**Next.js file:** `src/app/school-plan/page.tsx`
**Webflow reference:** `al-hayaat.webflow/school-plans.html`
**Webflow CSS:** `al-hayaat.webflow/css/al-hayaat.webflow.css`

---

## Section Audit Summary

| Section ID | Webflow Class | Status | Bug Task |
|---|---|---|---|
| `#school-plans-cards-section` | `.section_school-plans` | Partial | — |
| `#support-mission-section` | `.section_school-plan-our-mission` | Match | — |
| `#school-plan-cta-section` | `.seciton_cta` | Match | — |

---

## Section Detail

### `#school-plans-cards-section` — PARTIAL

| Axis | Webflow | Next.js |
|---|---|---|
| Background | `var(--brand--off-white-background)` (`.section_school-plans`) | `background="off-white-bg"` (`bg-brand-off-white-background`) ✅ |
| Padding top | `3.9375rem` (`.padding-section-school-plans`) | `padding="lg"` = `py-32` (8rem) ❌ — too much |
| Padding bottom | `3.125rem` | `padding="lg"` = `py-32` ❌ — too much |
| Cards grid | 2 columns, `gap: 3.125rem` (`.school-plans-card-container`) | `grid gap-6 lg:grid-cols-2` — gap `1.5rem` ❌ smaller gap |
| Header max-width | `max-width: 46.75rem; margin-bottom: 5.1875rem` | `max-w-4xl` (`56rem`) ❌ different max-width |
| Bullet icons in plan card | Not specified — text list | `CheckCircle2` Lucide icon — needs Webflow verification |

**Discrepancy:** Padding is set to `lg` (`py-32` / `8rem`) but Webflow uses `~4rem`. The card grid gap is also smaller than Webflow's `3.125rem`.

---

### `#support-mission-section` — MATCH

| Axis | Webflow | Next.js |
|---|---|---|
| Background | White | `background="white"` ✅ |
| Layout | Two-column with image right | `grid gap-12 lg:grid-cols-[1fr 0.95fr]` ✅ |
| Payment logos | Present | Present ✅ |

---

### `#school-plan-cta-section` — MATCH

| Axis | Webflow | Next.js |
|---|---|---|
| Component | `.seciton_cta` | `CTASection` ✅ |

---

## Playwright Test Cases

```typescript
// tests/visual/school-plan.spec.ts
import { test, expect } from '@playwright/test';

test.describe('School Plan page visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/school-plan');
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('School Plan — #school-plans-cards-section: correct background and card layout', async ({ page }) => {
    const section = page.locator('#school-plans-cards-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveCSS('background-color', 'rgb(255, 252, 249)'); // #fffcf9
    await expect(section).toHaveScreenshot('school-plan-cards-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('School Plan — #school-plans-card-container: renders two cards in grid', async ({ page }) => {
    const grid = page.locator('#school-plans-card-container');
    await expect(grid).toBeVisible();
    const cards = grid.locator('> *');
    await expect(cards).toHaveCount(2);
  });

  test('School Plan — #support-mission-section: white background, two-column layout', async ({ page }) => {
    const section = page.locator('#support-mission-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(section).toHaveScreenshot('school-plan-mission-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('School Plan — #support-mission-payment-logos: payment logos visible', async ({ page }) => {
    const logos = page.locator('#support-mission-payment-logos');
    await expect(logos).toBeVisible();
    const logoItems = logos.locator('> div');
    await expect(logoItems).toHaveCount(7);
  });

  test('School Plan — #school-plan-cta-section: CTA renders correctly', async ({ page }) => {
    const section = page.locator('#school-plan-cta-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('school-plan-cta-desktop.png', { maxDiffPixelRatio: 0.02 });
  });
});
```

---

## Open Issues / Follow-ups

- Section padding for `#school-plans-cards-section` is too large (`py-32` / `8rem`) vs Webflow's `~4rem`. Consider adding a fix task.
- Card grid gap (`gap-6` / `1.5rem`) is smaller than Webflow's `3.125rem` gap. Consider adjusting.
- Header max-width in Next.js (`max-w-4xl`) differs from Webflow (`max-width: 46.75rem`).
