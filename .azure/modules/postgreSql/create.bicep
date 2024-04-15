param namePrefix string
param location string
param keyVaultName string
param srcKeyVault object
param srcSecretName string
param subnetId string

@secure()
param administratorLoginPassword string

var administratorLogin = 'dialogportenPgAdmin'
var databaseName = 'dialogporten'

module saveAdmPassword '../keyvault/upsertSecret.bicep' = {
  name: 'Save_${srcSecretName}'
  scope: resourceGroup(srcKeyVault.subscriptionId, srcKeyVault.resourceGroupName)
  params: {
    destKeyVaultName: srcKeyVault.name
    secretName: srcSecretName
    secretValue: administratorLoginPassword
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
    }
  }
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  resource database 'databases' = {
    name: databaseName
  }
  resource allowAzureAccess 'firewallRules' = {
    name: 'AllowAccessFromAzure'
    properties: {
      startIpAddress: '0.0.0.0'
      endIpAddress: '0.0.0.0'
    }
  }
}

var secretName = 'databaseConnectionString'
var secretValue = 'postgres://${administratorLogin}:${administratorLoginPassword}@${postgres.properties.fullyQualifiedDomainName}:5432/${databaseName}?ssl=true'
module psqlConnectionObject '../keyvault/upsertSecret.bicep' = {
  name: secretName
  params: {
    destKeyVaultName: keyVaultName
    secretName: secretName
    secretValue: secretValue
  }
}

output serverName string = postgres.name
output connectionStringSecretUri string = psqlConnectionObject.outputs.secretUri
