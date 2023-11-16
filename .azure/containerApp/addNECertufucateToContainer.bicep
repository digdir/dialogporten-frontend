param location string
param namePrefix string
param gitSha string
param psqlConnectionJSON string
param resourceGroupName string
param port int = 8080
param baseImageUrl string
param envVariables array = []

param migrationJobName string
@secure()
param migrationVerifierPrincipalPassword string
@secure()
param migrationVerifierPrincipalAppId string

resource env 'Microsoft.App/managedEnvironments@2023-05-01' = {
	name: '${namePrefix}-containerappenv'
	location: location
	properties: {}
}

resource managedEnvironmentManagedCertificate 'Microsoft.App/managedEnvironments/managedCertificates@2022-11-01-preview' = {
	parent: env
	name: '${env.name}-certificate'
	location: location
	// tags: tags
	properties: {
		subjectName: 'test.portal-pp.dialogporten.no'
		domainControlValidation: 'CNAME'
	}
}

var initContainers = [
	{
		name: 'migration-verifier-init'
		image: 'ghcr.io/digdir/dialogporten-migration-verifier:aac85a0350fb57c8d8062379ec255f38b8b5473a'
		env: [
			{
				name: 'AZURE_TENANT_ID'
				value: subscription().tenantId
			}
			{
				name: 'AZURE_CLIENT_ID'
				value: migrationVerifierPrincipalAppId
			}
			{
				name: 'AZURE_CLIENT_SECRET'
				value: migrationVerifierPrincipalPassword
			}
			{
				name: 'MIGRATION_JOB_NAME'
				value: migrationJobName
			}
			{
				name: 'GIT_SHA'
				value: gitSha
			}
			{
				name: 'RESOURCE_GROUP_NAME'
				value: resourceGroupName
			}
		]
	} ]

resource containerApp 'Microsoft.App/containerApps@2023-05-01' = {
	name: '${namePrefix}-containerapp'
	location: location
	properties: {
		environmentId: env.id
		configuration: {
			secrets: [
				{
					value: psqlConnectionJSON
					name: 'adoconnectionstringsecreturi'
				}
			]
			activeRevisionsMode: 'Single'
			ingress: {
				external: true
				targetPort: port
				customDomains: [
					{
						name: managedEnvironmentManagedCertificate.properties.subjectName
						certificateId: managedEnvironmentManagedCertificate.id
						bindingType: 'SniEnabled'
					}
				]
			}
		}
		template: {
			initContainers: initContainers
			containers: [
				{
					name: '${namePrefix}-ghcr-docker-image'
					// image: 'ghcr.io/digdir/dialogporten-frontend-node-bff:53f8fe4a2402df23a2cdabb8a9caec725a5f8f7c'
					image: '${baseImageUrl}-node-bff:${gitSha}'
					env: envVariables
					probes: [
						{
							failureThreshold: 3
							httpGet: {

								path: '/liveness'
								port: port
								scheme: 'HTTP'
							}
							initialDelaySeconds: 60
							periodSeconds: 10
							successThreshold: 1
							timeoutSeconds: 30
							type: 'Liveness'
						}
						{
							failureThreshold: 3
							httpGet: {
								path: '/readiness'
								port: port
								scheme: 'HTTP'
							}
							initialDelaySeconds: 60
							periodSeconds: 10
							successThreshold: 1
							timeoutSeconds: 30
							type: 'Readiness'
						}
					]
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
