targetScope = 'subscription'

param environment string
param location string
param keyVaultSourceKeys array

@secure()
@minLength(3)
param dialogportenPgAdminPassword string
@secure()
@minLength(3)
param sourceKeyVaultSubscriptionId string
@secure()
@minLength(3)
param sourceKeyVaultResourceGroup string
@secure()
@minLength(3)
param sourceKeyVaultName string

import { Sku as RedisSku } from '../modules/redis/main.bicep'
param redisSku RedisSku
@minLength(1)
param redisVersion string

import { Configuration as ApplicationGatewayConfiguration } from '../modules/applicationGateway/main.bicep'
param applicationGatewayConfiguration ApplicationGatewayConfiguration

var secrets = {
  dialogportenPgAdminPassword: dialogportenPgAdminPassword
  sourceKeyVaultSubscriptionId: sourceKeyVaultSubscriptionId
  sourceKeyVaultResourceGroup: sourceKeyVaultResourceGroup
  sourceKeyVaultName: sourceKeyVaultName
}

var srcKeyVault = {
  name: secrets.sourceKeyVaultName
  subscriptionId: secrets.sourceKeyVaultSubscriptionId
  resourceGroupName: secrets.sourceKeyVaultResourceGroup
}

var namePrefix = 'dp-fe-${environment}'

// Create resource groups
resource resourceGroup 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: '${namePrefix}-rg'
  location: location
}

module vnet '../modules/vnet/main.bicep' = {
  scope: resourceGroup
  name: 'vnet'
  params: {
    namePrefix: namePrefix
    location: location
  }
}

module environmentKeyVault '../modules/keyvault/create.bicep' = {
  scope: resourceGroup
  name: 'keyVault'
  params: {
    namePrefix: namePrefix
    location: location
  }
}

module appConfiguration '../modules/appConfiguration/create.bicep' = {
  scope: resourceGroup
  name: 'appConfiguration'
  params: {
    namePrefix: namePrefix
    location: location
  }
}

module appInsights '../modules/applicationInsights/create.bicep' = {
  scope: resourceGroup
  name: 'appInsights'
  params: {
    namePrefix: namePrefix
    location: location
  }
}

module containerAppEnv '../modules/containerAppEnv/main.bicep' = {
  scope: resourceGroup
  name: 'containerAppEnv'
  params: {
    namePrefix: namePrefix
    location: location
    appInsightWorkspaceName: appInsights.outputs.appInsightsWorkspaceName
    subnetId: vnet.outputs.containerAppEnvironmentSubnetId
  }
}

module containerAppEnvPrivateDnsZone '../modules/privateDnsZone/main.bicep' = {
  scope: resourceGroup
  name: 'containerAppEnvPrivateDnsZone'
  params: {
    namePrefix: namePrefix
    defaultDomain: containerAppEnv.outputs.defaultDomain
    vnetId: vnet.outputs.virtualNetworkId
    aRecords: [
      {
        ip: containerAppEnv.outputs.staticIp
        name: '*'
        ttl: 3600
      }
      {
        ip: containerAppEnv.outputs.staticIp
        name: '@'
        ttl: 3600
      }
    ]
  }
}

module postgresqlPrivateDnsZone '../modules/privateDnsZone/main.bicep' = {
  scope: resourceGroup
  name: 'postgresqlPrivateDnsZone'
  params: {
    namePrefix: namePrefix
    defaultDomain: '${namePrefix}.postgres.database.azure.com'
    vnetId: vnet.outputs.virtualNetworkId
  }
}

module applicationGateway '../modules/applicationGateway/main.bicep' = {
  scope: resourceGroup
  name: 'applicationGateway'
  params: {
    namePrefix: namePrefix
    location: location
    srcKeyVault: srcKeyVault
    containerAppEnvName: containerAppEnv.outputs.name
    subnetId: vnet.outputs.applicationGatewaySubnetId
    targetSubnetId: vnet.outputs.containerAppEnvironmentSubnetId
    configuration: applicationGatewayConfiguration
  }
}

module redis '../modules/redis/main.bicep' = {
  scope: resourceGroup
  name: 'redis'
  params: {
    namePrefix: namePrefix
    location: location
    environmentKeyVaultName: environmentKeyVault.outputs.name
    version: redisVersion
    sku: redisSku
  }
}

// Create references to existing resources
resource srcKeyVaultResource 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: secrets.sourceKeyVaultName
  scope: az.resourceGroup(secrets.sourceKeyVaultSubscriptionId, secrets.sourceKeyVaultResourceGroup)
}

// Create resources with dependencies to other resources
module postgresql '../modules/postgreSql/create.bicep' = {
  scope: resourceGroup
  name: 'postgresql'
  params: {
    namePrefix: namePrefix
    subnetId: vnet.outputs.postgresqlSubnetId
    location: location
    keyVaultName: environmentKeyVault.outputs.name
    srcKeyVault: srcKeyVault
    srcSecretName: 'dialogportenPgAdminPassword${environment}'
    administratorLoginPassword: contains(keyVaultSourceKeys, 'dialogportenPgAdminPassword${environment}')
      ? srcKeyVaultResource.getSecret('dialogportenPgAdminPassword${environment}')
      : secrets.dialogportenPgAdminPassword
    privateDnsZoneArmResourceId: postgresqlPrivateDnsZone.outputs.id
  }
}

module copySecrets '../modules/keyvault/copySecrets.bicep' = {
  scope: resourceGroup
  name: 'copySecrets'
  params: {
    srcKeyVaultKeys: keyVaultSourceKeys
    srcKeyVaultName: srcKeyVault.name
    srcKeyVaultRGNName: srcKeyVault.resourceGroupName
    srcKeyVaultSubId: srcKeyVault.subscriptionId
    destKeyVaultName: environmentKeyVault.outputs.name
    secretPrefix: 'dialogporten--${environment}--'
  }
}

module appConfigDatabaseConnectionString '../modules/appConfiguration/upsertKeyValue.bicep' = {
  scope: resourceGroup
  name: 'AppConfig_Add_DatabaseConnectionString'
  params: {
    configStoreName: appConfiguration.outputs.name
    key: 'DATABASE_CONNECTION_STRING'
    value: postgresql.outputs.connectionStringSecretUri
    keyValueType: 'keyVaultReference'
  }
}

output resourceGroupName string = resourceGroup.name
output postgreServerName string = postgresql.outputs.serverName
