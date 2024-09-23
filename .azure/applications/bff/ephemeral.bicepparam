using './main.bicep'

param environment = 'ephemeral'
param location = 'norwayeast'
param imageTag = readEnvironmentVariable('IMAGE_TAG')
param minReplicas = 2
param maxReplicas = 3

// todo: this is ugly
param prNumber = readEnvironmentVariable('PR_NUMBER', '')
param containerAppName = 'dp-fe-${environment}-bff-${prNumber}'
param hostName = '${containerAppName}.braveforest-17219268.norwayeast.azurecontainerapps.io'

// secrets
param environmentKeyVaultName = readEnvironmentVariable('ENVIRONMENT_KEY_VAULT_NAME')
param containerAppEnvironmentName = readEnvironmentVariable('CONTAINER_APP_ENVIRONMENT_NAME')
param appInsightConnectionString = readEnvironmentVariable('APP_INSIGHTS_CONNECTION_STRING')
param appConfigurationName = readEnvironmentVariable('APP_CONFIGURATION_NAME')
