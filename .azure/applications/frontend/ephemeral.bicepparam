using './main.bicep'

param environment = 'ephemeral'
param location = 'norwayeast'
param imageTag = readEnvironmentVariable('IMAGE_TAG')
param minReplicas = 2
param maxReplicas = 3

// todo: this is ugly
param prNumber = readEnvironmentVariable('PR_NUMBER', '')
param containerAppName = 'dp-fe-${environment}-frontend-${prNumber}'

// secrets
param containerAppEnvironmentName = readEnvironmentVariable('CONTAINER_APP_ENVIRONMENT_NAME')
