using './main.bicep'

param environment = 'ephemeral'
param location = 'norwayeast'
param imageTag = readEnvironmentVariable('IMAGE_TAG')
param minReplicas = 2
param maxReplicas = 3

// secrets
param hostName = readEnvironmentVariable('HOST_NAME')
param environmentKeyVaultName = readEnvironmentVariable('ENVIRONMENT_KEY_VAULT_NAME')
param containerAppEnvironmentName = readEnvironmentVariable('CONTAINER_APP_ENVIRONMENT_NAME')
param appInsightConnectionString = readEnvironmentVariable('APP_INSIGHTS_CONNECTION_STRING')
param appConfigurationName = readEnvironmentVariable('APP_CONFIGURATION_NAME')
