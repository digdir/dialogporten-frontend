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
var baseImageUrl = 'ghcr.io/digdir/dialogporten-frontend'
var containerAppJobName = '${namePrefix}-bff'


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
	name: '${containerAppEnvironment.name}-${containerAppJobName}-certificate'
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
    name: 'IS_MIGRATION_JOB'
    value: 'true'
  }
]

module containerAppJob '../../modules/containerAppJob/main.bicep' = {
  name: containerAppJobName
  params: {
      name: containerAppJobName
      location: location
      image: '${baseImageUrl}bff:${imageTag}'
      containerAppEnvId: containerAppEnvironment.id
      environmentVariables: containerAppEnvVars
  }
}

module keyVaultReaderAccessPolicy '../../modules/keyvault/addReaderRoles.bicep' = {
  name: 'keyVaultReaderAccessPolicy-${containerAppJobName}'
  params: {
    keyvaultName: environmentKeyVaultResource.name
    principalIds: [ containerAppJob.outputs.identityPrincipalId ]
  }
}

module appConfigReaderAccessPolicy '../../modules/appConfiguration/addReaderRoles.bicep' = {
  name: 'appConfigReaderAccessPolicy-${containerAppJobName}'
  params: {
    appConfigurationName: appConfigurationName
    principalIds: [ containerAppJob.outputs.identityPrincipalId ]
  }
}

output name string = containerAppJob.outputs.name
