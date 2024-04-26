param namePrefix string
param location string

resource virtualNetwork 'Microsoft.Network/virtualNetworks@2023-09-01' = {
  name: '${namePrefix}-vnet'
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
        'ace:cab:deca::/48'
      ]
    }
    subnets: [
      {
        name: 'default'
        properties: {
          addressPrefix: '10.0.0.0/24'
        }
      }
      {
        name: 'applicationGatewaySubnet'
        properties: {
          addressPrefix: '10.0.1.0/24'
        }
      }
      {
        name: 'applicationGatewayIPv6Subnet'
        properties: {
          addressPrefix: 'ace:cab:deca::/64'
        }
      }
    ]
  }
}

output virtualNetworkName string = virtualNetwork.name
output defaultSubnetId string = virtualNetwork.properties.subnets[0].id
output applicationGatewaySubnetId string = virtualNetwork.properties.subnets[1].id
output applicationGatewayIPv6SubnetId string = virtualNetwork.properties.subnets[2].id
