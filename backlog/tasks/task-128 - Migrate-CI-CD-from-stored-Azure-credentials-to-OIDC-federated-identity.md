---
id: TASK-128
title: Migrate CI/CD from stored Azure credentials to OIDC federated identity
status: Done
assignee: []
created_date: '2026-04-11 12:34'
labels:
  - ci-cd
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replace the AZURE_CREDENTIALS JSON secret (stored service principal credentials) across all 7 GitHub Actions workflows with OIDC federated credentials. This eliminates rotating secrets and uses GitHub's built-in identity token for Azure authentication.
<!-- SECTION:DESCRIPTION:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Updated all 7 workflows (ci.yml, deploy-dev.yml, deploy-staging.yml, deploy-prod.yml, deploy-infra-dev.yml, deploy-infra-staging.yml, deploy-infra-prod.yml) to use azure/login@v2 with client-id, tenant-id, subscription-id instead of AZURE_CREDENTIALS JSON. Added permissions: id-token: write to all relevant jobs. Removed AZURE_CREDENTIALS, DATABASE_URL, NEXTAUTH_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET from GitHub secrets. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY moved to Actions variable (baked into build bundle). Federated credential subject: repo:Al-Hayaat-School-IT-Development/website:ref:refs/heads/master. Also fixed all branch references master->main and corrected deploy-prod paths-ignore.
<!-- SECTION:FINAL_SUMMARY:END -->
