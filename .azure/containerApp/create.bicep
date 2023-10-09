param location string
param namePrefix string

resource servicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
	name: '${namePrefix}-serviceplan'
	location: location
	kind: 'app'
	sku: { name: 'F1' }
}

resource frontend 'Microsoft.App/containerApps@2023-05-01' = {
	name: '${namePrefix}-frontend'
	location: location
	identity: {
		type: 'SystemAssigned'
	}
}

output identityPrincipalId string = frontend.identity.principalId
output name string = frontend.name
