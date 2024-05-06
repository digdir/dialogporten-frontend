param namePrefix string
param defaultDomain string
param vnetId string
param staticIp string
param ttl int = 3600

resource privateDnsZone 'Microsoft.Network/privateDnsZones@2018-09-01' = {
  name: defaultDomain
  location: 'global'
  properties: {}
}

resource aRecord1 'Microsoft.Network/privateDnsZones/A@2018-09-01' = {
  name: defaultDomain
  properties: {
    ttl: ttl
    aRecords: [
      {
        ipv4Address: staticIp
      }
    ]
  }
  dependsOn: [
    privateDnsZone
  ]
}

resource aRecord2 'Microsoft.Network/privateDnsZones/A@2018-09-01' = {
  parent: privateDnsZone
  name: '@'
  properties: {
    ttl: ttl
    aRecords: [
      {
        ipv4Address: staticIp
      }
    ]
  }
}

resource virtualNetworkLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2018-09-01' = {
  parent: privateDnsZone
  name: '${namePrefix}-pdns-link'
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: vnetId
    }
  }
}
