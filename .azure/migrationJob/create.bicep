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
  // tags: {
  //   tagName1: 'tagValue1'
  //   tagName2: 'tagValue2'
  // }
  identity: {
    type: 'SystemAssigned'
    //userAssignedIdentities: {}
  }
  properties: {
    configuration: {
      // eventTriggerConfig: {
      //   parallelism: 1
      //   replicaCompletionCount: 1
      //   scale: {
      //     maxExecutions: 1
      //     minExecutions: 1
      //     pollingInterval: int
      //     rules: [
      //       {
      //         auth: [
      //           {
      //             secretRef: 'string'
      //             triggerParameter: 'string'
      //           }
      //         ]
      //         metadata: any()
      //         name: 'string'
      //         type: 'string'
      //       }
      //     ]
      //   }
      // }
      manualTriggerConfig: {
        parallelism: 1
        replicaCompletionCount: 1
      }
      // registries: [
      //   {
      //     identity: 'string'
      //     passwordSecretRef: 'string'
      //     server: 'string'
      //     username: 'string'
      //   }
      // ]
      replicaRetryLimit: 1
      replicaTimeout: 30
      // scheduleTriggerConfig: {
      //   cronExpression: 'string'
      //   parallelism: int
      //   replicaCompletionCount: int
      // }
      // secrets: [
      //   {
      //     identity: 'string'
      //     keyVaultUrl: 'string'
      //     name: 'string'
      //     value: 'string'
      //   }
      // ]
      triggerType: 'Manual'
    }
    environmentId: migrationEnv.id
    template: {
      containers: [
        {
          // args: [
          //   'string'
          // ]
          // command: [
          //   'string'
          // ]
          env: envVariables
          image: '${baseImageUrl}-node-bff:${gitSha}'
          name: 'migration-bundle'
          // probes: [
          //   {
          //     failureThreshold: int
          //     httpGet: {
          //       host: 'string'
          //       httpHeaders: [
          //         {
          //           name: 'string'
          //           value: 'string'
          //         }
          //       ]
          //       path: 'string'
          //       port: int
          //       scheme: 'string'
          //     }
          //     initialDelaySeconds: int
          //     periodSeconds: int
          //     successThreshold: int
          //     tcpSocket: {
          //       host: 'string'
          //       port: int
          //     }
          //     terminationGracePeriodSeconds: int
          //     timeoutSeconds: int
          //     type: 'string'
          //   }
          // ]
          // resources: {
          //   cpu: json('decimal-as-string')
          //   memory: 'string'
          // }
          // volumeMounts: [
          //   {
          //     mountPath: 'string'
          //     subPath: 'string'
          //     volumeName: 'string'
          //   }
          // ]
        }
      ]
      // initContainers: [
      //   {
      //     args: [
      //       'string'
      //     ]
      //     command: [
      //       'string'
      //     ]
      //     env: [
      //       {
      //         name: 'string'
      //         secretRef: 'string'
      //         value: 'string'
      //       }
      //     ]
      //     image: 'string'
      //     name: 'string'
      //     resources: {
      //       cpu: json('decimal-as-string')
      //       memory: 'string'
      //     }
      //     volumeMounts: [
      //       {
      //         mountPath: 'string'
      //         subPath: 'string'
      //         volumeName: 'string'
      //       }
      //     ]
      //   }
      // ]
      // volumes: [
      //   {
      //     mountOptions: 'string'
      //     name: 'string'
      //     secrets: [
      //       {
      //         path: 'string'
      //         secretRef: 'string'
      //       }
      //     ]
      //     storageName: 'string'
      //     storageType: 'string'
      //   }
      // ]
    }
  }
}

output principalId string = migrationJob.identity.principalId
output bundleName string = uniqueBundleName
