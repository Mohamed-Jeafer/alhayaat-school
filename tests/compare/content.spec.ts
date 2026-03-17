/**
 * Content comparison: headings, paragraph text, and nav links.
 * Checks that key text content from Webflow is present in the Next.js build.
 */
import { test, expect } from '@playwright/test';
import {
  PAGES, WEBFLOW_BASE, NEXTJS_BASE,
  extractHeadings, extractNavLinks, extractParagraphs,
} from './helpers';

for (const entry of PAGES) {
  test(`[Content] ${entry.name} — headings match`, async ({ page }) => {
    await page.goto(`${WEBFLOW_BASE}${entry.webflow}`, { waitUntil: 'networkidle' });
    const wfHeadings = await extractHeadings(page);

    await page.goto(`${NEXTJS_BASE}${entry.nextjs}`, { waitUntil: 'networkidle' });
    const njHeadings = await extractHeadings(page);

    // Log both sets for visibility in the report
    console.log(`\n=== ${entry.name} Headings ===`);
    console.log('Webflow :', wfHeadings.map(h => `${h.tag}: "${h.text}"`).join(' | '));
    console.log('Next.js :', njHeadings.map(h => `${h.tag}: "${h.text}"`).join(' | '));

    // Every Webflow heading text should appear somewhere in the Next.js page
    const njAllText = njHeadings.map(h => h.text.toLowerCase());
    for (const wfH of wfHeadings) {
      if (!wfH.text) continue;
      const found = njAllText.some(t => t.includes(wfH.text.toLowerCase()));
      expect(
        found,
        `Missing heading "${wfH.text}" (${wfH.tag}) on Next.js ${entry.name} page`
      ).toBe(true);
    }
  });

  test(`[Content] ${entry.name} — paragraph text coverage`, async ({ page }) => {
    await page.goto(`${WEBFLOW_BASE}${entry.webflow}`, { waitUntil: 'networkidle' });
    const wfParas = await extractParagraphs(page);

    await page.goto(`${NEXTJS_BASE}${entry.nextjs}`, { waitUntil: 'networkidle' });
    const njParas = await extractParagraphs(page);

    console.log(`\n=== ${entry.name} Paragraphs ===`);
    console.log(`Webflow: ${wfParas.length} paragraphs`);
    console.log(`Next.js: ${njParas.length} paragraphs`);

    // Next.js should have at least as many paragraphs as Webflow
    expect(
      njParas.length,
      `${entry.name}: Next.js has fewer paragraphs (${njParas.length}) than Webflow (${wfParas.length})`
    ).toBeGreaterThanOrEqual(wfParas.length);
  });

  test(`[Content] ${entry.name} — nav links present`, async ({ page }) => {
    await page.goto(`${WEBFLOW_BASE}${entry.webflow}`, { waitUntil: 'networkidle' });
    const wfLinks = await extractNavLinks(page);

    await page.goto(`${NEXTJS_BASE}${entry.nextjs}`, { waitUntil: 'networkidle' });
    const njLinks = await extractNavLinks(page);

    console.log(`\n=== ${entry.name} Nav Links ===`);
    console.log('Webflow :', wfLinks.map(l => l.text).join(', '));
    console.log('Next.js :', njLinks.map(l => l.text).join(', '));

    const njTexts = njLinks.map(l => l.text.toLowerCase().trim()).filter(Boolean);
    for (const wfLink of wfLinks) {
      if (!wfLink.text) continue;
      const found = njTexts.some(t => t.includes(wfLink.text.toLowerCase().trim()));
      expect(
        found,
        `Nav link "${wfLink.text}" from Webflow not found in Next.js ${entry.name}`
      ).toBe(true);
    }
  });
}
