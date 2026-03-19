# Visual Regression Test Plan — Navigation Component

**Audit date:** 2026-03-18
**Next.js file:** `src/components/layout/Navigation.tsx`
**Webflow reference:** `al-hayaat.webflow/index.html` (nav section)
**Webflow CSS:** `al-hayaat.webflow/css/al-hayaat.webflow.css` (`.nav`, `.padding-section-nav`, `.nav-right`)

---

## Section Audit Summary

| Section ID | Webflow Class | Status | Bug Task |
|---|---|---|---|
| `header` (no explicit id in nav) | `.nav` / `.padding-section-nav` | Partial | TASK-090 |
| Logo area | `.nav-left` | Partial | TASK-090 |
| Nav links | `.nav-menu` | Match | — |
| Donate button | `.nav-right` | Mismatch | TASK-090 |

---

## Section Detail

### Navigation Container — PARTIAL

| Axis | Webflow | Next.js |
|---|---|---|
| Section id | `.nav` | No explicit `id` on `<header>` ❌ |
| Background | No explicit (white) | `bg-white` ✅ |
| Position | Sticky (Webflow sticky nav) | `sticky top-0` ✅ |
| Padding | `.padding-section-nav` value | Inline padding — needs verification |
| Shadow | Border-bottom likely | `border-b` or shadow — needs verification |

---

### Logo Area — PARTIAL

| Axis | Webflow | Next.js |
|---|---|---|
| Logo image | Present (56×56px) | Present ✅ |
| School name text | **Not present** in Webflow nav | `{logo.text}` rendered next to logo ❌ |

---

### Nav Links — MATCH

| Axis | Webflow | Next.js |
|---|---|---|
| Links | Home, About, Curriculum, Admissions, Careers, Contact | Same links ✅ |
| Active state | Custom underline | Custom active indicator ✅ |

---

### Donate Button — MISMATCH

| Axis | Webflow | Next.js |
|---|---|---|
| Icon | Custom coin/database SVG path (M17.25 4.897...) | Lucide `Heart` icon ❌ |
| Button text | "Donate" | "Donate" ✅ |
| Button styling | Outlined/ghost variant | Variant styling ✅ |

**Related task:** TASK-090

---

## Playwright Test Cases

```typescript
// tests/visual/navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Navigation component visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('Navigation — header: white background, sticky position', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    await expect(header).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(header).toHaveCSS('position', 'sticky');
    await expect(header).toHaveScreenshot('navigation-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Navigation — logo: image renders at correct size', async ({ page }) => {
    const logo = page.locator('header img').first();
    await expect(logo).toBeVisible();
    const box = await logo.boundingBox();
    expect(box?.width).toBeGreaterThan(40);
    expect(box?.height).toBeGreaterThan(40);
  });

  test('Navigation — nav links: all expected links present', async ({ page }) => {
    const nav = page.locator('header nav');
    await expect(nav.locator('a[href="/"]')).toBeVisible();
    await expect(nav.locator('a[href="/about"]')).toBeVisible();
    await expect(nav.locator('a[href="/admissions"]')).toBeVisible();
  });

  test('Navigation — donate button: renders with correct label', async ({ page }) => {
    const donateBtn = page.locator('header').getByText('Donate');
    await expect(donateBtn).toBeVisible();
  });

  test('Navigation — mobile: hamburger menu renders at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    await expect(header).toHaveScreenshot('navigation-mobile.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Navigation — scroll: remains sticky when page scrolled', async ({ page }) => {
    await page.evaluate(() => window.scrollBy(0, 500));
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    const box = await header.boundingBox();
    expect(box?.y).toBeLessThanOrEqual(10); // Should remain at top of viewport
  });
});
```

---

## Open Issues / Follow-ups

- **TASK-090** — Donate button uses Lucide `Heart` icon instead of Webflow's coin/database SVG, and logo area shows school name text not present in Webflow.
- Add `id="site-navigation"` to the `<header>` element for precise Playwright targeting.
- Verify Webflow nav padding values from `.padding-section-nav` CSS to confirm there is no vertical padding mismatch.
