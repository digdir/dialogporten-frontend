using './main.bicep'

param environment = 'staging'
param location = 'norwayeast'
param imageTag = readEnvironmentVariable('IMAGE_TAG')

// secrets
param containerAppEnvironmentName = readEnvironmentVariable('CONTAINER_APP_ENVIRONMENT_NAME')
