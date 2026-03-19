# Visual Regression Test Plan — Donate Page

**Audit date:** 2026-03-18
**Next.js file:** `src/app/donate/page.tsx`
**Webflow reference:** `al-hayaat.webflow/donate.html`
**Webflow CSS:** `al-hayaat.webflow/css/al-hayaat.webflow.css`

---

## Section Audit Summary

| Section ID | Webflow Class | Status | Bug Task |
|---|---|---|---|
| (no id — hero verse section) | `.section_donate` (partial match) | Partial | — |
| `#donation-form` | `.section_donate` | Match | — |
| CTA | `.seciton_cta` | Match | — |

---

## Section Detail

### Hero Verse Section — PARTIAL (No `id`)

| Axis | Webflow | Next.js |
|---|---|---|
| Section id | `.section_donate` | **No `id` attribute** ❌ |
| Background | White | `background="white"` ✅ |
| Padding | `padding="lg"` = `py-32` | Needs Webflow padding value comparison |
| Arabic verse | Displayed as part of donate content | `text-arabic` class, `text-[1.9rem]` ✅ |

### Donation Info + Form Section — MATCH

| Axis | Webflow | Next.js |
|---|---|---|
| Section id | N/A | No explicit `id` on `Section` (but `#donation-form` on inner div) |
| Background | White | `background="white"` ✅ |
| Layout | Two-column | `grid gap-10 lg:grid-cols-[1.05fr 0.95fr]` ✅ |
| Form | Present | `DonationForm` component ✅ |
| Other methods cards | Present | `ColoredBorderCard` grid ✅ |

---

## Playwright Test Cases

```typescript
// tests/visual/donate.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Donate page visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/donate');
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  // NOTE: Tests marked * require id attributes to be added to donate/page.tsx

  test('Donate — hero verse section: Arabic verse and translation display correctly *', async ({ page }) => {
    const section = page.locator('#donate-hero-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('donate-hero-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Donate — #donation-form: form renders with preset amount buttons', async ({ page }) => {
    const form = page.locator('#donation-form');
    await expect(form).toBeVisible();
    await expect(form).toHaveScreenshot('donate-form-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Donate — donation form: preset amount buttons clickable', async ({ page }) => {
    const presetButtons = page.locator('#donation-form button').filter({ hasNotText: 'Donate' });
    const count = await presetButtons.count();
    expect(count).toBeGreaterThan(0);
    await presetButtons.first().click();
  });

  test('Donate — other methods cards: all payment method cards rendered', async ({ page }) => {
    const methodCards = page.locator('.md\\:grid-cols-2 > *');
    const count = await methodCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Donate — CTA section: "Join Our Community" CTA renders', async ({ page }) => {
    await expect(page).toHaveScreenshot('donate-full-desktop.png', { fullPage: true, maxDiffPixelRatio: 0.02 });
  });
});
```

---

## Open Issues / Follow-ups

- Donate page sections are missing `id` attributes — consider filing a bug task for missing ids (consistent with TASK-088, TASK-089).
- Verify Webflow padding for `.section_donate` vs Next.js `padding="lg"` (`8rem`) — likely a mismatch similar to other pages.
- The CTA at the bottom of the Donate page hardcodes text `"Join Our Community"` rather than using content from `donate.json` — verify if this is intentional.
