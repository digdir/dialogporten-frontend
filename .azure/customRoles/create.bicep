param assignableScope string

var actions = [
  'microsoft.app/jobs/read'
  'microsoft.app/jobs/executions/read'
]

var containerJobRole = guid(subscription().id, string(actions))

resource containerJobRoleDefinition 'Microsoft.Authorization/roleDefinitions@2022-04-01' = {
  name: containerJobRole
  properties: {
    roleName: 'Custom Container App Job Role FE'
    description: 'Read rights for container apps jobs/executions'
    type: 'customRole'
    permissions: [
      {
        actions: actions
        notActions: []
        dataActions: []
        notDataActions: []
      }
    ]
    assignableScopes: [
      assignableScope
    ]
  }
}

var dataActions = [
  'Microsoft.AppConfiguration/configurationStores/*/read'
  'Microsoft.AppConfiguration/configurationStores/*/write'
]

var appConfigReaderRole = guid(subscription().id, string(dataActions))

resource appConfigReaderRoleDefinition 'Microsoft.Authorization/roleDefinitions@2022-04-01' = {
  name: appConfigReaderRole
  properties: {
    roleName: 'Custom App Config Reader Role FE'
    description: 'Read rights for container apps jobs/executions'
    type: 'customRole'
    permissions: [
      {
        actions: []
        notActions: []
        dataActions: dataActions
        notDataActions: []
      }
    ]
    assignableScopes: [
      assignableScope
    ]
  }
}

output containerJobRoleId string = containerJobRoleDefinition.id
output appConfigReaderRoleId string = appConfigReaderRoleDefinition.id
