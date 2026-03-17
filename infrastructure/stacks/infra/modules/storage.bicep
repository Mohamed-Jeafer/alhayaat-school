param storageAccountName string
param location string
param tags object

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  tags: tags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-01-01' = {
  name: 'default'
  parent: storageAccount
}

resource resumesContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  name: 'resumes'
  parent: blobService
  properties: {
    publicAccess: 'None'
  }
}

resource uploadsContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  name: 'uploads'
  parent: blobService
  properties: {
    publicAccess: 'None'
  }
}

output storageAccountId string = storageAccount.id
output storageAccountName string = storageAccount.name
