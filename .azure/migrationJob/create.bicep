param location string
param namePrefix string
param gitSha string
param baseImageUrl string
param psqlConnectionJSON string
param envVariables array = []

var uniqueBundleName = take('migration-bundle-${gitSha}', 32)

resource migrationEnv 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: '${namePrefix}-migrations-cae'
  location: location
  properties: {}
}

// resource migrationJob 'Microsoft.App/jobs@2023-05-01' = {
//   name: '${namePrefix}-migration-job'
//   location: location
//   identity: {
//     type: 'SystemAssigned'
//   }
//   properties: {
//     configuration: {
//       secrets: [
//         {
//           name: 'adoconnectionstringsecreturi'
//           value: psqlConnectionJSON
//         }
//       ]
//       manualTriggerConfig: {
//         parallelism: 1
//         replicaCompletionCount: 1
//       }
//       replicaRetryLimit: 1
//       replicaTimeout: 30
//       triggerType: 'Manual'
//     }
//     environmentId: migrationEnv.id
//     template: {
//       containers: [
//         {
//           name: '${namePrefix}-ghcr-docker-image'
//           image: '${baseImageUrl}-node-bff:${gitSha}'
//           env: envVariables
//           resources: {
//             cpu: 1
//             memory: '2.0Gi'
//           }
//         }
//       ]
//     }
//   }
// }
// resource migrationJob 'Microsoft.App/jobs@2023-05-01' = {
//   name: uniqueBundleName /// ENDRES TILBAKE!!!!!!!!!!!!!!!!!!
//   // name: 'migration-bundle-debugging'
//   location: location
//   properties: {
//     managedEnvironmentId: migrationEnv.id
//     configuration: {
//       secrets: [
//         {
//           // keyVaultUrl: psqlConnectionJSONSecretUri
//           name: 'adoconnectionstringsecreturi'
//           value: psqlConnectionJSON
//           // identity: 'System'
//         }
//       ]
//       activeRevisionsMode: 'Single'
//       // ingress: {
//       //   external: true
//       //   targetPort: 80
//       // }
//     }
//     template: {
//       // initContainers: [
//       // 	{
//       // 		name: '${namePrefix}-ghcr-docker-image-init'
//       // 		image: imageUrl // Bruke C# container 
//       // 		env: envVariables
//       // 		resources: {
//       // 			cpu: 1
//       // 			memory: '2.0Gi'
//       // 		}
//       // 	}
//       // ]
//       containers: [
//         {
//           name: '${namePrefix}-ghcr-docker-image'
//           // image: 'ghcr.io/digdir/dialogporten-frontend-node-bff:53f8fe4a2402df23a2cdabb8a9caec725a5f8f7c'
//           image: '${baseImageUrl}-node-bff:${gitSha}'
//           env: envVariables
//           resources: {
//             cpu: 1
//             memory: '2.0Gi'
//           }
//         }
//       ]
//       scale: {
//         minReplicas: 1
//         maxReplicas: 1
//       }
//     }
//   }
//   identity: {
//     type: 'SystemAssigned'
//   }
// }

resource migrationJob 'Microsoft.App/containerApps@2023-05-01' = {
  // name: uniqueBundleName /// ENDRES TILBAKE!!!!!!!!!!!!!!!!!!
  name: 'migration-bundle-debugging'
  location: location
  properties: {
    managedEnvironmentId: migrationEnv.id
    configuration: {
      secrets: [
        {
          // keyVaultUrl: psqlConnectionJSONSecretUri
          name: 'adoconnectionstringsecreturi'
          value: psqlConnectionJSON
          // identity: 'System'
        }
      ]
      activeRevisionsMode: 'Single'
      // ingress: {
      //   external: true
      //   targetPort: 80
      // }
    }
    template: {
      // initContainers: [
      // 	{
      // 		name: '${namePrefix}-ghcr-docker-image-init'
      // 		image: imageUrl // Bruke C# container 
      // 		env: envVariables
      // 		resources: {
      // 			cpu: 1
      // 			memory: '2.0Gi'
      // 		}
      // 	}
      // ]
      containers: [
        {
          name: '${namePrefix}-ghcr-docker-image'
          // image: 'ghcr.io/digdir/dialogporten-frontend-node-bff:53f8fe4a2402df23a2cdabb8a9caec725a5f8f7c'
          image: '${baseImageUrl}-node-bff:${gitSha}'
          env: envVariables
          resources: {
            cpu: 1
            memory: '2.0Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
    }
  }
  identity: {
    type: 'SystemAssigned'
  }
}

output principalId string = migrationJob.identity.principalId
output bundleName string = uniqueBundleName
output name string = migrationJob.name