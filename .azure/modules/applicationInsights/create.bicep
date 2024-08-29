param namePrefix string
param location string

@description('The tags to apply to the resources')
param tags object

resource appInsightsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '${namePrefix}-insightsWorkspace'
  location: location
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${namePrefix}-applicationInsights'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: appInsightsWorkspace.id
  }
  tags: tags
}

output connectionString string = appInsights.properties.ConnectionString
output appInsightsWorkspaceName string = appInsightsWorkspace.name
