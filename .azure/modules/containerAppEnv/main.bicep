@description('The geographic location where the resource will be deployed')
param location string

@description('The prefix used for naming resources to ensure unique names')
param namePrefix string

@description('The identifier for the subnet where the container app environment will be deployed')
param subnetId string

param appInsightWorkspaceName string

@description('The tags to apply to the resources')
param tags object

resource appInsightsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' existing = {
  name: appInsightWorkspaceName
}

resource containerAppEnv 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: '${namePrefix}-containerappenv'
  location: location
  properties: {
    vnetConfiguration: {
      infrastructureSubnetId: subnetId
      internal: true
    }
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: appInsightsWorkspace.properties.customerId
        sharedKey: appInsightsWorkspace.listKeys().primarySharedKey
      }
    }
  }
  tags: tags
}

output name string = containerAppEnv.name
output defaultDomain string = containerAppEnv.properties.defaultDomain
output staticIp string = containerAppEnv.properties.staticIp
