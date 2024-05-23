# Deployment

This repository contains code for both infrastructure and applications. Configurations for infrastructure is located in `.azure/infrastructure`. Application configuration is in `.azure/applications`. 

## Deployment process

Deployments are done using `Github Actions` with the following steps:

### 1. Create and Merge Pull Request
- **Action**: Create a pull request.
- **Merge**: Once the pull request is reviewed and approved, merge it into the `main` branch.

### 2. Build and Deploy to Test
- **Trigger**: Merging the pull request into `main`.
- **Action**: The code is built and deployed to the test environment.
- **Tag**: The deployment is tagged with `<version>-<git-sha>`.

### 3. Prepare Release for Staging
- **Passive**: Release-please creates or updates a release pull request.
- **Purpose**: This generates a changelog and bumps the version number.
- **Merge**: Merge the release pull request into the `main` branch.

### 4. Deploy to Staging (Bump Version and Create Tag)
- **Trigger**: Merging the release pull request.
- **Action**: 
  - Bumps the version number.
  - Generates the release and changelog.
  - Deployment is tagged with the new `<version>` without `<git-sha>`
  - The new version is built and deployed to the staging environment.

### 5. Prepare deployment to Production
- **Action**: Perform a dry run towards the production environment to ensure the deployment can proceed without issues.

### 6. Deploy to Production
- **Trigger**: Approval of the dry run.
- **Action**: The new version is built and deployed to the production environment.

### Visual Workflow

![Deployment process](docs/deploy-process.png)

[Release Please](https://github.com/google-github-actions/release-please-action) is used in order to create releases, generate changelog and bumping version numbers.

`CHANGELOG.md` and `version.txt` are automatically updated and should not be changed manually.

## Github actions

Naming conventions for github actions:
- `action-*.yml`: Reusable workflows
- `ci-cd-*.yml`: Workflows that are triggered by an event
- `dispatch-*.yml`: Workflows that are dispatchable

The `action-check-for-changes.yml` workflow uses the `tj-actions/changed-files` action to check which files have been altered since last commit or tag. We use this filter to ensure we only deploy backend code or infrastructure if the respective files have been altered. 

## Infrastructure

Infrastructure definitions for the project are located in the `.azure/infrastructure` folder. To add new infrastructure components, follow the existing pattern found within this directory. This involves creating new Bicep files or modifying existing ones to define the necessary infrastructure resources.

For example, to add a new storage account, you would:
- Create or update a Bicep file within the `.azure/infrastructure` folder to include the storage account resource definition.
- Ensure that the Bicep file is referenced correctly in `.azure/infrastructure/infrastructure.bicep` to be included in the deployment process.

Refer to the existing infrastructure definitions as templates for creating new components.

## Applications

All application Bicep definitions are located in the `.azure/applications` folder. To add a new application, follow the existing pattern found within this directory. This involves creating a new folder for your application under `.azure/applications` and adding the necessary Bicep files (`main.bicep` and environment-specific parameter files, e.g., `test.bicepparam`, `staging.bicepparam`).

For example, to add a new application named `bff-new`, you would:
- Create a new folder: `.azure/applications/bff-new`
- Add a `main.bicep` file within this folder to define the application's infrastructure.
- Use the appropriate `Bicep`-modules within this file. There is one for `Container apps` which you most likely would use.
- Add parameter files for each environment (e.g., `test.bicepparam`, `staging.bicepparam`) to specify environment-specific values.

Refer to the existing applications like `bff` and `frontend` as templates.
