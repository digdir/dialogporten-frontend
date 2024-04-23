targetScope = 'resourceGroup'

@minLength(3)
param imageTag string
@minLength(3)
param environment string
@minLength(3)
param location string
param customDomain string?

@minLength(3)
@secure()
param containerAppEnvironmentName string
@minLength(3)
@secure()
param appInsightConnectionString string
@minLength(5)
@secure()
param appConfigurationName string
@minLength(3)
@secure()
param environmentKeyVaultName string

var namePrefix = 'dp-fe-${environment}'
var baseImageUrl = 'ghcr.io/digdir/dialogporten-frontend-'
var containerAppName = '${namePrefix}-bff'

resource appConfiguration 'Microsoft.AppConfiguration/configurationStores@2023-03-01' existing = {
  name: appConfigurationName
}

resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' existing = {
  name: containerAppEnvironmentName
}

resource environmentKeyVaultResource 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: environmentKeyVaultName
}

resource managedEnvironmentManagedCertificate 'Microsoft.App/managedEnvironments/managedCertificates@2022-11-01-preview' =
  if (customDomain != null) {
    parent: containerAppEnvironment
    name: '${containerAppEnvironment.name}-${containerAppName}-certificate'
    location: location
    // tags: tags
    properties: {
      subjectName: customDomain
      domainControlValidation: 'CNAME'
    }
  }

// https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/bicep-functions-deployment#example-1
var keyVaultUrl = 'https://${environmentKeyVaultName}${az.environment().suffixes.keyvaultDns}/secrets'

var dbConnectionStringSecret = {
  name: 'db-connection-string'
  keyVaultUrl: '${keyVaultUrl}/databaseConnectionString'
  identity: 'System'
}

var redisConnectionStringSecret = {
  name: 'redis-connection-string'
  keyVaultUrl: '${keyVaultUrl}/redisConnectionString'
  identity: 'System'
}

var idPortenClientIdSecret = {
  name: 'id-porten-client-id'
  keyVaultUrl: '${keyVaultUrl}/idPortenClientId'
  identity: 'System'
}

var idPortenClientSecretSecret = {
  name: 'id-porten-client-secret'
  keyVaultUrl: '${keyVaultUrl}/idPortenClientSecret'
  identity: 'System'
}

var idPortenSessionSecretSecret = {
  name: 'id-porten-session-secret'
  keyVaultUrl: '${keyVaultUrl}/idPortenSessionSecret'
  identity: 'System'
}

var secrets = [
  dbConnectionStringSecret
  redisConnectionStringSecret
  idPortenClientIdSecret
  idPortenClientSecretSecret
  idPortenSessionSecretSecret
]

var containerAppEnvVars = [
  {
    name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
    value: appInsightConnectionString
  }
  {
    name: 'AZURE_APPCONFIG_URI'
    value: appConfiguration.properties.endpoint
  }
  {
    name: 'DB_CONNECTION_STRING'
    secretRef: dbConnectionStringSecret.name
  }
  {
    name: 'REDIS_CONNECTION_STRING'
    secretRef: redisConnectionStringSecret.name
  }
  {
    name: 'PORT'
    value: '80'
  }
  {
    name: 'HOSTNAME'
    // todo: should be replaced with application gateway URL
    value: 'https://${containerAppName}.${containerAppEnvironment.properties.defaultDomain}.${location}.azurecontainerapps.io'
  }
  {
    name: 'CLIENT_ID'
    secretRef: idPortenClientIdSecret.name
  }
  {
    name: 'CLIENT_SECRET'
    secretRef: idPortenClientSecretSecret.name
  }
  {
    name: 'OIDC_URL'
    value: 'test.idporten.no'
  }
  {
    name: 'SESSION_SECRET'
    secretRef: idPortenSessionSecretSecret.name
  }
]

module containerApp '../../modules/containerApp/main.bicep' = {
  name: containerAppName
  params: {
    name: containerAppName
    location: location
    image: '${baseImageUrl}node-bff:${imageTag}'
    containerAppEnvId: containerAppEnvironment.id
    secrets: secrets
    environmentVariables: containerAppEnvVars
    customDomain: customDomain
    port: 80
  }
}

module keyVaultReaderAccessPolicy '../../modules/keyvault/addReaderRoles.bicep' = {
  name: 'keyVaultReaderAccessPolicy-${containerAppName}'
  params: {
    keyvaultName: environmentKeyVaultResource.name
    principalIds: [containerApp.outputs.identityPrincipalId]
  }
}

module appConfigReaderAccessPolicy '../../modules/appConfiguration/addReaderRoles.bicep' = {
  name: 'appConfigReaderAccessPolicy-${containerAppName}'
  params: {
    appConfigurationName: appConfigurationName
    principalIds: [containerApp.outputs.identityPrincipalId]
  }
}

output name string = containerApp.outputs.name
output revisionName string = containerApp.outputs.revisionName
