@description('Globally unique storage account name (lowercase, no hyphens), e.g. alhayaatassetsprod')
param storageAccountName string
param location string
param tags object

// Public blob base URL for registration forms and large static media. The Next.js app
// typically links the browser directly (NEXT_PUBLIC_REGISTRATION_FORMS_BASE_URL); it does
// not use @azure/storage-blob for those downloads. Careers resume *uploads* use the
// private storage module (storage.bicep) + AZURE_STORAGE_CONNECTION_STRING.

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  tags: tags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: true
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-01-01' = {
  name: 'default'
  parent: storageAccount
}

resource schoolRegistrationContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  name: 'school-registration'
  parent: blobService
  properties: {
    publicAccess: 'Blob'
  }
}

resource publicImagesContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  name: 'public-images'
  parent: blobService
  properties: {
    publicAccess: 'Blob'
  }
}

output storageAccountId string = storageAccount.id
output storageAccountName string = storageAccount.name
output registrationFormsBaseUrl string = 'https://${storageAccount.name}.blob.${environment().suffixes.storage}/school-registration'
output publicImagesBaseUrl string = 'https://${storageAccount.name}.blob.${environment().suffixes.storage}/public-images'
