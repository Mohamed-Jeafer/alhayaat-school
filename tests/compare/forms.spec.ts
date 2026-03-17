/**
 * Form comparison: inputs, labels, and submit buttons.
 * Checks that all form fields in Webflow are replicated in Next.js.
 */
import { test, expect } from '@playwright/test';
import { PAGES, WEBFLOW_BASE, NEXTJS_BASE, extractFormFields } from './helpers';

// Only compare pages that have forms
const FORM_PAGES = PAGES.filter(p =>
  ['Contact', 'Application', 'Donate', 'Careers'].includes(p.name)
);

for (const entry of FORM_PAGES) {
  test(`[Forms] ${entry.name} — input fields`, async ({ page }) => {
    await page.goto(`${WEBFLOW_BASE}${entry.webflow}`, { waitUntil: 'networkidle' });
    const wfForm = await extractFormFields(page);

    await page.goto(`${NEXTJS_BASE}${entry.nextjs}`, { waitUntil: 'networkidle' });
    const njForm = await extractFormFields(page);

    console.log(`\n=== ${entry.name} Forms ===`);
    console.log(`Webflow inputs (${wfForm.inputs.length}):`, JSON.stringify(wfForm.inputs, null, 2));
    console.log(`Next.js inputs (${njForm.inputs.length}):`, JSON.stringify(njForm.inputs, null, 2));

    // Next.js should have at least as many inputs as Webflow
    expect(
      njForm.inputs.length,
      `${entry.name}: Next.js has fewer inputs (${njForm.inputs.length}) than Webflow (${wfForm.inputs.length})`
    ).toBeGreaterThanOrEqual(wfForm.inputs.length);
  });

  test(`[Forms] ${entry.name} — labels`, async ({ page }) => {
    await page.goto(`${WEBFLOW_BASE}${entry.webflow}`, { waitUntil: 'networkidle' });
    const wfForm = await extractFormFields(page);

    await page.goto(`${NEXTJS_BASE}${entry.nextjs}`, { waitUntil: 'networkidle' });
    const njForm = await extractFormFields(page);

    const njLabelTexts = njForm.labels.map(l => l.text.toLowerCase().trim());

    console.log(`\n=== ${entry.name} Labels ===`);
    console.log('Webflow:', wfForm.labels.map(l => l.text).join(', '));
    console.log('Next.js:', njForm.labels.map(l => l.text).join(', '));

    for (const wfLabel of wfForm.labels) {
      if (!wfLabel.text) continue;
      const found = njLabelTexts.some(t => t.includes(wfLabel.text.toLowerCase().trim()));
      expect(
        found,
        `Label "${wfLabel.text}" from Webflow not found in Next.js ${entry.name} form`
      ).toBe(true);
    }
  });

  test(`[Forms] ${entry.name} — submit button`, async ({ page }) => {
    await page.goto(`${WEBFLOW_BASE}${entry.webflow}`, { waitUntil: 'networkidle' });
    const wfForm = await extractFormFields(page);

    await page.goto(`${NEXTJS_BASE}${entry.nextjs}`, { waitUntil: 'networkidle' });
    const njForm = await extractFormFields(page);

    const wfSubmit = wfForm.buttons.find(
      b => b.type === 'submit' || b.tag === 'button' || b.text.toLowerCase().includes('submit') || b.text.toLowerCase().includes('send')
    );
    const njSubmit = njForm.buttons.find(
      b => b.type === 'submit' || b.tag === 'button' || b.text.toLowerCase().includes('submit') || b.text.toLowerCase().includes('send')
    );

    console.log(`\n=== ${entry.name} Buttons ===`);
    console.log('Webflow submit:', wfSubmit);
    console.log('Next.js submit:', njSubmit);

    expect(
      njSubmit,
      `${entry.name}: No submit button found on Next.js page`
    ).toBeTruthy();
  });
}
