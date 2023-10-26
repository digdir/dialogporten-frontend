param location string
param namePrefix string
param gitSha string
param baseImageUrl string
param envVariables array = []

var uniqueBundleName = take('migration-bundle-${gitSha}', 32)

resource migrationEnv 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: '${namePrefix}-migrations-cae'
  location: location
  properties: {}
}
resource migrationJob 'Microsoft.App/jobs@2023-05-01' = {
  name: uniqueBundleName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    configuration: {
      manualTriggerConfig: {
        parallelism: 1
        replicaCompletionCount: 1
      }
      replicaRetryLimit: 1
      replicaTimeout: 30
      triggerType: 'Manual'
    }
    environmentId: migrationEnv.id
    template: {
      containers: [
        {
          env: envVariables
          image: '${baseImageUrl}-node-bff:${gitSha}'
          name: 'migration-bundle'
        }
      ]
    }
  }
}

output principalId string = migrationJob.identity.principalId
output bundleName string = uniqueBundleName
