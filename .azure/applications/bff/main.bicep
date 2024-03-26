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

resource managedEnvironmentManagedCertificate 'Microsoft.App/managedEnvironments/managedCertificates@2022-11-01-preview' = {
  parent: containerAppEnvironment
  name: '${containerAppEnvironment.name}-${containerAppName}-certificate'
  location: location
  // tags: tags
  properties: {
    subjectName: 'test.portal-pp.dialogporten.no'
    domainControlValidation: 'CNAME'
  }
}

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
    secretRef: 'dbconnectionstring'
  }
  {
    name: 'PORT'
    value: '3000'
  }
  {
    name: 'DEV_ENV'
    value: 'dev'
  }
  {
    name: 'HOSTNAME'
    value: 'http://bff.localhost'
  }
  {
    name: 'CLIENT_ID'
    value: 'client-id-replace-me'
  }
  {
    name: 'CLIENT_SECRET'
    value: 'client-secret-replace-me'
  }
  {
    name: 'OIDC_URL'
    value: 'test.idporten.no'
  }
  {
    name: 'SCOPE'
    value: 'digdir:dialogporten.noconsent openid'
  }
  {
    name: 'SESSION_SECRET'
    value: 'IDPortenSessionSecret2023'
  }
  {
    name: 'COOKIE_NAME'
    value: 'oidc:test.idporten.no'
  }
  {
    name: 'REFRESH_TOKEN_EXPIRES_IN'
    value: '120'
  }
  {
    name: 'ACCESS_TOKEN_EXPIRES_IN'
    value: '60'
  }
]

// https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/bicep-functions-deployment#example-1
var keyVaultUrl = 'https://${environmentKeyVaultName}${az.environment().suffixes.keyvaultDns}/secrets/databaseConnectionString'

var secrets = [
  {
    name: 'dbconnectionstring'
    keyVaultUrl: keyVaultUrl
    identity: 'System'
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
