# cPanel DNS and redirects — Al-Hayaat production

This file is the **operational runbook** for DNS and redirects after the **Webflow → Azure** migration. Keep it in sync with what you see in **cPanel → Zone Editor** and **Redirects**.

## Current architecture (summary)

1. **`www.alhayaat.ca`** → **CNAME** → `al-hayaat-prod.azurewebsites.net` (Next.js on Azure App Service).
2. **Apex `alhayaat.ca`** → **A** record to your **stable cPanel / hosting IP** (decoupled apex — not pointed at Azure’s IP).
3. **cPanel redirect:** **301** + **wildcard** from apex to **`https://www.alhayaat.ca/$1`** (path preserved). **Do not redirect `www`** to avoid loops with the CNAME to Azure.
4. **Azure:** Custom domains validated on the app; **managed TLS**; **HTTPS only** enforced in the portal.
5. **Removed from DNS:** Legacy **Webflow** verification / hosting records once cutover is complete.

## Azure domain verification

Add the **TXT** (and any **CNAME**) records **exactly as shown** in Azure Portal → App Service → **Custom domains** when you bind `www` and/or the apex. Azure often uses **`asuid`-style** hostnames for verification—copy those verbatim; do not guess values.

## What not to change casually

- **MX / Microsoft 365 / DKIM / SPF** mail records — only edit when changing email provider.
- **Dev / staging hostnames** (`dev.alhayaat.ca`, etc.) — keep isolated from production `www`.

## Full zone export

If you need a line-by-line zone dump for audits, export from **Zone Editor** and paste a redacted copy here (remove or shorten private DKIM key material if the repo is shared broadly).

**Historical note:** An older version of this file contained a full zone snapshot that still pointed `www` at `cdn.webflow.com` and included `_webflow` TXT verification. That state is **obsolete** after Azure migration.
