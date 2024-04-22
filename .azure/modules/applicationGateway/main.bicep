param namePrefix string
param location string
param subnetId string
param containerAppEnvName string

@export()
type Sku = {
  name: 'Standard_v2' | 'WAF_v2'
  tier: 'Standard_v2' | 'WAF_v2'
}
param sku Sku

resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' existing = {
  name: containerAppEnvName
}

resource publicIp 'Microsoft.Network/publicIPAddresses@2021-03-01' = {
  name: 'applicationGatewayPublicIp'
  location: location
  properties: {
    publicIPAllocationMethod: 'Dynamic'
  }
}

var publicIpAddressId = publicIp.id

var bffBackend = {
  pool: {
    name: 'bffBackendPool'
    properties: {
      backendAddresses: [
        {
          fqdn: 'https://${namePrefix}-bff.${containerAppEnvironment.properties.defaultDomain}.${location}.azurecontainerapps.io'
        }
      ]
    }
  }
  httpSettings: {
    name: 'bffBackendPool-backendHttpSettings'
    properties: {
      port: 3000
      protocol: 'Http'
      cookieBasedAffinity: 'Disabled'
    }
  }
}

var frontendBackend = {
  pool: {
    name: 'frontendPool'
    properties: {
      backendAddresses: [
        {
          fqdn: 'https://${namePrefix}-frontend-design-poc.${containerAppEnvironment.properties.defaultDomain}.${location}.azurecontainerapps.io'
        }
      ]
    }
  }
  httpSettings: {
    name: 'frontendPool-backendHttpSettings'
    properties: {
      port: 80
      protocol: 'Http'
      cookieBasedAffinity: 'Disabled'
    }
  }
}

var gatewayName = '${namePrefix}-applicationGateway'

resource applicationGateway 'Microsoft.Network/applicationGateways@2023-04-01' = {
  name: gatewayName
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
            id: resourceId(
              'Microsoft.Network/applicationGateways/frontendIPConfigurations',
              gatewayName,
              'appGatewayFrontendIp'
            )
          }
          frontendPort: {
            id: resourceId('Microsoft.Network/applicationGateways/frontendPorts', gatewayName, 'appGatewayFrontendPort')
          }
          protocol: 'Http'
        }
      }
    ]
    backendAddressPools: [
      bffBackend.pool
      frontendBackend.pool
    ]
    backendHttpSettingsCollection: [
      bffBackend.httpSettings
      frontendBackend.httpSettings
    ]
    urlPathMaps: [
      {
        name: '${bffBackend.pool.name}.pathMap'
        properties: {
          defaultBackendAddressPool: {
            id: resourceId(
              'Microsoft.Network/applicationGateways/backendAddressPools',
              gatewayName,
              frontendBackend.pool.name
            )
          }
          defaultBackendHttpSettings: {
            id: resourceId(
              'Microsoft.Network/applicationGateways/backendHttpSettingsCollection',
              gatewayName,
              frontendBackend.httpSettings.name
            )
          }
          pathRules: [
            {
              name: bffBackend.pool.name
              properties: {
                paths: [
                  '/api*'
                ]
                backendAddressPool: {
                  id: resourceId(
                    'Microsoft.Network/applicationGateways/backendAddressPools',
                    gatewayName,
                    bffBackend.pool.name
                  )
                }
                backendHttpSettings: {
                  id: resourceId(
                    'Microsoft.Network/applicationGateways/backendHttpSettingsCollection',
                    gatewayName,
                    bffBackend.httpSettings.name
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
          ruleType: 'PathBasedRouting'
          httpListener: {
            id: resourceId('Microsoft.Network/applicationGateways/httpListeners', gatewayName, 'appGatewayHttpListener')
          }
          urlPathMap: {
            id: resourceId(
              'Microsoft.Network/applicationGateways/urlPathMaps',
              gatewayName,
              '${bffBackend.pool.name}.pathMap'
            )
          }
        }
      }
    ]
  }
}
