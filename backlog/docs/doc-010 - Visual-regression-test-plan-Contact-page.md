# Visual Regression Test Plan — Contact Page

**Audit date:** 2026-03-18
**Next.js file:** `src/app/contact/page.tsx`
**Webflow reference:** `al-hayaat.webflow/contact.html`
**Webflow CSS:** `al-hayaat.webflow/css/al-hayaat.webflow.css`

---

## Section Audit Summary

| Section ID | Webflow Class | Status | Bug Task |
|---|---|---|---|
| (no id — hero/header section) | N/A | Mismatch | — |
| (no id — contact info + form section) | `.section_contact` / `.padding-section-contact` | Partial | — |
| CTA | `.seciton_cta` | Match | — |

---

## Section Detail

### Hero / Header Section — PARTIAL (No `id`)

| Axis | Webflow | Next.js |
|---|---|---|
| Section id | N/A (no matching Webflow hero) | **No `id` attribute** ❌ |
| Background | N/A | `background="gray"` = `bg-brand-off-white` |
| Component | N/A | `PageHeader` component with breadcrumbs |

### Contact Info + Form Section — PARTIAL (No `id`)

| Axis | Webflow | Next.js |
|---|---|---|
| Section id | `.section_contact` | **No `id` attribute** ❌ |
| Background | No explicit (white) | `background="white"` ✅ |
| Padding top | `4rem` (`.padding-section-contact`) | `padding="lg"` = `py-32` (`8rem`) ❌ — too much |
| Padding bottom | `4rem` | `padding="lg"` = `py-32` ❌ — too much |
| Grid layout | 2-column (`1fr 1fr`), `gap: 3rem` (`.contact-component`) | `grid gap-10 lg:grid-cols-[0.9fr 1.1fr]` — gap `2.5rem` — slightly different |
| Header max-width | `max-width: 30rem` (`.contact-header-wrapper`) | Info cards use `ColoredBorderCard` — different structure |
| Contact info presentation | Simple text in header wrapper | Cards with icons (Email, Phone, Address) |

**Note:** The Next.js contact info section uses styled `ColoredBorderCard` components with icons, whereas Webflow uses a simpler text-based layout. This may be an intentional enhancement. Padding mismatch (`8rem` vs `4rem`) should be flagged.

---

## Playwright Test Cases

```typescript
// tests/visual/contact.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Contact page visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  // NOTE: Tests marked * require id attributes to be added to contact/page.tsx

  test('Contact — hero section: gray background PageHeader renders correctly *', async ({ page }) => {
    const section = page.locator('#contact-hero-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('contact-hero-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Contact — #contact-info-section: info cards and form render in grid *', async ({ page }) => {
    const section = page.locator('#contact-info-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(section).toHaveScreenshot('contact-info-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Contact — contact form: form renders with all required fields', async ({ page }) => {
    const form = page.locator('form');
    await expect(form).toBeVisible();
    await expect(form.locator('input[type="text"]')).toBeVisible();
    await expect(form.locator('input[type="email"]')).toBeVisible();
    await expect(form.locator('textarea')).toBeVisible();
    await expect(form.locator('button[type="submit"]')).toBeVisible();
  });

  test('Contact — CTA section: renders correctly', async ({ page }) => {
    // CTA section at bottom of page
    await expect(page).toHaveScreenshot('contact-full-desktop.png', { fullPage: true, maxDiffPixelRatio: 0.02 });
  });
});
```

---

## Open Issues / Follow-ups

- Contact info section and hero section are missing `id` attributes — consider filing a combined bug task for Contact page missing ids.
- Contact info section padding is `py-32` (`8rem`) vs Webflow's `4rem` — significant mismatch. Consider filing a padding bug.
- Contact info card UI (icons + ColoredBorderCard) is an enhancement over Webflow's simple text layout — confirm with design team whether this is intentional.
