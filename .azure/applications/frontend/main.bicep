targetScope = 'resourceGroup'

@minLength(3)
param imageTag string
@minLength(3)
param environment string
@minLength(3)
param location string
param port int = 80

@minLength(3)
@secure()
param containerAppEnvironmentName string

var namePrefix = 'dp-fe-${environment}'
var baseImageUrl = 'ghcr.io/digdir/dialogporten-frontend-'
var serviceName = 'frontend'
var containerAppName = '${namePrefix}-${serviceName}'

resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' existing = {
  name: containerAppEnvironmentName
}

var healthProbes = [
  {
    periodSeconds: 5
    initialDelaySeconds: 2
    type: 'Liveness'
    httpGet: {
      path: '/'
      port: port
    }
  }
  {
    periodSeconds: 5
    initialDelaySeconds: 2
    type: 'Readiness'
    httpGet: {
      path: '/'
      port: port
    }
  }
]

module containerApp '../../modules/containerApp/main.bicep' = {
  name: containerAppName
  params: {
    name: containerAppName
    location: location
    image: '${baseImageUrl}${serviceName}:${imageTag}'
    containerAppEnvId: containerAppEnvironment.id
    probes: healthProbes
    port: port
  }
}

output name string = containerApp.outputs.name
output revisionName string = containerApp.outputs.revisionName
