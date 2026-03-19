# Visual Regression Test Plan — Curriculum Page

**Audit date:** 2026-03-18
**Next.js file:** `src/app/curriculum/page.tsx`
**Webflow reference:** `al-hayaat.webflow/academic-and-curriculum.html`
**Webflow CSS:** `al-hayaat.webflow/css/al-hayaat.webflow.css`

---

## Section Audit Summary

| Section ID | Webflow Class | Status | Bug Task |
|---|---|---|---|
| (no id — hero) | `.section_about-curriculum` | Mismatch | TASK-089 |
| (no id — overview) | Curriculum overview section | Mismatch | TASK-089 |
| (no id — subjects) | Curriculum subjects section | Mismatch | TASK-089 |
| (no id — growth) | Curriculum growth section | Mismatch | TASK-089 |

---

## Section Detail

### Hero Section — MISMATCH (Missing `id`)

| Axis | Webflow | Next.js |
|---|---|---|
| Section id | Named Webflow class | **No `id` attribute** ❌ |
| Background | White (`#ffffff`) | `className="bg-white"` ✅ |
| Playwright targeting | Via Webflow class | Impossible without `id` ❌ |

**Critical:** All Curriculum page sections are missing semantic `id` attributes. See **TASK-089**.

---

## Playwright Test Cases

```typescript
// tests/visual/curriculum.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Curriculum page visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/curriculum');
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  // NOTE: These tests require TASK-089 to be resolved first (add id attributes)

  test('Curriculum — #curriculum-hero-section: renders with white background', async ({ page }) => {
    const section = page.locator('#curriculum-hero-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(section).toHaveScreenshot('curriculum-hero-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Curriculum — #curriculum-overview-section: two-column layout visible', async ({ page }) => {
    const section = page.locator('#curriculum-overview-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('curriculum-overview-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Curriculum — #curriculum-subjects-section: subject cards render correctly', async ({ page }) => {
    const section = page.locator('#curriculum-subjects-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('curriculum-subjects-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Curriculum — #curriculum-growth-section: growth/image section renders', async ({ page }) => {
    const section = page.locator('#curriculum-growth-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('curriculum-growth-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Curriculum — full page snapshot at 1440px', async ({ page }) => {
    await expect(page).toHaveScreenshot('curriculum-full-desktop.png', { fullPage: true, maxDiffPixelRatio: 0.02 });
  });
});
```

---

## Open Issues / Follow-ups

- **TASK-089** — All Curriculum page sections are missing semantic `id` attributes. Fix required before Playwright tests above can be used.
- Detailed section-by-section comparison is blocked until `id` attributes are added — re-audit after TASK-089 is resolved.
