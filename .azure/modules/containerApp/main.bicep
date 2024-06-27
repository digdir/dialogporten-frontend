param location string
param name string
param image string
param containerAppEnvId string
param port int = 8080
param environmentVariables { name: string, value: string?, secretRef: string? }[] = []
param probes { periodSeconds: int, initialDelaySeconds: int, type: string, httpGet: { path: string, port: int } }[] = []
param minReplicas int = 1
param maxReplicas int = 3

param secrets { name: string, keyVaultUrl: string, identity: 'System' }[] = []

var healthProbes = empty(probes)
  ? [
      {
        periodSeconds: 5
        initialDelaySeconds: 2
        type: 'Liveness'
        httpGet: {
          path: '/api/liveness'
          port: port
        }
      }
      {
        periodSeconds: 5
        initialDelaySeconds: 2
        type: 'Readiness'
        httpGet: {
          path: '/api/readiness'
          port: port
        }
      }
    ]
  : probes

var ingress = {
  targetPort: port
  external: true
  allowInsecure: true
}

resource containerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: name
  location: location
  properties: {
    environmentId: containerAppEnvId
    configuration: {
      secrets: secrets
      activeRevisionsMode: 'Single'
      ingress: ingress
    }
    template: {
      containers: [
        {
          name: name
          image: image
          env: environmentVariables
          probes: healthProbes
        }
      ]
      scale: {
        minReplicas: minReplicas
        maxReplicas: maxReplicas
      }
    }
  }
  identity: {
    type: 'SystemAssigned'
  }
}

output identityPrincipalId string = containerApp.identity.principalId
output name string = containerApp.name
output revisionName string = containerApp.properties.latestRevisionName
