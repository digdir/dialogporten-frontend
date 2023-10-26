param roleDefinitionId string
param principalIds array


resource roleAssignments 'Microsoft.Authorization/roleAssignments@2022-04-01' = [for principalId in principalIds: {
	name: guid(subscription().id, principalId, roleDefinitionId)
	properties: {
		roleDefinitionId: roleDefinitionId
		principalId: principalId
		principalType: 'ServicePrincipal'
	}
}]
