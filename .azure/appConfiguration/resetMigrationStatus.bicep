param appConfigurationName string
param key string
param value string

resource appSettings 'Microsoft.AppConfiguration/configurationStores@2022-05-01' existing = {
  name: appConfigurationName
}
resource setting 'Microsoft.AppConfiguration/configurationSettings@2022-05-01' existing = {
  scope: appSettings
  name: key
}

@description('This Bicep script sets the value of the app configuration key to "false" if the key already exists.')
resource updateSetting 'Microsoft.AppConfiguration/configurationSettings@2022-05-01' = {
  scope: appSettings
  name: key
  properties: {
    value: value
  }
}
