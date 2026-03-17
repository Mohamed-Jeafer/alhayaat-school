/**
 * Visual comparison: full-page screenshots of Webflow vs Next.js.
 * After running, open playwright-report/index.html to see side-by-side diffs.
 * Screenshots are saved to test-results/screenshots/.
 */
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { PAGES, WEBFLOW_BASE, NEXTJS_BASE } from './helpers';

const SCREENSHOT_DIR = path.join(process.cwd(), 'test-results', 'screenshots');

test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
});

for (const entry of PAGES) {
  test(`[Visual] ${entry.name}`, async ({ page, browserName }, testInfo) => {
    const viewportLabel = testInfo.project.name; // 'desktop' or 'mobile'
    const slug = entry.name.toLowerCase().replace(/\s+/g, '-');

    // --- Webflow screenshot ---
    await page.goto(`${WEBFLOW_BASE}${entry.webflow}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500); // let animations settle
    const wfPath = path.join(SCREENSHOT_DIR, `${slug}-${viewportLabel}-webflow.png`);
    await page.screenshot({ path: wfPath, fullPage: true });

    // --- Next.js screenshot ---
    await page.goto(`${NEXTJS_BASE}${entry.nextjs}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const njPath = path.join(SCREENSHOT_DIR, `${slug}-${viewportLabel}-nextjs.png`);
    await page.screenshot({ path: njPath, fullPage: true });

    // Attach both to the Playwright HTML report for easy comparison
    await testInfo.attach(`webflow-${slug}-${viewportLabel}`, {
      path: wfPath,
      contentType: 'image/png',
    });
    await testInfo.attach(`nextjs-${slug}-${viewportLabel}`, {
      path: njPath,
      contentType: 'image/png',
    });

    // Both pages must load without error (status 200)
    const wfRes = await page.goto(`${WEBFLOW_BASE}${entry.webflow}`);
    const njRes = await page.goto(`${NEXTJS_BASE}${entry.nextjs}`);
    expect(wfRes?.status(), `Webflow ${entry.name} returned non-200`).toBe(200);
    expect(njRes?.status(), `Next.js ${entry.name} returned non-200`).toBe(200);
  });
}

test.afterAll(async ({}, testInfo) => {
  // Generate a simple side-by-side HTML gallery from all saved screenshots
  const files = fs.readdirSync(SCREENSHOT_DIR).filter(f => f.endsWith('.png'));
  const pages = [...new Set(files.map(f => f.replace(/-desktop.*|mobile.*/, '')))];

  const rows = pages.map(slug => {
    const viewport = testInfo.project.name;
    const wf = `${slug}-${viewport}-webflow.png`;
    const nj = `${slug}-${viewport}-nextjs.png`;
    const hasWf = files.includes(wf);
    const hasNj = files.includes(nj);
    return `
      <tr>
        <td style="padding:8px;font-weight:bold;text-transform:capitalize">${slug.replace(/-/g, ' ')}</td>
        <td style="padding:8px">${hasWf ? `<img src="${wf}" style="max-width:700px;border:1px solid #ccc">` : '—'}</td>
        <td style="padding:8px">${hasNj ? `<img src="${nj}" style="max-width:700px;border:1px solid #ccc">` : '—'}</td>
      </tr>`;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Webflow vs Next.js — Visual Diff (${testInfo.project.name})</title>
  <style>
    body { font-family: sans-serif; margin: 0; padding: 16px; background: #f9f9f9; }
    h1 { font-size: 1.4rem; margin-bottom: 1rem; }
    table { border-collapse: collapse; width: 100%; }
    th { background: #222; color: #fff; padding: 10px 8px; text-align: left; }
    tr:nth-child(even) { background: #f0f0f0; }
    img { display: block; }
  </style>
</head>
<body>
  <h1>Webflow vs Next.js — Visual Diff (${testInfo.project.name})</h1>
  <table>
    <thead>
      <tr><th>Page</th><th>Webflow</th><th>Next.js</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

  const reportPath = path.join(SCREENSHOT_DIR, `report-${testInfo.project.name}.html`);
  fs.writeFileSync(reportPath, html);
});
