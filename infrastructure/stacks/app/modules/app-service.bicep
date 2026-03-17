@description('Application name')
param appName string
param location string
param tags object
param environment string

@description('Resource ID of the user-assigned managed identity from the infra stack')
param identityResourceId string

@description('Client ID of the user-assigned managed identity (set as AZURE_CLIENT_ID app setting)')
param identityClientId string

@description('Key Vault name in the infra stack (used to build Key Vault reference URIs)')
param keyVaultName string

var skuMap = {
  dev:     { name: 'B1',   tier: 'Basic' }
  staging: { name: 'S1',   tier: 'Standard' }
  prod:    { name: 'P1v2', tier: 'PremiumV2' }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: '${appName}-plan'
  location: location
  tags: tags
  sku: skuMap[environment]
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource appService 'Microsoft.Web/sites@2023-01-01' = {
  name: appName
  location: location
  tags: tags
  // Use the user-assigned managed identity from the infra stack.
  // This identity already has Key Vault Secrets User role — no cross-RG role assignment needed.
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${identityResourceId}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      nodeVersion: '20-lts'
      appSettings: [
        { name: 'NODE_ENV',       value: 'production' }
        { name: 'NEXTAUTH_URL',   value: 'https://${appName}.azurewebsites.net' }
        // Required so Azure SDK picks up the user-assigned identity (not system-assigned)
        { name: 'AZURE_CLIENT_ID', value: identityClientId }
        // Key Vault references — resolved at runtime using the managed identity
        { name: 'STRIPE_SECRET_KEY',                  value: '@Microsoft.KeyVault(SecretUri=https://${keyVaultName}.vault.azure.net/secrets/STRIPE-SECRET-KEY/)' }
        { name: 'STRIPE_WEBHOOK_SECRET',              value: '@Microsoft.KeyVault(SecretUri=https://${keyVaultName}.vault.azure.net/secrets/STRIPE-WEBHOOK-SECRET/)' }
        { name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', value: '@Microsoft.KeyVault(SecretUri=https://${keyVaultName}.vault.azure.net/secrets/STRIPE-PUBLISHABLE-KEY/)' }
        { name: 'DATABASE_URL',                       value: '@Microsoft.KeyVault(SecretUri=https://${keyVaultName}.vault.azure.net/secrets/DATABASE-URL/)' }
        { name: 'RESEND_API_KEY',                     value: '@Microsoft.KeyVault(SecretUri=https://${keyVaultName}.vault.azure.net/secrets/RESEND-API-KEY/)' }
        { name: 'NEXTAUTH_SECRET',                    value: '@Microsoft.KeyVault(SecretUri=https://${keyVaultName}.vault.azure.net/secrets/NEXTAUTH-SECRET/)' }
      ]
      alwaysOn: environment != 'dev'
    }
    httpsOnly: true
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${appName}-insights'
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    RetentionInDays: 90
  }
}

output defaultHostName string = appService.properties.defaultHostName
output appServiceName string = appService.name
