targetScope = 'subscription'

param environment string
param location string
param keyVault object
param imageUrl string
param deployTimestamp string
var namePrefix = 'dp-${environment}'
@secure()
param secrets object

// Create resource groups
resource resourceGroup 'Microsoft.Resources/resourceGroups@2022-09-01' = {
    name: '${namePrefix}-rg'
    location: location
}

// Create resources without dependencies to other resources
// module website 'website/create.bicep' = {
//     scope: resourceGroup
//     name: 'website'
//     params: {
//         namePrefix: namePrefix
//         location: location
//     }
// }

// Create resources without dependencies to other resources

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

module appConfigConfigurations 'appConfiguration/upsertKeyValue.bicep' = {
    scope: resourceGroup
    name: 'AppConfig_Add_DialogDbConnectionString'
    params: {
        configStoreName: appConfiguration.outputs.name
        key: 'Infrastructure:DialogDbConnectionString'
        value: postgresql.outputs.adoConnectionStringSecretUri
        keyValueType: 'keyVaultReference'
    }
}

module keyVaultReaderAccessPolicy 'keyvault/addReaderRoles.bicep' = {
    scope: resourceGroup
    name: 'keyVaultReaderAccessPolicy'
    params: {
        keyvaultName: keyVaultModule.outputs.name
        // TODO: Har lagt til dialogporten-subscription-deploy-principal ettersom den m� hente ut db connectionstring fra keyvault for migrasjon
        principalIds: [ containerApp.outputs.identityPrincipalId, 'ce4fe21d-6e93-41af-8e2d-7ae6f7abef74' ]
    }
}

module containerApp 'containerApp/create.bicep' = {
    scope: resourceGroup
    name: 'containerApp'
    params: {
        namePrefix: namePrefix
        location: location
        imageUrl: imageUrl
        envVariables: [
            {
                name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
                value: appInsights.outputs.connectionString
            }
            {
                name: 'BICEP_TEST_ENV_VARIABLE'
                value: 'This is a test'
            }
            {
                name: 'AZURE_APPCONFIG_URI'
                value: appConfiguration.outputs.endpoint
            }
            {
                name: 'DEPLOY_TIMESTAMP'
                value: deployTimestamp
            }
        ]
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

output resourceGroupName string = resourceGroup.name
// output postgreServerName string = postgresql.outputs.serverName
// output psqlConnectionStringSecretUri string = postgresql.outputs.psqlConnectionStringSecretUri
// output websiteName string = website.outputs.name
output containerAppName string = 'containerApp.outputs.name'
// output containerAppName string = containerApp.outputs.name
