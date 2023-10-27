param namePrefix string
param location string

resource appConfig 'Microsoft.AppConfiguration/configurationStores@2022-05-01' = {
	name: '${namePrefix}-appConfiguration'
	location: location
	sku: {
		name: 'standard'
	}
	properties: {
		// TODO: Remove
		enablePurgeProtection: false
	}
	resource configStoreKeyValue 'keyValues' = {
		name: 'Sentinel'
		properties: {
			value: '1'
		}
	}
}

resource appConfigKey 'Microsoft.AppConfiguration/configurationStores/configurationKeyValue@2020-07-01-preview' = {
	parent: appConfig
	name: 'Infrastructure:MigrationCompleted'
	properties: {
		contentType: 'text'
		value: 'false'
	}
}

// Output the connection string
output endpoint string = appConfig.properties.endpoint
output name string = appConfig.name
