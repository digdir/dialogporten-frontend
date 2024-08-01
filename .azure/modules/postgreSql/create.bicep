param namePrefix string
param location string
param keyVaultName string
param srcKeyVault object
param srcSecretName string
param subnetId string
param privateDnsZoneArmResourceId string

@secure()
param administratorLoginPassword string

@description('The tags to apply to the resources')
param tags object

var administratorLogin = 'dialogportenPgAdmin'
var databaseName = 'dialogporten'

module saveAdmPassword '../keyvault/upsertSecret.bicep' = {
  name: 'Save_${srcSecretName}'
  scope: resourceGroup(srcKeyVault.subscriptionId, srcKeyVault.resourceGroupName)
  params: {
    destKeyVaultName: srcKeyVault.name
    secretName: srcSecretName
    secretValue: administratorLoginPassword
    tags: tags
  }
}

resource postgres 'Microsoft.DBforPostgreSQL/flexibleServers@2022-12-01' = {
  name: '${namePrefix}-postgres'
  location: location
  properties: {
    version: '15'
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorLoginPassword
    storage: { storageSizeGB: 32 }
    network: {
      delegatedSubnetResourceId: subnetId
      privateDnsZoneArmResourceId: privateDnsZoneArmResourceId
    }
  }
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  resource database 'databases' = {
    name: databaseName
  }
  tags: tags
}

var secretName = 'databaseConnectionString'
var secretValue = 'postgres://${administratorLogin}:${administratorLoginPassword}@${postgres.properties.fullyQualifiedDomainName}:5432/${databaseName}?ssl=true'
module psqlConnectionObject '../keyvault/upsertSecret.bicep' = {
  name: secretName
  params: {
    destKeyVaultName: keyVaultName
    secretName: secretName
    secretValue: secretValue
    tags: tags
  }
}

output serverName string = postgres.name
output connectionStringSecretUri string = psqlConnectionObject.outputs.secretUri
