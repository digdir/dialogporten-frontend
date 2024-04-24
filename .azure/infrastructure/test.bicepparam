using './main.bicep'

param environment = 'test'
param location = 'norwayeast'
param redisVersion = '6.0'

param keyVaultSourceKeys = json(readEnvironmentVariable('KEY_VAULT_SOURCE_KEYS'))

// secrets
param dialogportenPgAdminPassword = readEnvironmentVariable('PG_ADMIN_PASSWORD')
param sourceKeyVaultSubscriptionId = readEnvironmentVariable('SOURCE_KEY_VAULT_SUBSCRIPTION_ID')
param sourceKeyVaultResourceGroup = readEnvironmentVariable('SOURCE_KEY_VAULT_RESOURCE_GROUP')
param sourceKeyVaultName = readEnvironmentVariable('SOURCE_KEY_VAULT_NAME')

// SKUs
param redisSku = {
  name: 'Basic'
  family: 'C'
  capacity: 1
}

@allowed([
  'Standard_v2'
  'WAF_v2'
])
param applicationGatewaySku = {
  name: 'Standard_v2'
  tier: 'Standard_v2'
}
