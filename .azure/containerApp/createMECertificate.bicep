param location string
param namePrefix string

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
