/* 
  This module is needed first and foremost for application gateway to route requests correctly to the container apps. https://learn.microsoft.com/en-us/azure/container-apps/waf-app-gateway?tabs=default-domain#create-and-configure-an-azure-private-dns-zone
  Should be refactored to something more generic if needed elsewhere
*/
@description('Prefix used for naming resources to ensure unique names')
param namePrefix string

@description('The default domain for the private DNS zone')
param defaultDomain string

@description('The ID of the virtual network linked to the private DNS zone')
param vnetId string

@description('The static IP address for the A record in the DNS zone')
param staticIp string

@description('The time-to-live for DNS records in seconds')
param ttl int = 3600

resource privateDnsZone 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: defaultDomain
  location: 'global'
  properties: {}
}

resource aRecord1 'Microsoft.Network/privateDnsZones/A@2020-06-01' = {
  name: defaultDomain
  parent: privateDnsZone
  properties: {
    ttl: ttl
    aRecords: [
      {
        ipv4Address: staticIp
      }
    ]
  }
}

resource aRecord2 'Microsoft.Network/privateDnsZones/A@2020-06-01' = {
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

resource virtualNetworkLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = {
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
