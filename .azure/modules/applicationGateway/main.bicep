param namePrefix string
param location string
param subnetId string

@export()
type Sku = {
  name: 'Standard_v2' | 'WAF_v2'
  tier: 'Standard_v2' | 'WAF_v2'
}
param sku Sku

resource publicIp 'Microsoft.Network/publicIPAddresses@2021-03-01' = {
  name: 'applicationGatewayPublicIp'
  location: location
  properties: {
    publicIPAllocationMethod: 'Dynamic'
  }
}

var publicIpAddressId = publicIp.id

resource applicationGateway 'Microsoft.Network/applicationGateways@2021-03-01' = {
  name: '${namePrefix}-applicationGateway'
  location: location
  properties: {
    sku: sku
    gatewayIPConfigurations: [
      {
        name: 'appGatewayIpConfig'
        properties: {
          subnet: {
            id: subnetId
          }
        }
      }
    ]
    frontendIPConfigurations: [
      {
        name: 'appGatewayFrontendIp'
        properties: {
          publicIPAddress: {
            id: publicIpAddressId
          }
        }
      }
    ]
    frontendPorts: [
      {
        name: 'appGatewayFrontendPort'
        properties: {
          port: 80
        }
      }
    ]
    httpListeners: [
      {
        name: 'appGatewayHttpListener'
        properties: {
          frontendIPConfiguration: {
            id: resourceId('Microsoft.Network/applicationGateways/frontendIPConfigurations', 'applicationGatewayName', 'appGatewayFrontendIp')
          }
          frontendPort: {
            id: resourceId('Microsoft.Network/applicationGateways/frontendPorts', 'applicationGatewayName', 'appGatewayFrontendPort')
          }
          protocol: 'Http'
        }
      }
    ]
    requestRoutingRules: [
      {
        name: 'rule1'
        properties: {
          ruleType: 'Basic'
          httpListener: {
            id: resourceId('Microsoft.Network/applicationGateways/httpListeners', 'applicationGatewayName', 'appGatewayHttpListener')
          }
          // Backends are added for the applications
        }
      }
    ]
  }
}
