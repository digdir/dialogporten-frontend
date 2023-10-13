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
// Select primary readonly access keys
// var readonlyKeys = filter(appConfig.listKeys().value, k => k.name == 'Primary Read Only')[0]

// Output the connection string
output connectionString string = 'Endpoint=https://dp-cli-fe-dev-appconfiguration.azconfig.io;Id=oHXb;Secret=VOlnq1Bd94+e6BsTx+2S0uKq6aNWDczi3pfVrfA5fF4='
// output connectionString string = readonlyKeys.connectionString
output endpoint string = appConfig.properties.endpoint
// output connectionString string = appConfig.listKeys().primaryKey.co
output name string = appConfig.name
