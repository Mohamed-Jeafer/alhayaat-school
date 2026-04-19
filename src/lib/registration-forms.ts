/**
 * Registration PDFs: local `public/assets/registration/` or Azure Blob / CDN.
 *
 * **Remote:** set `NEXT_PUBLIC_REGISTRATION_FORMS_BASE_URL` to the folder URL with **no trailing slash**.
 * Each `admissions.json` filename is appended with `encodeURIComponent` (e.g. `Financial Agreement.pdf`
 * → `.../Financial%20Agreement.pdf`), matching blob paths that use spaces in the object name.
 *
 * The browser follows this URL directly (static href). **`@azure/storage-blob` is not used here**; it is
 * only used server-side for **careers resume uploads** (`job-application.service.ts`).
 *
 * On Azure, **`NEXT_PUBLIC_REGISTRATION_FORMS_BASE_URL`** is set by **`infrastructure/stacks/app/modules/app-service.bicep`**
 * (same URL shape as infra output `registrationFormsPublicBaseUrl`). GitHub deploy workflows set the same value at **`npm run build`**
 * using **`az cloud show --query suffixes.storage`** after **`azure/login`**, matching Bicep’s **`az.environment().suffixes.storage`** for non-public clouds.
 *
 * Examples (public Azure, prod):
 * - `https://alhayaatassetsprod.blob.core.windows.net/school-registration`
 * - CDN (Azure Front Door / CDN): `https://<your-endpoint>.azureedge.net/school-registration` — same
 *   object keys; only this env value changes when you front the container with a CDN.
 *
 * If unset, links use same-origin `/assets/registration/<encoded-filename>`.
 *
 * Security (Azure Blob Storage):
 * - Prefer a private container; do not put long-lived SAS tokens in NEXT_PUBLIC env.
 * - Options:
 *   1) **API route + short SAS** — `GET /api/registration-forms/[id]` validates session or rate-limits,
 *    then redirects to a blob URL with SAS valid for minutes (server uses AZURE_STORAGE_* only).
 *   2) **Public read-only container** — only for non-sensitive blanks; use stable URLs + CDN in front.
 *   3) **Static web hosting / CDN** — immutable filenames; rotate by bumping version in filename (`_v2`).
 *
 * Filenames must match `admissions.json` `requirements.forms[].file`.
 */
export function registrationFormHref(filename: string): string {
  const base = process.env.NEXT_PUBLIC_REGISTRATION_FORMS_BASE_URL?.trim();
  if (base) {
    return `${base.replace(/\/$/, '')}/${encodeURIComponent(filename)}`;
  }
  return `/assets/registration/${encodeURIComponent(filename)}`;
}
