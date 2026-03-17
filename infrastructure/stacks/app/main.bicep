// Al-Hayaat School — Application Stack
// Resource Group: rg-alhayaat-app-{env}
//
// Provisions compute resources only: App Service Plan, App Service, App Insights.
// Secrets are read from Key Vault in the infra stack via the shared managed identity.
//
// Prerequisites: Deploy infrastructure/stacks/infra first and copy its outputs here.
//
// Deploy:
//   az deployment group create \
//     --resource-group rg-alhayaat-app-{env} \
//     --template-file infrastructure/stacks/app/main.bicep \
//     --parameters infrastructure/stacks/app/parameters/{env}.json

@description('Environment name (dev, staging, prod)')
param environment string

@description('Location for all resources')
param location string = resourceGroup().location

@description('Resource ID of the user-assigned managed identity from the infra stack output: identityResourceId')
param identityResourceId string

@description('Client ID of the user-assigned managed identity from the infra stack output: identityClientId')
param identityClientId string

@description('Name of the Key Vault in the infra stack output: keyVaultName')
param keyVaultName string

var appName = 'al-hayaat-${environment}'
var tags = {
  project: 'al-hayaat-school'
  environment: environment
  stack: 'app'
}

module appService 'modules/app-service.bicep' = {
  name: 'appService'
  params: {
    appName: appName
    location: location
    tags: tags
    environment: environment
    identityResourceId: identityResourceId
    identityClientId: identityClientId
    keyVaultName: keyVaultName
  }
}

output appServiceUrl string = appService.outputs.defaultHostName
output appServiceName string = appName
