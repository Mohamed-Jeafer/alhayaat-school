---
id: m-8
title: "Phase 8: Testing & Deployment (40h)"
---

## Description

Comprehensive testing, production deployment, and launch.

## Production cutover (April 2026)

The marketing site is **live** at **https://www.alhayaat.ca/** on **Azure App Service** (`al-hayaat-prod`). Webflow is no longer the production host. DNS: **decoupled apex** on cPanel (stable A record), **`www` CNAME** → `al-hayaat-prod.azurewebsites.net`, **wildcard 301** apex → `https://www` with path preserved (**do not redirect www**). Azure: custom domains validated, **App Service managed certificate**, **HTTPS only**. Documentation: **`docs/PRODUCTION-HOSTING.md`**, **`cpanel_zone_editor.md`**, **`README.md`** (Production section).
