/**
 * CSS / style comparison: checks key computed styles for shared elements.
 * Focuses on typography, colours, and spacing for nav, headings, and body.
 */
import { test } from '@playwright/test';
import { PAGES, WEBFLOW_BASE, NEXTJS_BASE, extractComputedStyles } from './helpers';

const STYLE_CHECKS: Array<{ selector: string; label: string; props: string[] }> = [
  { selector: 'body',   label: 'Body',       props: ['font-family', 'color', 'background-color'] },
  { selector: 'h1',     label: 'H1',         props: ['font-size', 'font-weight', 'color', 'font-family'] },
  { selector: 'h2',     label: 'H2',         props: ['font-size', 'font-weight', 'color'] },
  { selector: 'nav',    label: 'Nav',        props: ['background-color', 'padding-top', 'padding-bottom'] },
  { selector: 'a',      label: 'Link',       props: ['color', 'text-decoration'] },
  { selector: 'button', label: 'Button',     props: ['background-color', 'color', 'border-radius', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right'] },
  { selector: 'footer', label: 'Footer',     props: ['background-color', 'color'] },
];

for (const entry of PAGES) {
  test(`[Styles] ${entry.name} — computed CSS`, async ({ page }) => {
    console.log(`\n=== ${entry.name} Computed Styles ===`);
    console.log(`${'Element'.padEnd(10)} ${'Property'.padEnd(22)} ${'Webflow'.padEnd(40)} Next.js`);
    console.log('-'.repeat(110));

    for (const check of STYLE_CHECKS) {
      await page.goto(`${WEBFLOW_BASE}${entry.webflow}`, { waitUntil: 'networkidle' });
      const wfStyles = await extractComputedStyles(page, check.selector, check.props);

      await page.goto(`${NEXTJS_BASE}${entry.nextjs}`, { waitUntil: 'networkidle' });
      const njStyles = await extractComputedStyles(page, check.selector, check.props);

      if (!wfStyles || !njStyles) {
        console.log(`  ${check.label}: element "${check.selector}" not found on one of the pages`);
        continue;
      }

      for (const prop of check.props) {
        const wfVal = wfStyles[prop] ?? '—';
        const njVal = njStyles[prop] ?? '—';
        const match = wfVal === njVal ? '✓' : '✗';
        console.log(`${match} ${check.label.padEnd(10)} ${prop.padEnd(22)} ${wfVal.padEnd(40)} ${njVal}`);
      }
    }

    // This test always passes — it's a diagnostic/reporting test
    // Remove the line below and add specific assertions for hard requirements
  });
}
