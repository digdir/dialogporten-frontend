param namePrefix string
param location string
param keyVaultName string
param srcKeyVault object
param srcSecretName string

@secure()
param administratorLoginPassword string

var administratorLogin = 'dialogportenPgAdmin'
var databaseName = 'dialogporten'

module saveAdmPassword '../keyvault/upsertSecret.bicep' = {
	name: 'Save_${srcSecretName}'
	scope: resourceGroup(srcKeyVault.subscriptionId, srcKeyVault.resourceGroupName)
	params: {
		destKeyVaultName: srcKeyVault.name
		secretName: srcSecretName
		secretValue: administratorLoginPassword
	}
}

resource postgres 'Microsoft.DBforPostgreSQL/flexibleServers@2022-12-01' = {
	name: '${namePrefix}-postgres'
	location: location
	properties: {
		version: '15'
		administratorLogin: administratorLogin
		administratorLoginPassword: administratorLoginPassword
		storage: { storageSizeGB: 32 }
	}
	sku: {
		name: 'Standard_B1ms'
		tier: 'Burstable'
	}
	resource database 'databases' = {
		name: databaseName
	}
	resource allowAzureAccess 'firewallRules' = {
		name: 'AllowAccessFromAzure'
		properties: {
			startIpAddress: '0.0.0.0'
			endIpAddress: '0.0.0.0'
		}
	}
}

var psqlSecretName = '${namePrefix}-psqlConnectionJSON'
module psqlConnectionObject '../keyvault/upsertSecret.bicep' = {
	name: psqlSecretName
	params: {
		destKeyVaultName: keyVaultName
		secretName: psqlSecretName
		secretValue: '{"host": "${postgres.properties.fullyQualifiedDomainName}","port":"5432","dbname":"${databaseName}","user":"${administratorLogin}","password":"${administratorLoginPassword}","sslmode":"require"}'
	}
}

output serverName string = postgres.name
output psqlConnectionJSONSecretName string = psqlSecretName
