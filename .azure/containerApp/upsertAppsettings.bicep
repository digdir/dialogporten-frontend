param containerAppName string
param settings object

resource containerApp 'Microsoft.Web/sites@2022-03-01' existing = {
    name: containerAppName
}

resource appsettings 'Microsoft.Web/sites/config@2022-03-01' = {
    parent: containerApp
    name: 'appsettings'
    properties: settings
}
