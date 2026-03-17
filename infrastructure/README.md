# Azure Infrastructure

## Architecture — Two Stacks, Two Resource Groups

| Stack | Resource Group | What's in it |
|-------|---------------|--------------|
| **infra** | `rg-alhayaat-infra-{env}` | PostgreSQL, Key Vault, Storage, Managed Identity + future services (Azure Functions, Cosmos DB, API Management, Service Bus, etc.) |
| **app** | `rg-alhayaat-app-{env}` | App Service Plan, App Service, App Insights |

The separation means:
- Infrastructure changes (new DB, new storage container, new Azure service) never touch the application stack
- The app stack can be destroyed and redeployed without touching any stateful data
- Each stack has its own deployment pipeline and can be deployed independently

### Cross-stack secret access

A **User-Assigned Managed Identity** is created in the infra stack and granted `Key Vault Secrets User` on the Key Vault in the same stack. The app stack's App Service uses this identity to resolve `@Microsoft.KeyVault(...)` references at runtime — no secrets in App Settings, no cross-RG role assignment at deploy time.

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

Note the outputs — you need `identityResourceId` and `identityClientId` for the next step.

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
| `RESEND-API-KEY` | Resend email API key |

```bash
# Example
az keyvault secret set --vault-name al-hayaat-prod-kv --name DATABASE-URL --value "postgresql://..."
az keyvault secret set --vault-name al-hayaat-prod-kv --name NEXTAUTH-SECRET --value "$(openssl rand -base64 32)"
```

---

## Adding New Azure Services

To add a new service (e.g. Azure Functions, Cosmos DB, API Management):

1. Create a new module under `infrastructure/stacks/infra/modules/` (e.g. `functions.bicep`)
2. Reference it from `infrastructure/stacks/infra/main.bicep`
3. If the service needs Key Vault access, add it as a role assignment in `keyvault.bicep` or grant access via the shared managed identity
4. Run the infra deployment workflow — the app stack is unaffected
