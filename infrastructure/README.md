# Azure Infrastructure

## Architecture — Two Stacks, Two Resource Groups

| Stack | Resource Group | What's in it |
|-------|---------------|--------------|
| **infra** | `rg-alhayaat-infra-{env}` | PostgreSQL, Key Vault, **private** blob storage (`…storage` + `resumes` / `uploads`), **public** assets storage (`alhayaatassets{env}` + `school-registration` / `public-images`), User-Assigned Managed Identity, + future services (Functions, Cosmos DB, etc.) |
| **app** | `rg-alhayaat-app-{env}` | App Service Plan, App Service, Application Insights |

The separation means:
- Infrastructure changes (new DB, new storage container, new Azure service) never touch the application stack
- The app stack can be destroyed and redeployed without touching any stateful data
- Each stack has its own deployment pipeline and can be deployed independently

### Cross-stack secret access

A **User-Assigned Managed Identity** is created in the infra stack and granted `Key Vault Secrets User` on the Key Vault in the same stack. The app stack's App Service uses this identity to resolve `@Microsoft.KeyVault(...)` references at runtime — no secrets in App Settings, no cross-RG role assignment at deploy time.

The app stack sets **`keyVaultReferenceIdentity`** on the Web App to that user-assigned identity’s **resource ID**. Without this, Azure tries **system-assigned** managed identity for Key Vault reference resolution first; if it is disabled, references show **MSINotEnabled** / red errors in the portal.

### Production resource inventory (Canada Central)

Use this as a map when following portal links or `az` commands. **Dev / staging** use the same patterns with `dev` or `staging` instead of `prod`.

**`rg-alhayaat-infra-prod`** (infra Bicep stack — stateful services)

| Name | Type | Role |
|------|------|------|
| `al-hayaat-prod-identity` | User-assigned managed identity | Key Vault secret access; Microsoft Graph mail (`DefaultAzureCredential`) |
| `al-hayaat-prod-kv` | Key vault | `DATABASE-URL`, Stripe, `NEXTAUTH-SECRET`, `AZURE-STORAGE-CONNECTION-STRING`, etc. |
| `al-hayaat-prod-psql` | Azure Database for PostgreSQL flexible server | Application DB |
| **`alhayaatprodstorage`** | Storage account (Blob) | **Private** (no anonymous blob read). `resumes` / `uploads`. Connection string for **`AZURE-STORAGE-CONNECTION-STRING`** and `BlobServiceClient` in **careers resume uploads** (`job-application.service.ts`). |
| **`alhayaatassetsprod`** | Storage account (Blob) | **Public-read** blobs (`modules/assets-storage.bicep`). Containers **`school-registration`** and **`public-images`**. The **app** stack Bicep sets **`NEXT_PUBLIC_REGISTRATION_FORMS_BASE_URL`** on the Web App to `https://alhayaatassets{env}.blob.<cloud>/school-registration` (no trailing slash). Infra outputs **`registrationFormsPublicBaseUrl`** are the same string for verification. |

**`rg-alhayaat-app-prod`** (app Bicep stack — compute)

| Name | Type | Role |
|------|------|------|
| `al-hayaat-prod-plan` | App Service plan | SKU / scale for the Web App |
| `al-hayaat-prod` | App Service | Next.js production site |
| `al-hayaat-prod-insights` | Application Insights | Telemetry (`${appName}-insights` from Bicep) |

### Public assets storage (Bicep) — replacing a manual account

Prod account name **`alhayaatassetsprod`** is defined as `alhayaatassets` + `{environment}` in `infrastructure/stacks/infra/main.bicep` and implemented in **`modules/assets-storage.bicep`**. It belongs in **`rg-alhayaat-infra-{env}`**, not the app resource group.

1. **Back up** blobs from the old account (container **`school-registration`**).
2. **Delete** the old storage account in Azure (wait for any **soft-delete** / name lock to clear if you need the same global name).
3. Redeploy **`infrastructure/stacks/infra/main.bicep`** to the infra resource group.
4. **Upload** PDFs into **`school-registration`** again (object names must still match `src/content/admissions.json` `requirements.forms[].file`).
5. Redeploy the **app** stack (or rely on existing `app-service.bicep`) so the Web App gets **`NEXT_PUBLIC_REGISTRATION_FORMS_BASE_URL`** automatically. Optional: use infra output **`registrationFormsPublicBaseUrl`** to confirm it matches. **`public-images`** is for future large assets; **`publicImagesPublicBaseUrl`** documents that base path when you add it.

**Security:** anonymous read is enabled only for blobs in these containers. Do not store sensitive or PII content here.

---

## Deployment Order (first time)

### 1. Deploy the infra stack

```bash
# Dev
az deployment group create \
  --resource-group rg-alhayaat-infra-dev \
  --template-file infrastructure/stacks/infra/main.bicep \
  --parameters infrastructure/stacks/infra/parameters/dev.json \
  --parameters dbAdminPassword="<secure-password>"

# Staging
az deployment group create \
  --resource-group rg-alhayaat-infra-staging \
  --template-file infrastructure/stacks/infra/main.bicep \
  --parameters infrastructure/stacks/infra/parameters/staging.json \
  --parameters dbAdminPassword="<secure-password>"

# Production
az deployment group create \
  --resource-group rg-alhayaat-infra-prod \
  --template-file infrastructure/stacks/infra/main.bicep \
  --parameters infrastructure/stacks/infra/parameters/prod.json \
  --parameters dbAdminPassword="<secure-password>"
```

Note the outputs — you need **`identityResourceId`** and **`identityClientId`** for the app stack. **`registrationFormsPublicBaseUrl`** should match the **`NEXT_PUBLIC_REGISTRATION_FORMS_BASE_URL`** app setting applied by **`app-service.bicep`** when you deploy the app stack.

### 2. Deploy the app stack

```bash
az deployment group create \
  --resource-group rg-alhayaat-app-{env} \
  --template-file infrastructure/stacks/app/main.bicep \
  --parameters infrastructure/stacks/app/parameters/{env}.json \
  --parameters identityResourceId="<from infra output>" \
  --parameters identityClientId="<from infra output>"
```

Or update `infrastructure/stacks/app/parameters/{env}.json` with the identity values from step 1, then run without the extra `--parameters` flags.

---

## GitHub Actions Workflows

| Workflow | Trigger | What it deploys |
|----------|---------|----------------|
| `deploy-infra-dev.yml` | Push to `develop` (infra paths) or manual | Infra + App Bicep stacks to dev |
| `deploy-infra-staging.yml` | Manual (`confirm=staging`) | Infra + App Bicep stacks to staging |
| `deploy-infra-prod.yml` | Manual (`confirm=prod`) + GitHub environment approval | Infra + App Bicep stacks to prod |
| `deploy-dev.yml` | Push to `develop` (non-infra paths) | Next.js code to dev App Service |
| `deploy-staging.yml` | Manual (`confirm=staging`) | Next.js code to staging App Service |
| `deploy-prod.yml` | Push to `main` + GitHub environment approval | Next.js code to prod App Service |

App deploy workflows run **`azure/login`** before **`npm run build`**, then set **`NEXT_PUBLIC_REGISTRATION_FORMS_BASE_URL`** using **`az cloud show --query suffixes.storage`** (same endpoint segment Bicep uses via **`az.environment().suffixes.storage`**), so build-time URLs stay aligned with **public, Government, and China** clouds.

---

## GitHub Secrets Required

### Infrastructure workflows
| Secret | Description |
|--------|-------------|
| `AZURE_CREDENTIALS_DEV` | Azure service principal JSON for dev subscription |
| `AZURE_CREDENTIALS_STAGING` | Azure service principal JSON for staging subscription |
| `AZURE_CREDENTIALS_PROD` | Azure service principal JSON for prod subscription |
| `DB_ADMIN_PASSWORD_DEV` | PostgreSQL admin password for dev |
| `DB_ADMIN_PASSWORD_STAGING` | PostgreSQL admin password for staging |
| `DB_ADMIN_PASSWORD_PROD` | PostgreSQL admin password for prod |

### App deployment workflows
| Secret | Description |
|--------|-------------|
| `AZURE_WEBAPP_NAME_DEV` / `_STAGING` / `_PROD` | App Service name |
| `AZURE_PUBLISH_PROFILE_DEV` / `_STAGING` / `_PROD` | Azure publish profile XML |
| `DATABASE_URL_DEV` / `_STAGING` / `_PROD` | Postgres connection string (build-time only) |
| `NEXTAUTH_SECRET` | NextAuth.js secret |
| `STRIPE_PK_TEST` / `STRIPE_PK_LIVE` | Stripe publishable key |
| `STRIPE_SECRET_KEY_DEV` / `_PROD` | Stripe secret key (verification check) |
| `STRIPE_WEBHOOK_SECRET_DEV` / `_PROD` | Stripe webhook signing secret (verification check) |

---

## Key Vault Secrets to Populate After First Infra Deploy

These must be set in the Key Vault (`al-hayaat-{env}-kv`) before the App Service will start successfully:

| Secret Name | Description |
|-------------|-------------|
| `DATABASE-URL` | PostgreSQL connection string |
| `NEXTAUTH-SECRET` | Random 32-byte base64 string (`openssl rand -base64 32`) |
| `STRIPE-SECRET-KEY` | Stripe secret key |
| `STRIPE-WEBHOOK-SECRET` | Stripe webhook signing secret |
| `STRIPE-PUBLISHABLE-KEY` | Stripe publishable key |
| `AZURE-STORAGE-CONNECTION-STRING` | Azure Storage account connection string (careers resume uploads → `resumes` container) |

Transactional email uses **Microsoft Graph** with the Web App’s managed identity (`src/lib/email/client.ts`); no `RESEND-API-KEY` is required for the current app.

**Stripe test keys** for a separate dev/staging environment can live in that environment’s vault when you create it; production vault should keep **live** Stripe secrets only.

```bash
# Examples (prod vault name shown)
az keyvault secret set --vault-name al-hayaat-prod-kv --name DATABASE-URL --value "postgresql://..."
az keyvault secret set --vault-name al-hayaat-prod-kv --name NEXTAUTH-SECRET --value "$(openssl rand -base64 32)"
az keyvault secret set --vault-name al-hayaat-prod-kv --name STRIPE-WEBHOOK-SECRET --value "whsec_..."
# Connection string must be from the INFRA storage account (NOT alhayaatassetsprod):
az storage account show-connection-string \
  --name alhayaatprodstorage \
  --resource-group rg-alhayaat-infra-prod \
  --query connectionString -o tsv
# Paste the output into Key Vault:
az keyvault secret set --vault-name al-hayaat-prod-kv --name AZURE-STORAGE-CONNECTION-STRING --value "<paste-connection-string>"
```

### MSINotEnabled or Key Vault reference errors in the portal

1. **Web App → Identity:** ensure the **user-assigned** identity from the infra stack is attached (same as in Bicep).
2. **Web App → Settings → Environment variables:** ensure **`AZURE_CLIENT_ID`** equals that identity’s **Client ID** (for the Node/Azure SDK at runtime).
3. **Web App → Settings → Identity → Key vault reference identity** (or redeploy the **app** stack so `keyVaultReferenceIdentity` is set): choose the **same** user-assigned identity so `@Microsoft.KeyVault` resolution does not fall back to system-assigned.
4. **Key Vault → Access control (IAM):** the identity must have **Key Vault Secrets User** on the vault (infra Bicep assigns this).

---

## Adding New Azure Services

To add a new service (e.g. Azure Functions, Cosmos DB, API Management):

1. Create a new module under `infrastructure/stacks/infra/modules/` (e.g. `functions.bicep`)
2. Reference it from `infrastructure/stacks/infra/main.bicep`
3. If the service needs Key Vault access, add it as a role assignment in `keyvault.bicep` or grant access via the shared managed identity
4. Run the infra deployment workflow — the app stack is unaffected
