# Production hosting: Azure App Service + cPanel DNS

**Public site:** [https://www.alhayaat.ca/](https://www.alhayaat.ca/)  
**Azure default hostname (for CNAME targets and portal):** `al-hayaat-prod.azurewebsites.net`

The marketing site was migrated off Webflow hosting onto **Next.js on Azure App Service** (`al-hayaat-prod`). DNS and apex HTTP behaviour use a **decoupled apex** pattern so the root domain does not depend on a volatile Azure front-end IP.

## 1. Domain architecture (decoupled apex)

- **Apex (`alhayaat.ca`)** stays on the **stable cPanel / hosting IP** (see your cPanel Zone Editor). That IP is the long-lived anchor for mail-related records, cPanel services, and **traffic shaping** (redirects).
- **`www.alhayaat.ca`** is a **CNAME** to `al-hayaat-prod.azurewebsites.net`. CNAMEs follow Azure’s internal routing if Microsoft moves the app; you do not chase A-record IP changes for `www`.
- **Rationale:** Pointing the naked apex directly at an Azure IP is brittle if that IP changes. Keeping apex on cPanel avoids that while still serving the app from Azure on `www`.

## 2. DNS (cPanel Zone Editor)

Typical production records after cutover:

| Name | Type | Purpose |
|------|------|---------|
| `alhayaat.ca` | A | Stable apex on hosting provider |
| `www.alhayaat.ca` | CNAME → `al-hayaat-prod.azurewebsites.net` | Serves the Next.js app |
| TXT records shown in Azure | TXT | **Domain verification** for custom hostname binding (e.g. `asuid`-style records Azure requests) |

**Cleanup:** Remove legacy **Webflow** verification TXT/CNAME entries once Webflow is no longer authoritative for the site.

Operational detail and any full zone export belong in **`cpanel_zone_editor.md`** at the repo root (keep that file aligned with what cPanel actually shows).

## 3. Path-preserving redirect (apex → www)

- In **cPanel Redirects**, configure a **301 Permanent** redirect with **wildcard** enabled so `http(s)://alhayaat.ca/<path>` becomes `https://www.alhayaat.ca/<path>` (paths preserved).
- Use **“Do not redirect www”** (or equivalent) so only **non-www** / apex traffic is rewritten—this avoids redirect loops with the `www` CNAME to Azure.

## 4. Azure (App Service)

Production uses **two resource groups** in Azure (same pattern for dev/staging with different suffixes):

| Resource group | Purpose |
|----------------|---------|
| **`rg-alhayaat-infra-prod`** | PostgreSQL (`al-hayaat-prod-psql`), Key Vault (`al-hayaat-prod-kv`), managed identity (`al-hayaat-prod-identity`), **private** blob storage **`alhayaatprodstorage`** (`resumes` / `uploads` — **careers resume uploads**), and **public-read** **`alhayaatassetsprod`** (`school-registration` PDFs, **`public-images`**) from **`modules/assets-storage.bicep`**. |
| **`rg-alhayaat-app-prod`** | App Service Plan (`al-hayaat-prod-plan`), Web App (`al-hayaat-prod`), Application Insights (`al-hayaat-prod-insights`). |

Full tables and deploy commands: **`infrastructure/README.md`**.

- **Custom domains:** Bind and validate **both** apex and `www` in the App Service **Custom domains** blade as required by your TLS strategy (managed certificate issuance may require the hostnames Azure lists).
- **TLS:** **App Service managed certificate** (free) where applicable; enforce **HTTPS only** in App Service configuration.
- **Future:** **Azure Front Door** or a WAF can sit in front later by changing the **`www`** CNAME to Front Door; the cPanel apex redirect can stay as-is.

## 5. What developers should use as “live” vs “design reference”

- **Live product:** `https://www.alhayaat.ca/`
- **Visual / CSS parity reference (export):** `al-hayaat.webflow/` in this repo and, if still published, the Webflow staging project URL used by the team.
