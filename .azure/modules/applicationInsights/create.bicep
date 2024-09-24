param namePrefix string
param location string

@description('The tags to apply to the resources')
param tags object

resource appInsightsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
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


resource healthCheckMonitor 'Microsoft.Insights/webtests@2022-06-15' = {
  name: 'string'
  location: 'string'
  tags: tags
  kind: 'standard'
  properties: {
    Configuration: {
      WebTest: 'string'
    }
    Description: 'string'
    Enabled: bool
    Frequency: int
    Kind: 'string'
    Locations: [
      {
        Id: 'string'
      }
    ]
    Name: 'string'
    Request: {
      FollowRedirects: bool
      Headers: [
        {
          key: 'string'
          value: 'string'
        }
      ]
      HttpVerb: 'GET'
      ParseDependentRequests: bool
      RequestBody: 'string'
      RequestUrl: 'string'
    }
    RetryEnabled: bool
    SyntheticMonitorId: 'string'
    Timeout: int
    ValidationRules: {
      ContentValidation: {
        ContentMatch: 'string'
        IgnoreCase: bool
        PassIfTextFound: bool
      }
      ExpectedHttpStatusCode: int
      IgnoreHttpStatusCode: bool
      SSLCertRemainingLifetimeCheck: int
      SSLCheck: bool
    }
  }
}

output connectionString string = appInsights.properties.ConnectionString
output appInsightsWorkspaceName string = appInsightsWorkspace.name
