param location string
param name string
param image string
param containerAppEnvId string
param port int = 8080
param environmentVariables { name: string, value: string?, secretRef: string? }[] = []

param secrets { name: string, keyVaultUri: string, identity: 'System' }[] = []

var probes = [
  {
    periodSeconds: 5
    initialDelaySeconds: 2
    type: 'Liveness'
    httpGet: {
      path: '/liveness'
      port: port
    }
  }
  {
    periodSeconds: 5
    initialDelaySeconds: 2
    type: 'Readiness'
    httpGet: {
      path: '/readiness'
      port: port
    }
  }
]

resource containerAppJob 'Microsoft.App/jobs@2023-05-01' = {
  name: name
  location: location
  properties: {
    environmentId: containerAppEnvId
    configuration: {
      secrets: secrets
      replicaRetryLimit: 1
      replicaTimeout: 120
      triggerType: 'Manual'
      manualTriggerConfig: {
        parallelism: 1
        replicaCompletionCount: 1
      }
    }
    template: {
      containers: [
        {
          name: name
          image: image
          env: environmentVariables
          probes: probes
        }
      ]
    }
  }
  identity: {
    type: 'SystemAssigned'
  }
}

output identityPrincipalId string = containerAppJob.identity.principalId
output name string = containerAppJob.name
