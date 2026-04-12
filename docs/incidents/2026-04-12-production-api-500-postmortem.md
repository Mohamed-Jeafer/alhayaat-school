# Incident Postmortem — Production API 500 Errors
**Date:** 2026-04-12  
**Severity:** High — all form submissions failing in production  
**Status:** Resolved  

---

## Summary

Every `POST` request to `/api/contact`, `/api/application`, and `/api/jobs/apply` was returning `500 {"error":"Something went wrong. Please try again."}` on the production Azure App Service. No data was being saved. The site was effectively non-functional for all user-facing forms.

---

## Timeline

| Time | Event |
|------|-------|
| Session start | User reports `/api/application` curl returns 500 |
| +5 min | Confirmed `/api/contact` also 500 — all DB routes failing |
| +15 min | Discovered the error object was logging as `{}` — actual message invisible |
| +20 min | Identified 5 distinct root causes (see below) |
| +60 min | All fixes applied; `200 OK` confirmed on both endpoints |

---

## Root Causes

### 1. Database schema never applied to production

**What happened:** The PostgreSQL database was provisioned as part of the Azure infrastructure deployment, but `scripts/db/schema.sql` was never run against it. Every table (`applications`, `contact_submissions`, `job_applications`, etc.) was missing.

**How found:** Ran `\dt` via psql after gaining DB access — zero tables returned.

**Fix:** Ran `scripts/db/schema.sql` against the production database.

---

### 2. Wrong password stored in Key Vault

**What happened:** The `DATABASE-URL` secret in Azure Key Vault contained an incorrect password. The app was attempting to connect with the wrong credentials.

**How found:** After adding a local firewall rule, a direct psql connection returned `FATAL: password authentication failed`.

**Fix:** Reset the PostgreSQL admin password via `az postgres flexible-server update --admin-password`, then updated the `DATABASE-URL` Key Vault secret and the `DATABASE_URL` App Service setting.

---

### 3. SSL conflict between connection string and pg Pool config

**What happened:** The connection string contained `?sslmode=require`. In `pg` v8+, `sslmode=require` is silently treated as `verify-full` (full certificate chain verification). The Azure Flexible Server certificate was failing Node.js verification, causing every connection attempt to be terminated.

An attempt to fix this by adding `ssl: { rejectUnauthorized: false }` to the Pool config was not sufficient on its own because the connection string's SSL mode was overriding the explicit Pool option.

**Warning visible in logs:**
```
Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' 
are treated as aliases for 'verify-full'.
```

**Fix:** Removed `sslmode=require` from the `DATABASE_URL` entirely. Configured SSL exclusively via the Pool options:

```typescript
// src/lib/db.ts
pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Azure Flexible Server cert chain
  connectionTimeoutMillis: 10_000,    // was 2000ms — too tight for Azure
  ...
});
```

---

### 4. PostgreSQL firewall blocked the App Service

**What happened:** The PostgreSQL Flexible Server firewall only had ad-hoc local developer IPs. The Azure App Service outbound IPs (6 addresses in the Canada Central region) were not whitelisted. Every connection attempt from the running app timed out.

**Error visible in logs (after fixing logger):**
```
[contact] DB error {"message":"Connection terminated due to connection timeout","name":"Error"}
```

**Fix:** Added the Azure-managed `AllowAllAzureServices` firewall rule:

```bash
az postgres flexible-server firewall-rule create \
  --name al-hayaat-prod-psql \
  --resource-group rg-alhayaat-infra-prod \
  --rule-name AllowAllAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

> **Note:** The special range `0.0.0.0–0.0.0.0` is Azure's sentinel value for "allow all Azure-internal services." It does **not** open the database to the public internet.

---

### 5. Logger serialized Error objects as `{}`

**What happened:** `JSON.stringify(new Error('message'))` returns `{}` because `Error` properties (`message`, `stack`, `name`) are non-enumerable. Every DB error was logged as `[contact] DB error {}`, making diagnosis very slow.

**Fix:** Added a `serializeData()` helper to `src/lib/logger.ts`:

```typescript
function serializeData(data: unknown): string {
  if (data instanceof Error) {
    return JSON.stringify({
      message: data.message,
      name: data.name,
      code: (data as NodeJS.ErrnoException).code,
    });
  }
  return JSON.stringify(data);
}
```

---

## Files Changed

| File | Change |
|------|--------|
| `src/lib/db.ts` | Always set `ssl: { rejectUnauthorized: false }`, raise timeout to 10 s |
| `src/lib/logger.ts` | Fix `serializeData()` to handle `Error` objects |
| `scripts/db/schema.sql` | Comment out `CREATE EXTENSION pgcrypto` (not allow-listed on Azure; `gen_random_uuid()` is built-in on PostgreSQL 15) |

---

## Infrastructure Changes

| Resource | Change |
|----------|--------|
| Azure PostgreSQL password | Reset via `az postgres flexible-server update` |
| Key Vault `DATABASE-URL` | Updated to use new password (no `sslmode=require`) |
| App Service `DATABASE_URL` | Set directly to match Key Vault value |
| PostgreSQL firewall | Added `AllowAllAzureServices` rule (0.0.0.0 → 0.0.0.0) |
| PostgreSQL schema | Applied `scripts/db/schema.sql` — all 6 tables created |

---

## Prevention

1. **Add DB schema apply step to the deployment pipeline** — the CI/CD workflow (`deploy-prod.yml`) should run schema migrations before starting the app. Consider adopting a migration tool (e.g., `node-pg-migrate`) to track applied migrations.

2. **Add `AllowAllAzureServices` to the Bicep template** — `infrastructure/stacks/infra/modules/database.bicep` should include this firewall rule so it is applied automatically on every infrastructure deployment.

3. **Add a health-check endpoint** — a `GET /api/health` that performs a lightweight `SELECT 1` query would have made this failure immediately obvious in monitoring.

4. **Test production connectivity as part of deployment** — the post-deploy smoke test should hit at least one DB-backed endpoint and assert a non-500 response.
