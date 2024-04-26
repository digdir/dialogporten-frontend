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

param keyVaultCertificateId string // Parameter for Key Vault secret ID for the certificate. TODO

var gatewayName = '${namePrefix}-applicationGateway'

resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' existing = {
  name: containerAppEnvName
}

resource publicIp 'Microsoft.Network/publicIPAddresses@2021-03-01' = {
  name: '${gatewayName}-publicIp'
  location: location
  properties: {
    publicIPAllocationMethod: 'Dynamic'
  }
}

var publicIpAddressId = publicIp.id

var bffPool = {
  name: '${gatewayName}-bffBackendPool'
  properties: {
    backendAddresses: [
      {
        fqdn: '${namePrefix}-bff.${containerAppEnvironment.properties.defaultDomain}.${location}.azurecontainerapps.io'
      }
    ]
  }
}

var bffHttpSettings = {
  name: '${gatewayName}-bffBackendPool-backendHttpSettings'
  properties: {
    port: 80
    protocol: 'Http'
    cookieBasedAffinity: 'Disabled'
    probe: {
      id: resourceId('Microsoft.Network/applicationGateways/probes', gatewayName, bffProbe.name)
    }
  }
}

var bffProbe = {
  name: '${gatewayName}-bffBackendPool-probe'
  properties: {
    host: bffPool.properties.backendAddresses[0].fqdn
    protocol: 'Http'
    path: '/api/liveness' // todo: create a separate endpoint for healthz?
    interval: 30
    timeout: 30
    unhealthyThreshold: 3
  }
}

var bffGatewayBackend = {
  pool: bffPool
  httpSettings: bffHttpSettings
  probe: bffProbe
}

var frontendPool = {
  name: '${gatewayName}-frontendPool'
  properties: {
    backendAddresses: [
      {
        fqdn: '${namePrefix}-frontend-design-poc.${containerAppEnvironment.properties.defaultDomain}.${location}.azurecontainerapps.io'
      }
    ]
  }
}

var frontendProbe = {
  name: '${gatewayName}-frontendPool-probe'
  properties: {
    host: frontendPool.properties.backendAddresses[0].fqdn
    protocol: 'Http'
    path: '/' // todo: create a separate endpoint for healthz?
    interval: 30
    timeout: 30
    unhealthyThreshold: 3
  }
}

var frontendHttpSettings = {
  name: '${gatewayName}-frontendPool-backendHttpSettings'
  properties: {
    port: 80
    protocol: 'Http'
    cookieBasedAffinity: 'Disabled'
    probe: {
      id: resourceId('Microsoft.Network/applicationGateways/probes', gatewayName, frontendProbe.name)
    }
  }
}

var frontendGatewayBackend = {
  pool: frontendPool
  httpSettings: frontendHttpSettings
  probe: frontendProbe
}

resource applicationGateway 'Microsoft.Network/applicationGateways@2023-04-01' = {
  name: gatewayName
  location: location
  properties: {
    sku: sku
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
          protocol: 'Https' // Changed to HTTPS to support SSL termination
          sslCertificate: {
            id: resourceId(
              'Microsoft.Network/applicationGateways/sslCertificates',
              gatewayName,
              '${gatewayName}-gatewaySslCertificate'
            )
          }
        }
      }
    ]
    sslCertificates: [
      {
        name: '${gatewayName}-gatewaySslCertificate'
        properties: {
          keyVaultSecretId: keyVaultCertificateId
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
    probes: [
      bffGatewayBackend.probe
      frontendGatewayBackend.probe
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
    type: 'SystemAssigned'
  }
}

output applicationGatewayId string = applicationGateway.id
