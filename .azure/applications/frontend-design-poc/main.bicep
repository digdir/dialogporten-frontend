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

var namePrefix = 'dp-fe-${environment}'
var baseImageUrl = 'ghcr.io/digdir/dialogporten-frontend-'
var serviceName = 'frontend-design-poc'
var containerAppName = '${namePrefix}-${serviceName}'

resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' existing = {
  name: containerAppEnvironmentName
}

module containerApp '../../modules/containerApp/main.bicep' = {
  name: containerAppName
  params: {
    name: containerAppName
    location: location
    image: '${baseImageUrl}${serviceName}:${imageTag}'
    containerAppEnvId: containerAppEnvironment.id
  }
}

output name string = containerApp.outputs.name
output revisionName string = containerApp.outputs.revisionName
