param location string
param namePrefix string
param port int = 8080
param baseImageUrl string
param gitSha string

resource env 'Microsoft.App/managedEnvironments@2023-05-01' = {
	name: '${namePrefix}-containerappenv'
	location: location
	properties: {}
}

resource containerApp 'Microsoft.App/containerApps@2023-05-01' = {
	name: '${namePrefix}-containerapp'
	location: location
	properties: {
		environmentId: env.id
		configuration: {
			activeRevisionsMode: 'Single'
			ingress: {
				external: true
				targetPort: port
				customDomains: [
					{
						name: 'test.portal-pp.dialogporten.no'
						bindingType: 'Disabled'
					}
				]
			}
		}
		template: {
			containers: [
				{
					name: '${namePrefix}-ghcr-docker-image'
					image: '${baseImageUrl}-node-bff:${gitSha}'
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
