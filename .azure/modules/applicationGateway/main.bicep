param namePrefix string
param location string
param subnetId string
param containerAppEnvName string

@export()
type Configuration = {
  sku: {
    name: 'Standard_v2' | 'WAF_v2'
    tier: 'Standard_v2' | 'WAF_v2'
    capacity: int?
  }
  autoscaleConfiguration: {
    minCapacity: int
    maxCapacity: int
  }?
}
param configuration Configuration

var gatewayName = '${namePrefix}-applicationGateway'

resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' existing = {
  name: containerAppEnvName
}

resource publicIp 'Microsoft.Network/publicIPAddresses@2021-03-01' = {
  name: '${gatewayName}-publicIp'
  location: location
  sku: {
    name: 'Standard'
  }
  properties: {
    publicIPAllocationMethod: 'Static'
  }
}

resource applicationGatewayAssignedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = {
  name: '${gatewayName}-identity'
  location: location
}

var publicIpAddressId = publicIp.id

var bffGatewayBackend = {
  pool: {
    name: '${gatewayName}-bffBackendPool'
    properties: {
      backendAddresses: [
        {
          fqdn: '${namePrefix}-bff.${containerAppEnvironment.properties.defaultDomain}.${location}.azurecontainerapps.io'
        }
      ]
    }
  }
  httpSettings: {
    name: '${gatewayName}-bffBackendPool-backendHttpSettings'
    properties: {
      port: 80
      protocol: 'Http'
      cookieBasedAffinity: 'Disabled'
    }
  }
}

var frontendGatewayBackend = {
  pool: {
    name: '${gatewayName}-frontendPool'
    properties: {
      backendAddresses: [
        {
          fqdn: '${namePrefix}-frontend-design-poc.${containerAppEnvironment.properties.defaultDomain}.${location}.azurecontainerapps.io'
        }
      ]
    }
  }
  httpSettings: {
    name: '${gatewayName}-frontendPool-backendHttpSettings'
    properties: {
      port: 80
      protocol: 'Http'
      cookieBasedAffinity: 'Disabled'
    }
  }
}

resource applicationGateway 'Microsoft.Network/applicationGateways@2023-04-01' = {
  name: gatewayName
  location: location
  properties: {
    autoscaleConfiguration: configuration.autoscaleConfiguration
    sku: configuration.sku
    gatewayIPConfigurations: [
      {
        name: '${gatewayName}-gatewayIpConfig'
        properties: {
          subnet: {
            id: subnetId
          }
        }
      }
    ]
    frontendIPConfigurations: [
      {
        name: '${gatewayName}-gatewayFrontendIp'
        properties: {
          publicIPAddress: {
            id: publicIpAddressId
          }
        }
      }
    ]
    frontendPorts: [
      {
        name: '${gatewayName}-gatewayFrontendPort'
        properties: {
          port: 80
        }
      }
    ]
    httpListeners: [
      {
        name: '${gatewayName}-gatewayHttpListener'
        properties: {
          frontendIPConfiguration: {
            id: resourceId(
              'Microsoft.Network/applicationGateways/frontendIPConfigurations',
              gatewayName,
              '${gatewayName}-gatewayFrontendIp'
            )
          }
          frontendPort: {
            id: resourceId(
              'Microsoft.Network/applicationGateways/frontendPorts',
              gatewayName,
              '${gatewayName}-gatewayFrontendPort'
            )
          }
          protocol: 'Http'
        }
      }
    ]
    backendAddressPools: [
      bffGatewayBackend.pool
      frontendGatewayBackend.pool
    ]
    backendHttpSettingsCollection: [
      bffGatewayBackend.httpSettings
      frontendGatewayBackend.httpSettings
    ]
    urlPathMaps: [
      {
        name: '${bffGatewayBackend.pool.name}.pathMap'
        properties: {
          defaultBackendAddressPool: {
            id: resourceId(
              'Microsoft.Network/applicationGateways/backendAddressPools',
              gatewayName,
              frontendGatewayBackend.pool.name
            )
          }
          defaultBackendHttpSettings: {
            id: resourceId(
              'Microsoft.Network/applicationGateways/backendHttpSettingsCollection',
              gatewayName,
              frontendGatewayBackend.httpSettings.name
            )
          }
          pathRules: [
            {
              name: bffGatewayBackend.pool.name
              properties: {
                paths: [
                  '/api*'
                ]
                backendAddressPool: {
                  id: resourceId(
                    'Microsoft.Network/applicationGateways/backendAddressPools',
                    gatewayName,
                    bffGatewayBackend.pool.name
                  )
                }
                backendHttpSettings: {
                  id: resourceId(
                    'Microsoft.Network/applicationGateways/backendHttpSettingsCollection',
                    gatewayName,
                    bffGatewayBackend.httpSettings.name
                  )
                }
              }
            }
          ]
        }
      }
    ]
    requestRoutingRules: [
      {
        name: 'pathBasedRoutingRule'
        properties: {
          priority: 100
          ruleType: 'PathBasedRouting'
          httpListener: {
            id: resourceId(
              'Microsoft.Network/applicationGateways/httpListeners',
              gatewayName,
              '${gatewayName}-gatewayHttpListener'
            )
          }
          urlPathMap: {
            id: resourceId(
              'Microsoft.Network/applicationGateways/urlPathMaps',
              gatewayName,
              '${bffGatewayBackend.pool.name}.pathMap'
            )
          }
        }
      }
    ]
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${applicationGatewayAssignedIdentity.id}': {}
    }
  }
}

output applicationGatewayId string = applicationGateway.id
