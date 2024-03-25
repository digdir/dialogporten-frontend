param location string
param name string
param image string
param containerAppEnvId string
param port int = 8080
param environmentVariables { name: string, value: string }[] = []

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

var ingress = {
  targetPort: port
  external: true
  customDomains: [
    {
      name: 'test.portal-pp.dialogporten.no'
      bindingType: 'Disabled'
    }
  ]
}

resource containerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: name
  location: location
  properties: {
    environmentId: containerAppEnvId
    configuration: {
      activeRevisionsMode: 'Multiple'
      ingress: ingress
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
      scale: {
        // todo: should be configurable
        minReplicas: 1
        maxReplicas: 3
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
