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
    name: 'PORT'
    value: '8080'
  }
  {
    name: 'DEV_ENV'
    value: 'dev'
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
    name: 'SCOPE'
    value: 'digdir:dialogporten openid'
  }
  {
    name: 'SESSION_SECRET'
    value: 'IDPortenSessionSecret2023MoreLettersBlaBla'
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
