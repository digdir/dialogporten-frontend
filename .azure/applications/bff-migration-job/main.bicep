targetScope = 'resourceGroup'

@minLength(3)
param imageTag string
@minLength(3)
param environment string
@minLength(3)
param location string

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
var containerAppJobName = '${namePrefix}-bff-migration-job'

resource appConfiguration 'Microsoft.AppConfiguration/configurationStores@2023-03-01' existing = {
  name: appConfigurationName
}

resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' existing = {
  name: containerAppEnvironmentName
}

resource environmentKeyVaultResource 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: environmentKeyVaultName
}

// https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/bicep-functions-deployment#example-1
var keyVaultUrl = 'https://${environmentKeyVaultName}${az.environment().suffixes.keyvaultDns}/secrets'

var dbConnectionStringSecret = {
  name: 'dbconnectionstring'
  keyVaultUrl: '${keyVaultUrl}/databaseConnectionString'
  identity: 'system'
}

var redisConnectionStringSecret = {
  name: 'redisconnectionstring'
  keyVaultUrl: '${keyVaultUrl}/redisConnectionString'
  identity: 'system'
}

var idPortenClientIdSecret = {
  name: 'idPortenClientId'
  keyVaultUrl: '${keyVaultUrl}/idPortenClientId'
  identity: 'system'
}

var idPortenClientSecretSecret = {
  name: 'idPortenClientSecret'
  keyVaultUrl: '${keyVaultUrl}/idPortenClientSecret'
  identity: 'system'
}

var secrets = [
  dbConnectionStringSecret
  redisConnectionStringSecret
  idPortenClientIdSecret
  idPortenClientSecretSecret
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
    name: 'DEV_ENV'
    value: 'dev'
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
    value: 'IDPortenSessionSecret2023MoreLettersBlaBla'
  }
]

module containerAppJob '../../modules/containerAppJob/main.bicep' = {
  name: containerAppJobName
  params: {
    name: containerAppJobName
    location: location
    image: '${baseImageUrl}node-bff:${imageTag}'
    containerAppEnvId: containerAppEnvironment.id
    environmentVariables: containerAppEnvVars
    secrets: secrets
    command: ['pnpm', '--filter', 'bff', 'run', 'migration:run']
  }
}

module keyVaultReaderAccessPolicy '../../modules/keyvault/addReaderRoles.bicep' = {
  name: 'keyVaultReaderAccessPolicy-${containerAppJobName}'
  params: {
    keyvaultName: environmentKeyVaultResource.name
    principalIds: [containerAppJob.outputs.identityPrincipalId]
  }
}

module appConfigReaderAccessPolicy '../../modules/appConfiguration/addReaderRoles.bicep' = {
  name: 'appConfigReaderAccessPolicy-${containerAppJobName}'
  params: {
    appConfigurationName: appConfigurationName
    principalIds: [containerAppJob.outputs.identityPrincipalId]
  }
}

output name string = containerAppJob.outputs.name
