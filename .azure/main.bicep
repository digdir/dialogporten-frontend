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
        psqlConnectionJSON: postgresql.outputs.psqlConnectionJSON
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
                name: 'DEV_ENV'
                value: 'test'
            }
            {
                name: 'IS_MIGRATION_JOB'
                value: 'true'
            }
            {
                name: 'AZURE_LOG_LEVEL'
                value: 'info'
            }
        ]
    }
}

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
module appConfigConfigurationsDebug 'appConfiguration/upsertKeyValue.bicep' = {
    scope: resourceGroup
    name: 'appConfigConfigurationsDebug'
    params: {
        configStoreName: appConfiguration.outputs.name
        key: 'Infrastructure:psqlConnectionJSON'
        value: postgresql.outputs.psqlConnectionJSON
        keyValueType: 'custom'
    }
}

module keyVaultReaderAccessPolicy 'keyvault/addReaderRoles.bicep' = {
    scope: resourceGroup
    name: 'keyVaultReaderAccessPolicy'
    params: {
        keyvaultName: keyVaultModule.outputs.name
        // TODO: Har lagt til dialogporten-subscription-deploy-principal ettersom den m� hente ut db connectionstring fra keyvault for migrasjon
        principalIds: [ containerApp.outputs.identityPrincipalId, migrationJob.outputs.principalId, '49f570f3-9677-4eb7-b360-eaed33f98632', '2e8cd2b0-400f-4be7-9b8e-311c14263048' ] // FJERNES!!!!!
    }
}

// module dnsZone 'dnsZones/create.bicep' = {
//     scope: az.resourceGroup('dns-rg')

//     name: 'dnsZones'
//     params: {
//         // customDomainVerificationId: cae.outputs.customDomainVerifictaionId
//     }
// }

module initContainerApp 'containerApp/init.bicep' = {
    scope: resourceGroup
    name: 'initContainerApp'
    params: {
        namePrefix: namePrefix
        location: location
        baseImageUrl: baseImageUrl
        gitSha: gitSha
    }

}
module createMECertificate 'containerApp/createMECertificate.bicep' = {
    dependsOn: [ initContainerApp ]
    scope: resourceGroup
    name: 'createMECertificate'
    params: {
        namePrefix: namePrefix
        location: location
    }
}
module containerApp 'containerApp/addNECertufucateToContainer.bicep' = {
    dependsOn: [ createMECertificate ]
    scope: resourceGroup
    name: 'containerApp'
    params: {
        namePrefix: namePrefix
        psqlConnectionJSON: postgresql.outputs.psqlConnectionJSON
        location: location
        baseImageUrl: baseImageUrl
        gitSha: gitSha
        migrationJobName: migrationJob.outputs.name
        migrationVerifierPrincipalAppId: srcKeyVaultResource.getSecret('MigrationVerificationInitContainerPrincipalAppId')
        migrationVerifierPrincipalPassword: srcKeyVaultResource.getSecret('MigrationVerificationInitContainerPrincipalPassword')
        resourceGroupName: resourceGroup.name
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
                name: 'DEV_ENV'
                value: 'test'
            }
            {
                name: 'IS_MIGRATION_JOB'
                value: 'false'
            }
            {
                name: 'AZURE_LOG_LEVEL'
                value: 'info'
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
        principalIds: [ containerApp.outputs.identityPrincipalId, migrationJob.outputs.principalId ]
    }
}

output resourceGroupName string = resourceGroup.name
output postgreServerName string = postgresql.outputs.serverName
output containerAppName string = containerApp.outputs.name
output migrationJobName string = migrationJob.outputs.name
