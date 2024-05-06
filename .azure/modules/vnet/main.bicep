param namePrefix string
param location string

// todo: add subnets with security groups please. Add the appropriate ports too

// todo: create a separate subnet for container apps. Ref:
/* 
If you use your own VNet, you need to provide a subnet that is dedicated exclusively to the Container App environment you deploy. 
This subnet isn't available to other services.
*/

// todo: create a private DNS zone

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
        name: 'containerAppEnvSubnet'
        properties: {
          addressPrefix: '10.0.2.0/23'
        }
      }
    ]
  }
}

// todo: add network security groups
resource networkSecurityGroup 'Microsoft.Network/networkSecurityGroups@2023-09-01' = {
  name: '${namePrefix}-application-gateway-nsg'
  location: location
  properties: {
    securityRules: []
  }
}

output virtualNetworkName string = virtualNetwork.name
output virtualNetworkId string = virtualNetwork.id
output defaultSubnetId string = virtualNetwork.properties.subnets[0].id
output applicationGatewaySubnetId string = virtualNetwork.properties.subnets[1].id
