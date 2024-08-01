param destKeyVaultName string
param secretName string
@secure()
param secretValue string

@description('The tags to apply to the resources')
param tags object

resource secret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: '${destKeyVaultName}/${secretName}'
  properties: {
    value: secretValue
  }
  tags: tags
}

output secretUri string = secret.properties.secretUri
