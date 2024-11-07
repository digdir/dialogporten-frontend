param namePrefix string
param location string

@description('The tags to apply to the resources')
param tags object

resource appConfig 'Microsoft.AppConfiguration/configurationStores@2024-05-01' = {
  name: '${namePrefix}-appConfiguration'
  location: location
  sku: {
    name: 'standard'
  }
  properties: {
    // TODO: Remove
    enablePurgeProtection: false
  }
  resource configStoreKeyValue 'keyValues' = {
    name: 'Sentinel'
    properties: {
      value: '1'
    }
  }
  tags: tags
}

// Output the connection string
output endpoint string = appConfig.properties.endpoint
output name string = appConfig.name
