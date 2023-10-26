param(
	[Parameter(Mandatory)]
	[string]$environment,

	[Parameter(Mandatory)]
	[string]$subscriptionId,

	[Parameter(Mandatory)]
	[string]$imageUrl,

	[Parameter(Mandatory)]
	[string]$deployTimestamp,

	[Parameter(Mandatory)]
	[string]$gitSha
)
Import-module "$PSScriptRoot/powershell/jsonMerge.ps1" -Force
Import-module "$PSScriptRoot/powershell/pwdGenerator.ps1" -Force

# Merge main.parameters.json and optional main.parameters.$environment.json
$paramsJson = JsonMergeFromPath "$PSScriptRoot/main.parameters.json" "$PSScriptRoot/main.parameters.$environment.json"
Write-Host "GitSha: $gitSha"

# Add keyvault keys to parameters.keyVault.value.source.keys
AddMemberPath $paramsJson "parameters.keyVault.value.source.keys" @( `
		az keyvault secret list `
		--vault-name $paramsJson.parameters.keyVault.value.source.name `
		--subscription $paramsJson.parameters.keyVault.value.source.subscriptionId `
		--query "[].name" `
		--output tsv `
)

# Add gitSha to parameters
AddMemberPath $paramsJson "parameters.gitSha.value" $gitSha


# Add auto generated secrets to parameters
AddMemberPath $paramsJson "parameters.secrets.value" @{
	dialogportenPgAdminPassword = (GeneratePassword -length 30).Password
}
AddMemberPath $paramsJson "parameters.imageUrl.value" $imageUrl
AddMemberPath $paramsJson "parameters.deployTimestamp.value" $deployTimestamp

# Add environment to parameters
AddMemberPath $paramsJson "parameters.environment.value" $environment

Write-Host (ConvertTo-Json -Depth 100 $paramsJson)


# Format parameters to be used in az deployment sub create
$formatedParamsJsonForGHA = $paramsJson `
| ConvertTo-Json -Compress -Depth 100 `
| % { $_ -replace "`"", "\`"" } `
| % { $_ -replace "`n", "" } `
| % { $_ -replace "\s", "" }

$formatedParamsJsonForLocalCLI = $paramsJson `
| ConvertTo-Json -Compress -Depth 100 `

$formatedParamsJson = $formatedParamsJsonForGHA

if ( $environment -match 'cli-fe-dev') {
	Write-Host ("********** FOUND LOCAL CLI DEPLOYMENT")
	$formatedParamsJson = $formatedParamsJsonForLocalCLI
}
else {
	Write-Host ("********** FOUND GITHUB ACTIONS DEPLOYMENT")
}
# # Format parameters to be used in az deployment sub create
# $formatedParamsJson = $paramsJson `
# | ConvertTo-Json -Compress -Depth 100 `
# | % { $_ -replace "`"", "\`"" } `
# | % { $_ -replace "`n", "" } `
# | % { $_ -replace "\s", "" }


# if ($environment == 'cli-fe-dev') {
# 	Write-Host ("********** FOUND LOCAL CLI DEPLOYMENT")
# 	$formatedParamsJson = $paramsJson `
# 	| ConvertTo-Json -Compress -Depth 100 `

# }
# else {
# 	Write-Host ("********** FOUND GITHUB ACTIONS DEPLOYMENT")
# }

Write-Host ("********** Starting deployment of $environment **********")
# Write-Host ("********** properties $properties **********")
# Write-Host ("********** formatedParamsJson $formatedParamsJson **********")

# Deploy
$deploymentOutputs = @( `
		az deployment sub create `
		--subscription $subscriptionId `
		--location $paramsJson.parameters.location.value `
		--name "GithubActionsDeploy-fe-$environment" `
		--template-file "$($PSScriptRoot)/main.bicep" `
		--parameters $formatedParamsJson `
		--query properties.outputs `
		--debug `
		--verbose `
		#--confirm-with-what-if
	| ConvertFrom-Json `
)
Write-Host ("********** deploymentOutputs $deploymentOutputs **********")

$resourceGroup = $deploymentOutputs.resourceGroupName.value
$migrationJobName = $deploymentOutputs.migrationJobName.value

az containerapp job start -n $migrationJobName -g $resourceGroup

Write-Host ("********** Starting foreach **********")

# Write outputs to GITHUB_OUTPUT so that they can be used in other steps
foreach ($Property in $deploymentOutputs | Get-Member -type NoteProperty, Property) {
	"$($Property.Name)=$($deploymentOutputs.$($Property.Name).value)" >> $env:GITHUB_OUTPUT
}