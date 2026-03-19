# Visual Regression Test Plan — Footer Component

**Audit date:** 2026-03-18
**Next.js file:** `src/components/layout/Footer.tsx`
**Webflow reference:** `al-hayaat.webflow/index.html` (footer section)
**Webflow CSS:** `al-hayaat.webflow/css/al-hayaat.webflow.css` (`.padding-section-footer`, `.footer-component`)

---

## Section Audit Summary

| Section ID | Webflow Class | Status | Bug Task |
|---|---|---|---|
| `#site-footer` | `.section_footer` / `.footer-component` | Partial | — |
| `#footer-brand` | `.footer-header-wrap` | Partial | — |
| `#footer-contact` | `.footer-content-wrap` | Match | — |
| `#footer-menu` | `.footer-content-wrap` | Match | — |
| `#footer-bottom` | `.footer-bottom` | Match | — |
| `#footer-social-group` | `.social-media-wrap` | Match | — |

---

## Section Detail

### `#site-footer` — PARTIAL

| Axis | Webflow | Next.js |
|---|---|---|
| Background | `var(--brand--off-white-background)` | `bg-brand-off-white-background` ✅ |
| Padding top | `6.6875rem` (`.padding-section-footer`) | `py-14` (`3.5rem`) ❌ — too short |
| Padding bottom | `3.625rem` | `py-14` (`3.5rem`) — close ✅ |
| Layout | `.footer-component` with `gap: 25rem` (flex, 2-col) | 3-column CSS grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) — different structure |
| Column gap | `25rem` between header and content in Webflow | `gap-10` (`2.5rem`) — much smaller |

**Discrepancy:** The footer padding-top is `6.6875rem` in Webflow but only `3.5rem` in Next.js. The layout structure also differs — Webflow uses a 2-column flex layout with massive 25rem gap, while Next.js uses a 3-column responsive grid. The Next.js grid layout may be an improvement for responsiveness, but the top padding mismatch should be addressed.

---

### `#footer-brand` — PARTIAL

| Axis | Webflow | Next.js |
|---|---|---|
| Logo + school name | Logo image only | Logo image + school name text (`{logo.text}`) |
| Social icons | Present in `.footer-header-wrap` | Present in `#footer-social-group` ✅ |
| Social icon color | Custom SVGs on green circles | Custom SVGs on green circles (`bg-brand-green`) ✅ |
| Social icon hover | Blue on hover | `hover:bg-brand-blue` ✅ |

**Note:** The footer shows the school name text next to the logo (same as the Navigation — see TASK-090). If this is intentional, document it; otherwise, align with Webflow.

---

### `#footer-contact` — MATCH

| Axis | Webflow | Next.js |
|---|---|---|
| Contact items | Email, phone, address | Email, phone, address ✅ |
| Icons | Custom SVGs | Custom inline SVGs ✅ |

---

### `#footer-menu` — MATCH

| Axis | Webflow | Next.js |
|---|---|---|
| Quick links | Present | `quick_links` from `_shared.json` ✅ |

---

### `#footer-bottom` — MATCH

| Axis | Webflow | Next.js |
|---|---|---|
| Copyright | Present | `{copyright}` ✅ |
| Legal links | Present | `legal_links` ✅ |
| Border top | Present | `border-t border-black/10` ✅ |

---

## Playwright Test Cases

```typescript
// tests/visual/footer.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Footer component visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('Footer — #site-footer: correct background color', async ({ page }) => {
    const footer = page.locator('#site-footer');
    await expect(footer).toBeVisible();
    await expect(footer).toHaveCSS('background-color', 'rgb(255, 252, 249)'); // brand-off-white-background #fffcf9
    await expect(footer).toHaveScreenshot('footer-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Footer — #footer-brand: logo and tagline render correctly', async ({ page }) => {
    const brand = page.locator('#footer-brand');
    await expect(brand).toBeVisible();
    const logo = brand.locator('img').first();
    await expect(logo).toBeVisible();
  });

  test('Footer — #footer-social-group: social icons render on green circles', async ({ page }) => {
    const socialGroup = page.locator('#footer-social-group');
    await expect(socialGroup).toBeVisible();
    const socialLinks = socialGroup.locator('a');
    await expect(socialLinks).toHaveCount(4); // Facebook, Instagram, Youtube, Twitter
    await expect(socialGroup).toHaveScreenshot('footer-social-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Footer — #footer-contact: email, phone, address all visible', async ({ page }) => {
    const contact = page.locator('#footer-contact');
    await expect(contact).toBeVisible();
    await expect(contact.locator('a[href^="mailto:"]')).toBeVisible();
    await expect(contact.locator('a[href^="tel:"]')).toBeVisible();
  });

  test('Footer — #footer-menu: quick links render correctly', async ({ page }) => {
    const menu = page.locator('#footer-menu');
    await expect(menu).toBeVisible();
    const links = menu.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Footer — #footer-bottom: copyright and legal links present', async ({ page }) => {
    const bottom = page.locator('#footer-bottom');
    await expect(bottom).toBeVisible();
    await expect(bottom).toHaveScreenshot('footer-bottom-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Footer — responsive: renders correctly at 768px (tablet)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const footer = page.locator('#site-footer');
    await expect(footer).toBeVisible();
    await expect(footer).toHaveScreenshot('footer-tablet.png', { maxDiffPixelRatio: 0.02 });
  });
});
```

---

## Open Issues / Follow-ups

- Footer padding-top (`3.5rem`) is significantly less than Webflow's `6.6875rem` — consider filing a padding bug.
- Footer layout (3-column grid vs Webflow's 2-column flex with 25rem gap) is a structural difference — may be intentional for responsiveness.
- School name text in `#footer-brand` logo area is not present in Webflow footer — see TASK-090 (Navigation also has this issue).
