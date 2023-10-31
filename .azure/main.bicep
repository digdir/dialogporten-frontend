targetScope = 'subscription'

param environment string
param location string
param keyVault object
// param imageUrl string
// param deployTimestamp string
param gitSha string
var namePrefix = 'dp-fe-${environment}'
@secure()
param secrets object

var baseImageUrl = 'ghcr.io/digdir/dialogporten-frontend'

// Create resource groups
resource resourceGroup 'Microsoft.Resources/resourceGroups@2022-09-01' = {
    name: '${namePrefix}-rg'
    location: location
}

module keyVaultModule 'keyvault/create.bicep' = {
    scope: resourceGroup
    name: 'keyVault'
    params: {
        namePrefix: namePrefix
        location: location
        adminObjectIds: keyVault.adminObjectIds
    }
}

module appConfiguration 'appConfiguration/create.bicep' = {
    scope: resourceGroup
    name: 'appConfiguration'
    params: {
        namePrefix: namePrefix
        location: location
    }
}

module appInsights 'applicationInsights/create.bicep' = {
    scope: resourceGroup
    name: 'appInsights'
    params: {
        namePrefix: namePrefix
        location: location
    }
}

// Create references to existing resources
resource srcKeyVaultResource 'Microsoft.KeyVault/vaults@2022-11-01' existing = {
    name: keyVault.source.name
    scope: az.resourceGroup(keyVault.source.subscriptionId, keyVault.source.resourceGroupName)
}

// Create resources with dependencies to other resources
module postgresql 'postgreSql/create.bicep' = {
    scope: resourceGroup
    name: 'postgresql'
    params: {
        namePrefix: namePrefix
        location: location
        keyVaultName: keyVaultModule.outputs.name
        srcKeyVault: keyVault.source
        srcSecretName: 'dialogportenPgAdminPassword${environment}'
        administratorLoginPassword: contains(keyVault.source.keys, 'dialogportenPgAdminPassword${environment}') ? srcKeyVaultResource.getSecret('dialogportenPgAdminPassword${environment}') : secrets.dialogportenPgAdminPassword
    }
}

module copySecret 'keyvault/copySecrets.bicep' = {
    scope: resourceGroup
    name: 'copySecrets'
    params: {
        srcKeyVaultKeys: keyVault.source.keys
        srcKeyVaultName: keyVault.source.name
        srcKeyVaultRGNName: keyVault.source.resourceGroupName
        srcKeyVaultSubId: keyVault.source.subscriptionId
        destKeyVaultName: keyVaultModule.outputs.name
        secretPrefix: 'dialogporten--${environment}--'
    }
}

module migrationJob 'migrationJob/create.bicep' = {
    scope: resourceGroup
    name: 'migrationJob'
    params: {
        namePrefix: namePrefix
        location: location
        baseImageUrl: baseImageUrl
        gitSha: gitSha
        psqlConnectionJSONSecretUri: postgresql.outputs.psqlConnectionJSONSecretUri
        envVariables: [
            {
                name: 'Infrastructure__DialogDbConnectionString'
                secretRef: 'adoconnectionstringsecreturi'
            }
            {
                name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
                value: appInsights.outputs.connectionString
            }
            {
                name: 'KV_NAME'
                value: keyVaultModule.outputs.name
            }
            {
                name: 'PSQL_CONNECTION_JSON_NAME' // MÅ BYTTES UT, DETTE SKAL HENTES FRA APP CONFIG
                value: postgresql.outputs.psqlConnectionJSONSecretName
            }
            {
                name: 'AZURE_APPCONFIG_URI'
                value: appConfiguration.outputs.endpoint
            }
            {
                name: 'GIT_SHA'
                value: gitSha
            }
            {
                name: 'PSQL_CONNECTION_JSON'
                value: postgresql.outputs.psqlConnectionJSON
            }
            {
                name: 'DEV_ENV'
                value: 'test'
            }
            {
                name: 'IS_MIGRATION_JOB'
                value: 'true'
            }
        ]
    }
}

// module appsettings 'containerApp/upsertAppsettings.bicep' = {
//     scope: resourceGroup
//     name: 'appsettings'
//     params: {
//         containerAppName: containerApp.outputs.name
//         settings: {
//             APPLICATIONINSIGHTS_CONNECTION_STRING: appInsights.outputs.connectionString
//             AZURE_APPCONFIG_URI: appConfiguration.outputs.endpoint
//         }
//     }
// }

// module migrationsettings 'containerApp/upsertAppsettings.bicep' = {
//     scope: resourceGroup
//     name: 'migrationsettings'
//     params: {
//         containerAppName: migrationJob.outputs.name
//         settings: {
//             APPLICATIONINSIGHTS_CONNECTION_STRING: appInsights.outputs.connectionString
//             AZURE_APPCONFIG_URI: appConfiguration.outputs.endpoint
//         }
//     }
// }

// REMOVED BECAUSE THIS IS NOT NEEDED IN NODE:
module appConfigConfigurations 'appConfiguration/upsertKeyValue.bicep' = {
    scope: resourceGroup
    name: 'AppConfig_Add_DialogDbConnectionString'
    params: {
        configStoreName: appConfiguration.outputs.name
        key: 'Infrastructure:DialogDbConnectionString'
        value: postgresql.outputs.psqlConnectionJSONSecretUri
        keyValueType: 'keyVaultReference'
    }
}

// module appConfigConfigurations 'appConfiguration/upsertKeyValue.bicep' = {
//     scope: resourceGroup
//     name: 'AppConfig_Add_MigrationStatus'
//     params: {
//         configStoreName: appConfiguration.outputs.name
//         key: 'Infrastructure:MigrationCompleted'
//         value: 'false'
//         keyValueType: 'custom'
//     }
// }

// resource AppConfig_Add_MigrationStatus 'Microsoft.AppConfiguration/configurationStores@2020-07-01-preview' = {
//     name: 'yourAppConfigName'
//     location: 'East US'
//     properties: {
//       connectionString: 'Endpoint=https://yourappconfig.azconfig.io;Id=yourId;Secret=yourSecret'
//     }
//   }

// resource appConfigKey 'Microsoft.AppConfiguration/configurationStores/configurationKeyValue@2020-07-01-preview' = {
//     parent: appConfiguration.outputs.name
//     name: 'yourKey'
//     properties: {
//       contentType: 'text',
//       value: 'false'
//     }
//   }

module keyVaultReaderAccessPolicy 'keyvault/addReaderRoles.bicep' = {
    scope: resourceGroup
    name: 'keyVaultReaderAccessPolicy'
    params: {
        keyvaultName: keyVaultModule.outputs.name
        // TODO: Har lagt til dialogporten-subscription-deploy-principal ettersom den m� hente ut db connectionstring fra keyvault for migrasjon
        principalIds: [ containerApp.outputs.identityPrincipalId, migrationJob.outputs.principalId, '49f570f3-9677-4eb7-b360-eaed33f98632', '2e8cd2b0-400f-4be7-9b8e-311c14263048' ] // FJERNES!!!!!
    }
}

module containerApp 'containerApp/create.bicep' = {
    scope: resourceGroup
    name: 'containerApp'
    params: {
        namePrefix: namePrefix
        psqlConnectionJSONSecretUri: postgresql.outputs.psqlConnectionJSONSecretUri
        location: location
        baseImageUrl: baseImageUrl
        gitSha: gitSha
        envVariables: [
            {
                name: 'Infrastructure__DialogDbConnectionString'
                secretRef: 'adoconnectionstringsecreturi'
            }
            {
                name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
                value: appInsights.outputs.connectionString
            }
            {
                name: 'KV_NAME'
                value: keyVaultModule.outputs.name
            }
            {
                name: 'GIT_SHA'
                value: gitSha
            }
            {
                name: 'PSQL_CONNECTION_JSON_NAME' // MÅ BYTTES UT, DETTE SKAL HENTES FRA APP CONFIG
                value: postgresql.outputs.psqlConnectionJSONSecretName
            }
            {
                name: 'AZURE_APPCONFIG_URI'
                value: appConfiguration.outputs.endpoint
            }
            {
                name: 'PSQL_CONNECTION_JSON'
                value: postgresql.outputs.psqlConnectionJSON
            }
            {
                name: 'DEV_ENV'
                value: 'test'
            }
            {
                name: 'IS_MIGRATION_JOB'
                value: 'false'
            }
        ]
    }

}

module customContainerAppRole 'customRoles/create.bicep' = {
    scope: resourceGroup
    name: 'customContainerAppRole'
    params: {
        assignableScope: resourceGroup.id
    }
}

module assignContainerAppJobRoles 'customRoles/assign.bicep' = {
    scope: resourceGroup
    name: 'assignContainerAppJobRoles'
    params: {
        roleDefinitionId: customContainerAppRole.outputs.containerJobRoleId
        principalIds: [ containerApp.outputs.identityPrincipalId, migrationJob.outputs.principalId ]
    }
}

module assignConfigReaderRole 'customRoles/assign.bicep' = {
    scope: resourceGroup
    name: 'assignConfigReaderRole'
    params: {
        roleDefinitionId: customContainerAppRole.outputs.appConfigReaderRoleId
        principalIds: [ containerApp.outputs.identityPrincipalId, migrationJob.outputs.principalId ]
    }
}

module appConfigReaderAccessPolicy 'appConfiguration/addReaderRoles.bicep' = {
    scope: resourceGroup
    name: 'appConfigReaderAccessPolicy'
    params: {
        appConfigurationName: appConfiguration.outputs.name
        principalIds: [ containerApp.outputs.identityPrincipalId ]
    }
}
// module resetMigrationStatus 'appConfiguration/resetMigrationStatus.bicep' = {
//     scope: resourceGroup
//     name: 'resetMigrationStatus'
//     params: {
//         appConfigurationName: appConfiguration.outputs.name
//         key: 'Infrastructure:MigrationCompleted'
//         value: 'false'
//     }
// }
// module appConfigWriterAccessPolicy 'appConfiguration/addWriterRoles.bicep' = {
//     scope: resourceGroup
//     name: 'appConfigWriterAccessPolicy'
//     params: {
//         appConfigurationName: appConfiguration.outputs.name
//         principalIds: [ containerApp.outputs.identityPrincipalId, migrationJob.outputs.principalId ]
//     }
// }

output resourceGroupName string = resourceGroup.name
output postgreServerName string = postgresql.outputs.serverName
output containerAppName string = containerApp.outputs.name
output migrationJobName string = migrationJob.outputs.bundleName
