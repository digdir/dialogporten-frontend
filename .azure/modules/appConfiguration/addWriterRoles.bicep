param appConfigurationName string
param principalIds array

resource appConfig 'Microsoft.AppConfiguration/configurationStores@2022-05-01' existing = {
	name: appConfigurationName
}

@description('This is the built-in App Configuration Data Writer role. See https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#app-configuration-data-reader')

resource dataWriterRoleDefinition 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
	scope: subscription()
	name: '195f3922-c4b8-4401-889b-84661c776363'
}

resource roleAssignments 'Microsoft.Authorization/roleAssignments@2022-04-01' = [for principalId in principalIds: {
	scope: appConfig
	name: guid(subscription().id, principalId, dataWriterRoleDefinition.id)
	properties: {
		roleDefinitionId: dataWriterRoleDefinition.id
		principalId: principalId
		principalType: 'ServicePrincipal'
	}
}]
// 
