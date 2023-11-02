param location string
param namePrefix string
param gitSha string
param psqlConnectionJSON string

param baseImageUrl string
param envVariables array = []

resource env 'Microsoft.App/managedEnvironments@2022-03-01' = {
	name: '${namePrefix}-containerappenv'
	location: location
	properties: {}
}

resource containerApp 'Microsoft.App/containerApps@2023-05-01' = {
	name: '${namePrefix}-containerapp'
	location: location
	properties: {
		managedEnvironmentId: env.id
		configuration: {
			secrets: [
				{
					value: psqlConnectionJSON
					name: 'adoconnectionstringsecreturi'
					// identity: 'System'
				}
			]
			activeRevisionsMode: 'Single'
			ingress: {
				external: true
				targetPort: 80
			}
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

output identityPrincipalId string = containerApp.identity.principalId
output name string = containerApp.name
