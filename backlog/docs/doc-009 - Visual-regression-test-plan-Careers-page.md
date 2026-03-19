# Visual Regression Test Plan — Careers Page

**Audit date:** 2026-03-18
**Next.js file:** `src/app/careers/page.tsx`
**Webflow reference:** `al-hayaat.webflow/careers.html`
**Webflow CSS:** `al-hayaat.webflow/css/al-hayaat.webflow.css`

---

## Section Audit Summary

| Section ID | Webflow Class | Status | Bug Task |
|---|---|---|---|
| (no id — hero) | N/A — Webflow careers page is minimal | Mismatch | — |
| (no id — intro section) | N/A | N/A | — |
| (no id — why join) | N/A | N/A | — |
| (no id — openings) | N/A | N/A | — |
| (no id — final CTA) | `.padding-section-cta` | Partial | — |

---

## Section Detail

### Hero Section — MISMATCH (No `id`, custom green hero not in Webflow)

| Axis | Webflow | Next.js |
|---|---|---|
| Section id | No Webflow equivalent hero | **No `id` attribute** ❌ |
| Background | N/A | `bg-brand-green` + CTA background image ❌ |
| Structure | Webflow careers.html is minimal (nav + CTA blocks only) | Full hero + intro + why + openings sections |

**Note:** The Webflow careers page appears to only contain navigation, CTA sections, and footer. The Next.js implementation adds a full custom hero, intro, why-join, and open positions sections that are not present in the Webflow reference. These extended sections may be intentional product additions beyond the Webflow baseline. No bug is filed for the content additions, but the hero styling (green background with CTA image) should be verified with the design team.

### Missing `id` Attributes — All Sections

All sections in `src/app/careers/page.tsx` lack semantic `id` attributes, preventing precise Playwright DOM targeting.

**Proposed additions:**
- `id="careers-hero-section"` on the first `<section>` element
- `id="careers-intro-section"` on the intro `<Section>`
- `id="careers-why-join-section"` on the why join `<Section>`
- `id="careers-openings-section"` on the openings `<Section>`
- `id="careers-cta-section"` on the final CTA `<Section>`

---

## Playwright Test Cases

```typescript
// tests/visual/careers.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Careers page visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/careers');
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  // NOTE: Tests marked * require id attributes to be added to careers/page.tsx

  test('Careers — #careers-hero-section: green hero renders correctly *', async ({ page }) => {
    const section = page.locator('#careers-hero-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveCSS('background-color', 'rgb(22, 101, 52)'); // brand-green — verify actual value
    await expect(section).toHaveScreenshot('careers-hero-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Careers — #careers-why-join-section: reason cards render in 2-column grid *', async ({ page }) => {
    const section = page.locator('#careers-why-join-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('careers-why-join-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Careers — #careers-openings-section: position cards render correctly *', async ({ page }) => {
    const section = page.locator('#careers-openings-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('careers-openings-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Careers — #careers-cta-section: blue CTA section renders correctly *', async ({ page }) => {
    const section = page.locator('#careers-cta-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveCSS('background-color', 'rgb(37, 99, 235)'); // brand-blue — verify actual value
    await expect(section).toHaveScreenshot('careers-cta-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Careers — full page snapshot at 1440px', async ({ page }) => {
    await expect(page).toHaveScreenshot('careers-full-desktop.png', { fullPage: true, maxDiffPixelRatio: 0.02 });
  });
});
```

---

## Open Issues / Follow-ups

- All sections in `src/app/careers/page.tsx` are missing semantic `id` attributes — consider filing a bug task similar to TASK-089.
- Confirm with design team whether the custom green hero section on the Careers page is intentional (not in Webflow reference).
- Verify `bg-brand-green` hex value for the CSS assertion in the Playwright test above.
