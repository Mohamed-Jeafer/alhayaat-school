import { Page } from '@playwright/test';

export const WEBFLOW_BASE = 'http://localhost:3001';
export const NEXTJS_BASE = 'http://localhost:3000';

export interface PageEntry {
  name: string;
  webflow: string;  // path on static Webflow server
  nextjs: string;   // path on Next.js dev server
}

export const PAGES: PageEntry[] = [
  { name: 'Home',        webflow: '/index.html',                    nextjs: '/' },
  { name: 'About',       webflow: '/about.html',                    nextjs: '/about' },
  { name: 'Curriculum',  webflow: '/academic-and-curriculum.html',  nextjs: '/curriculum' },
  { name: 'Admissions',  webflow: '/admission.html',                nextjs: '/admissions' },
  { name: 'Application', webflow: '/application.html',              nextjs: '/admissions/apply' },
  { name: 'Careers',     webflow: '/careers.html',                  nextjs: '/careers' },
  { name: 'Contact',     webflow: '/contact.html',                  nextjs: '/contact' },
  { name: 'Donate',      webflow: '/donate.html',                   nextjs: '/donate' },
  { name: 'SchoolPlans', webflow: '/school-plans.html',             nextjs: '/school-plan' },
];

/** Extract all visible text from headings on a page */
export async function extractHeadings(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(el => ({
      tag: el.tagName.toLowerCase(),
      text: (el as HTMLElement).innerText.trim(),
    }))
  );
}

/** Extract all nav links */
export async function extractNavLinks(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('nav a, header a')).map(el => ({
      text: (el as HTMLAnchorElement).innerText.trim(),
      href: (el as HTMLAnchorElement).getAttribute('href') ?? '',
    }))
  );
}

/** Extract all form fields */
export async function extractFormFields(page: Page) {
  return page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input, textarea, select')).map(el => ({
      type: (el as HTMLInputElement).type ?? el.tagName.toLowerCase(),
      name: (el as HTMLInputElement).name ?? '',
      placeholder: (el as HTMLInputElement).placeholder ?? '',
      required: (el as HTMLInputElement).required,
    }));
    const labels = Array.from(document.querySelectorAll('label')).map(el => ({
      text: (el as HTMLLabelElement).innerText.trim(),
      for: (el as HTMLLabelElement).htmlFor ?? '',
    }));
    const buttons = Array.from(document.querySelectorAll('button, input[type=submit], a.btn, a[class*="button"]')).map(el => ({
      tag: el.tagName.toLowerCase(),
      text: (el as HTMLElement).innerText.trim(),
      type: (el as HTMLButtonElement).type ?? '',
    }));
    return { inputs, labels, buttons };
  });
}

/** Extract computed CSS for a selector */
export async function extractComputedStyles(page: Page, selector: string, props: string[]) {
  return page.evaluate(
    ({ sel, properties }) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const style = getComputedStyle(el);
      return Object.fromEntries(properties.map(p => [p, style.getPropertyValue(p)]));
    },
    { sel: selector, properties: props }
  );
}

/** Extract all paragraph text (first 500 chars each) */
export async function extractParagraphs(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('p')).map(el =>
      (el as HTMLElement).innerText.trim().slice(0, 500)
    ).filter(t => t.length > 0)
  );
}
