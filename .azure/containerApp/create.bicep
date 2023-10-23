param location string
param namePrefix string
param imageUrl string
param gitSha string
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
					image: '${baseImageUrl}node-bff:${gitSha}'
					// image: imageUrl
					env: envVariables
					resources: {
						cpu: 1
						memory: '2.0Gi'
					}
				}
			]
			scale: {
				minReplicas: 1
				maxReplicas: 10
			}
		}
	}
	identity: {
		type: 'SystemAssigned'
	}
}

output identityPrincipalId string = containerApp.identity.principalId
output name string = containerApp.name
