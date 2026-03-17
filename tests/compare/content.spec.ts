/**
 * Content comparison: headings, paragraph text, and nav links.
 * Checks that key text content from Webflow is present in the Next.js build.
 */
import { test, expect } from '@playwright/test';
import {
  PAGES, WEBFLOW_BASE, NEXTJS_BASE,
  extractHeadings, extractNavLinks, extractParagraphs,
} from './helpers';

/** Normalize text for loose comparison: collapse whitespace, NBSP → space, lowercase */
function normalize(text: string): string {
  return text.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
}

// contact.html in the Webflow export is a Webflow Style Guide template page,
// not the real contact page — skip heading/paragraph comparisons for it.
const SKIP_HEADING_PARA = new Set(['Contact']);

// contact.html nav contains style guide links (e.g. "Read the docs") — skip nav check too.
const SKIP_NAV = new Set(['Contact']);

for (const entry of PAGES) {
  test(`[Content] ${entry.name} — headings match`, async ({ page }) => {
    if (SKIP_HEADING_PARA.has(entry.name)) {
      test.skip(true, `${entry.name}: contact.html is a Webflow Style Guide template — skipping heading check`);
      return;
    }

    await page.goto(`${WEBFLOW_BASE}${entry.webflow}`, { waitUntil: 'networkidle' });
    const wfHeadings = await extractHeadings(page);

    await page.goto(`${NEXTJS_BASE}${entry.nextjs}`, { waitUntil: 'networkidle' });
    const njHeadings = await extractHeadings(page);

    // Log both sets for visibility in the report
    console.log(`\n=== ${entry.name} Headings ===`);
    console.log('Webflow :', wfHeadings.map(h => `${h.tag}: "${h.text}"`).join(' | '));
    console.log('Next.js :', njHeadings.map(h => `${h.tag}: "${h.text}"`).join(' | '));

    // Every Webflow heading text should appear somewhere in the Next.js page
    // Use normalize() to handle NBSP and whitespace differences from Webflow HTML
    const njAllText = njHeadings.map(h => normalize(h.text));
    for (const wfH of wfHeadings) {
      if (!wfH.text) continue;
      const wfNorm = normalize(wfH.text);
      const found = njAllText.some(t => t.includes(wfNorm));
      expect(
        found,
        `Missing heading "${wfH.text}" (${wfH.tag}) on Next.js ${entry.name} page`
      ).toBe(true);
    }
  });

  test(`[Content] ${entry.name} — paragraph text coverage`, async ({ page }) => {
    if (SKIP_HEADING_PARA.has(entry.name)) {
      test.skip(true, `${entry.name}: contact.html is a Webflow Style Guide template — skipping paragraph check`);
      return;
    }

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
    if (SKIP_NAV.has(entry.name)) {
      test.skip(true, `${entry.name}: contact.html nav includes Style Guide links — skipping nav check`);
      return;
    }

    await page.goto(`${WEBFLOW_BASE}${entry.webflow}`, { waitUntil: 'networkidle' });
    const wfLinks = await extractNavLinks(page);

    await page.goto(`${NEXTJS_BASE}${entry.nextjs}`, { waitUntil: 'networkidle' });
    const njLinks = await extractNavLinks(page);

    console.log(`\n=== ${entry.name} Nav Links ===`);
    console.log('Webflow :', wfLinks.map(l => l.text).join(', '));
    console.log('Next.js :', njLinks.map(l => l.text).join(', '));

    const njTexts = njLinks.map(l => normalize(l.text)).filter(Boolean);
    for (const wfLink of wfLinks) {
      if (!wfLink.text) continue;
      const wfNorm = normalize(wfLink.text);
      const found = njTexts.some(t => t.includes(wfNorm));
      expect(
        found,
        `Nav link "${wfLink.text}" from Webflow not found in Next.js ${entry.name}`
      ).toBe(true);
    }
  });
}
