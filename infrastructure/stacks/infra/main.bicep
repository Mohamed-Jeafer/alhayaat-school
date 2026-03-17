// Al-Hayaat School — Infrastructure Stack
// Resource Group: rg-alhayaat-infra-{env}
//
// Provisions all stateful Azure services: identity, database, key vault, storage.
// Future services (Azure Functions, Cosmos DB, API Management, Service Bus, etc.) go here.
//
// Deploy:
//   az deployment group create \
//     --resource-group rg-alhayaat-infra-{env} \
//     --template-file infrastructure/stacks/infra/main.bicep \
//     --parameters infrastructure/stacks/infra/parameters/{env}.json \
//     --parameters dbAdminPassword=<secret>

@description('Environment name (dev, staging, prod)')
param environment string

@description('Location for all resources')
param location string = resourceGroup().location

@description('PostgreSQL admin login')
param dbAdminLogin string

@secure()
@description('PostgreSQL admin password — pass via --parameters flag, never commit to source')
param dbAdminPassword string

var appName = 'al-hayaat-${environment}'
var tags = {
  project: 'al-hayaat-school'
  environment: environment
  stack: 'infra'
}

// User-assigned managed identity shared with the app stack.
// App Service uses this identity to authenticate with Key Vault.
module identity 'modules/identity.bicep' = {
  name: 'identity'
  params: {
    identityName: '${appName}-identity'
    location: location
    tags: tags
  }
}

module database 'modules/database.bicep' = {
  name: 'database'
  params: {
    serverName: '${appName}-psql'
    location: location
    tags: tags
    adminLogin: dbAdminLogin
    adminPassword: dbAdminPassword
  }
}

module keyVault 'modules/keyvault.bicep' = {
  name: 'keyVault'
  params: {
    vaultName: '${appName}-kv'
    location: location
    tags: tags
    identityPrincipalId: identity.outputs.identityPrincipalId
  }
}

module storage 'modules/storage.bicep' = {
  name: 'storage'
  params: {
    storageAccountName: replace('${appName}storage', '-', '')
    location: location
    tags: tags
  }
}

// ── Outputs ───────────────────────────────────────────────────────────────────
// Copy identityResourceId and identityClientId into
// infrastructure/stacks/app/parameters/{env}.json before deploying the app stack.

output keyVaultName string = keyVault.outputs.vaultName
output keyVaultUri string = keyVault.outputs.vaultUri
output identityResourceId string = identity.outputs.identityResourceId
output identityClientId string = identity.outputs.identityClientId
output dbServerFqdn string = database.outputs.serverFqdn
output storageAccountName string = storage.outputs.storageAccountName
