param location string
param namePrefix string
param gitSha string
param baseImageUrl string
param psqlConnectionJSON string
param envVariables array = []

var uniqueBundleName = take('migration-bundle-${gitSha}', 32)

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: '${namePrefix}-analytics-ws'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
  }
}

resource migrationEnv 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: '${namePrefix}-migrations-cae'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }

  }
}

resource migrationJob 'Microsoft.App/jobs@2023-05-01' = {
  name: '${namePrefix}-migration-job'
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    configuration: {
      secrets: [
        {
          name: 'adoconnectionstringsecreturi'
          value: psqlConnectionJSON
        }
      ]
      manualTriggerConfig: {
        parallelism: 1
        replicaCompletionCount: 1
      }
      replicaRetryLimit: 5
      replicaTimeout: 60
      triggerType: 'Manual'
    }
    environmentId: migrationEnv.id
    template: {
      containers: [
        {
          image: '${baseImageUrl}-node-bff:${gitSha}'
          name: 'migration-bundle'
          env: envVariables
          resources: {
            cpu: 1
            memory: '2.0Gi'
          }
        }
      ]
    }
  }
}

output principalId string = migrationJob.identity.principalId
output bundleName string = uniqueBundleName
output name string = migrationJob.name
