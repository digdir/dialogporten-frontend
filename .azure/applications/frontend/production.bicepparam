using './main.bicep'

param environment = 'production'
param location = 'norwayeast'
param imageTag = readEnvironmentVariable('IMAGE_TAG')

// secrets
param containerAppEnvironmentName = readEnvironmentVariable('CONTAINER_APP_ENVIRONMENT_NAME')
