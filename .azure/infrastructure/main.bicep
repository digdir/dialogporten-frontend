targetScope = 'subscription'

param environment string
param location string
param keyVaultSourceKeys array

param gitSha string

@secure()
@minLength(3)
param dialogportenPgAdminPassword string
@secure()
@minLength(3)
param sourceKeyVaultSubscriptionId string
@secure()
@minLength(3)
param sourceKeyVaultResourceGroup string
@secure()
@minLength(3)
param sourceKeyVaultName string

var secrets = {
    dialogportenPgAdminPassword: dialogportenPgAdminPassword
    sourceKeyVaultSubscriptionId: sourceKeyVaultSubscriptionId
    sourceKeyVaultResourceGroup: sourceKeyVaultResourceGroup
    sourceKeyVaultName: sourceKeyVaultName
}

var namePrefix = 'dp-fe-${environment}'

var baseImageUrl = 'ghcr.io/digdir/dialogporten-frontend'

// Create resource groups
resource resourceGroup 'Microsoft.Resources/resourceGroups@2022-09-01' = {
    name: '${namePrefix}-rg'
    location: location
}

module environmentKeyVault '../modules/keyvault/create.bicep' = {
    scope: resourceGroup
    name: 'keyVault'
    params: {
        namePrefix: namePrefix
        location: location
    }
}

module appConfiguration '../modules/appConfiguration/create.bicep' = {
    scope: resourceGroup
    name: 'appConfiguration'
    params: {
        namePrefix: namePrefix
        location: location
    }
}

module appInsights '../modules/applicationInsights/create.bicep' = {
    scope: resourceGroup
    name: 'appInsights'
    params: {
        namePrefix: namePrefix
        location: location
    }
}

// Create references to existing resources
resource srcKeyVaultResource 'Microsoft.KeyVault/vaults@2022-11-01' existing = {
    name: secrets.sourceKeyVaultName
    scope: az.resourceGroup(secrets.sourceKeyVaultSubscriptionId, secrets.sourceKeyVaultResourceGroup)
}

var srcKeyVault = {
    name: secrets.sourceKeyVaultName
    subscriptionId: secrets.sourceKeyVaultSubscriptionId
    resourceGroupName: secrets.sourceKeyVaultResourceGroup
}

// Create resources with dependencies to other resources
module postgresql '../modules/postgreSql/create.bicep' = {
    scope: resourceGroup
    name: 'postgresql'
    params: {
        namePrefix: namePrefix
        location: location
        keyVaultName: environmentKeyVault.outputs.name
        srcKeyVault: srcKeyVault
        srcSecretName: 'dialogportenPgAdminPassword${environment}'
        administratorLoginPassword: contains(keyVaultSourceKeys, 'dialogportenPgAdminPassword${environment}') ? srcKeyVaultResource.getSecret('dialogportenPgAdminPassword${environment}') : secrets.dialogportenPgAdminPassword
    }
}

module copySecret '../modules/keyvault/copySecrets.bicep' = {
    scope: resourceGroup
    name: 'copySecrets'
    params: {
        srcKeyVaultKeys: keyVaultSourceKeys
        srcKeyVaultName: srcKeyVault.name
        srcKeyVaultRGNName: srcKeyVault.resourceGroupName
        srcKeyVaultSubId: srcKeyVault.subscriptionId
        destKeyVaultName: environmentKeyVault.outputs.name
        secretPrefix: 'dialogporten--${environment}--'
    }
}

module migrationJob '../modules/migrationJob/create.bicep' = {
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
                value: environmentKeyVault.outputs.name
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

module appConfigConfigurations '../modules/appConfiguration/upsertKeyValue.bicep' = {
    scope: resourceGroup
    name: 'AppConfig_Add_DialogDbConnectionString'
    params: {
        configStoreName: appConfiguration.outputs.name
        key: 'Infrastructure:DialogDbConnectionString'
        value: postgresql.outputs.psqlConnectionJSONSecretUri
        keyValueType: 'keyVaultReference'
    }
}
// module appConfigConfigurationsDebug 'appConfiguration/upsertKeyValue.bicep' = {
//     scope: resourceGroup
//     name: 'appConfigConfigurationsDebug'
//     params: {
//         configStoreName: appConfiguration.outputs.name
//         key: 'Infrastructure:psqlConnectionJSON'
//         value: postgresql.outputs.psqlConnectionJSON
//         keyValueType: 'custom'
//     }
// }

module keyVaultReaderAccessPolicy '../modules/keyvault/addReaderRoles.bicep' = {
    scope: resourceGroup
    name: 'keyVaultReaderAccessPolicy'
    params: {
        keyvaultName: environmentKeyVault.outputs.name
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

module initContainerApp '../modules/containerApp/init.bicep' = {
    scope: resourceGroup
    name: 'initContainerApp'
    params: {
        namePrefix: namePrefix
        location: location
        baseImageUrl: baseImageUrl
        gitSha: gitSha
    }

}
module createMECertificate '../modules/containerApp/createMECertificate.bicep' = {
    dependsOn: [ initContainerApp ]
    scope: resourceGroup
    name: 'createMECertificate'
    params: {
        namePrefix: namePrefix
        location: location
    }
}
module containerApp '../modules/containerApp/addNECertufucateToContainer.bicep' = {
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
                value: environmentKeyVault.outputs.name
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

module customContainerAppRole '../modules/customRoles/create.bicep' = {
    scope: resourceGroup
    name: 'customContainerAppRole'
    params: {
        assignableScope: resourceGroup.id
    }
}

module assignContainerAppJobRoles '../modules/customRoles/assign.bicep' = {
    scope: resourceGroup
    name: 'assignContainerAppJobRoles'
    params: {
        roleDefinitionId: customContainerAppRole.outputs.containerJobRoleId
        principalIds: [ containerApp.outputs.identityPrincipalId, migrationJob.outputs.principalId ]
    }
}

module assignConfigReaderRole '../modules/customRoles/assign.bicep' = {
    scope: resourceGroup
    name: 'assignConfigReaderRole'
    params: {
        roleDefinitionId: customContainerAppRole.outputs.appConfigReaderRoleId
        principalIds: [ containerApp.outputs.identityPrincipalId, migrationJob.outputs.principalId ]
    }
}

module appConfigReaderAccessPolicy '../modules/appConfiguration/addReaderRoles.bicep' = {
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
