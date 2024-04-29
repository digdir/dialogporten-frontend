param namePrefix string
param location string

resource virtualNetwork 'Microsoft.Network/virtualNetworks@2023-09-01' = {
  name: '${namePrefix}-vnet'
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
    subnets: [
      {
        name: 'default'
        properties: {
          addressPrefix: '10.0.0.0/23'
        }
      }
      {
        name: 'applicationGatewaySubnet'
        properties: {
          addressPrefix: '10.0.2.0/23'
        }
      }
    ]
  }
}

output virtualNetworkName string = virtualNetwork.name
output defaultSubnetId string = virtualNetwork.properties.subnets[0].id
output applicationGatewaySubnetId string = virtualNetwork.properties.subnets[1].id
