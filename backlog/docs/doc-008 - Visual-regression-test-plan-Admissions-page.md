# Visual Regression Test Plan — Admissions Page

**Audit date:** 2026-03-18
**Next.js file:** `src/app/admissions/page.tsx`
**Webflow reference:** `al-hayaat.webflow/admission.html`
**Webflow CSS:** `al-hayaat.webflow/css/al-hayaat.webflow.css`

---

## Section Audit Summary

| Section ID | Webflow Class | Status | Bug Task |
|---|---|---|---|
| (missing id — hero) | `.section_admission-hero` | Mismatch | TASK-088 |
| `#admissions-apply-section` (if exists) | `.section_how-to-apply` | Needs verify | — |
| CTA | `.seciton_cta` | Match | — |

---

## Section Detail

### Hero Section — MISMATCH

| Axis | Webflow | Next.js |
|---|---|---|
| Section id | `.section_admission-hero` | **No `id` attribute** ❌ |
| Background | No explicit color (white `#ffffff`) | `background="gray"` = `bg-brand-off-white` (`#fdf9f5`) ❌ |
| Padding top | `9.125rem` (`.padding-section-admission-hero`) | `padding="md"` = `py-20` (`5rem`) ❌ |
| Padding bottom | `18.125rem` | `padding="md"` = `py-20` (`5rem`) ❌ |

**Related task:** TASK-088

---

### `#admissions-apply-section` — NEEDS VERIFY

| Axis | Webflow | Next.js |
|---|---|---|
| Background | `#fafafa` (`.section_how-to-apply`) | Needs check |

---

## Playwright Test Cases

```typescript
// tests/visual/admissions.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admissions page visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admissions');
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  // NOTE: Tests marked * require TASK-088 to be resolved first

  test('Admissions — #admissions-hero-section: white background and correct padding *', async ({ page }) => {
    const section = page.locator('#admissions-hero-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveCSS('background-color', 'rgb(255, 255, 255)'); // post TASK-088 fix
    await expect(section).toHaveScreenshot('admissions-hero-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Admissions — #admissions-apply-section: apply steps render correctly', async ({ page }) => {
    const section = page.locator('#admissions-apply-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('admissions-apply-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Admissions — full page snapshot at 1440px', async ({ page }) => {
    await expect(page).toHaveScreenshot('admissions-full-desktop.png', { fullPage: true, maxDiffPixelRatio: 0.02 });
  });
});
```

---

## Open Issues / Follow-ups

- **TASK-088** — Hero section uses `bg-brand-off-white` instead of Webflow white, missing `id`, and has incorrect padding. Fix required before running targeted tests.
- Re-audit "How to Apply" section styling (`#fafafa` background in Webflow vs Next.js) after TASK-088 is resolved.
