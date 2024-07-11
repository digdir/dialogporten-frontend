param namePrefix string
param location string
param subnetId string
param vnetId string
@minLength(1)
param environmentKeyVaultName string
@minLength(1)
param version string

@export()
type Sku = {
  name: 'Basic' | 'Standard' | 'Premium'
  family: 'C' | 'P'
  @minValue(1)
  capacity: int
}
param sku Sku

// https://learn.microsoft.com/en-us/azure/templates/microsoft.cache/redis?pivots=deployment-language-bicep
resource redis 'Microsoft.Cache/Redis@2024-03-01' = {
  name: '${namePrefix}-redis'
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    sku: sku
    enableNonSslPort: false
    redisConfiguration: {
      'aad-enabled': 'true'
      'maxmemory-policy': 'allkeys-lru'
    }
    redisVersion: version
    publicNetworkAccess: 'Disabled'
  }
}

resource redisPrivateEndpoint 'Microsoft.Network/privateEndpoints@2022-01-01' = {
  name: '${namePrefix}-redis-pe'
  location: location
  properties: {
    privateLinkServiceConnections: [
      {
        name: '${namePrefix}-redis-pe'
        properties: {
          privateLinkServiceId: redis.id
          groupIds: [
            'redisCache'
          ]
        }
      }
    ]
    customNetworkInterfaceName: '${namePrefix}-redis-pe-nic'
    subnet: {
      id: subnetId
    }
  }
}

module privateDnsZone '../privateDnsZone/main.bicep' = {
  name: '${namePrefix}-redis-pdz'
  params: {
    namePrefix: namePrefix
    defaultDomain: 'privatelink.redis.cache.windows.net'
    vnetId: vnetId
  }
}

module privateDnsZoneGroup '../privateDnsZoneGroup/main.bicep' = {
  name: '${namePrefix}-redis-privateDnsZoneGroup'
  dependsOn: [
    privateDnsZone
  ]
  params: {
    name: 'default'
    dnsZoneGroupName: 'privatelink-redis-cache-windows-net'
    dnsZoneId: privateDnsZone.outputs.id
    privateEndpointName: redisPrivateEndpoint.name
  }
}

module redisConnectionString '../keyvault/upsertSecret.bicep' = {
  name: 'redisConnectionString'
  params: {
    destKeyVaultName: environmentKeyVaultName
    secretName: 'redisConnectionString'
    // disable public access? Use vnet here maybe?
    secretValue: 'rediss://:${redis.properties.accessKeys.primaryKey}@${redis.properties.hostName}:${redis.properties.sslPort}'
  }
}

output connectionStringSecretUri string = redisConnectionString.outputs.secretUri
