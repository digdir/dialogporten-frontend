# Manual deployment (⚠️ handle with care)

This project utilizes two GitHub dispatch workflows to manage manual deployments: `dispatch-apps.yml` and `dispatch-infrastructure.yml`. These workflows allow for manual triggers of deployments through GitHub Actions, providing flexibility for deploying specific versions to designated environments.

## Using `dispatch-apps.yml`

The `dispatch-apps.yml` workflow is responsible for deploying applications. To trigger this workflow:

1. Navigate to the Actions tab in the GitHub repository.
2. Select the `Dispatch Apps` workflow.
3. Click on "Run workflow".
4. Fill in the required inputs:
   - **environment**: Choose the target environment (`test`, `staging`, or `prod`).
   - **version**: Specify the version to deploy. Could be git tag or a docker-tag published in packages.
   - **runMigration** (optional): Indicate whether to run database migrations (`true` or `false`).

This workflow will handle the deployment of applications based on the specified parameters, ensuring that the correct version is deployed to the chosen environment.

## Using `dispatch-infrastructure.yml`

The `dispatch-infrastructure.yml` workflow is used for deploying infrastructure components. To use this workflow:

1. Go to the Actions tab in the GitHub repository.
2. Select the `Dispatch Infrastructure` workflow.
3. Click on "Run workflow".
4. Provide the necessary inputs:
   - **environment**: Select the environment you wish to deploy to (`test`, `staging`, or `prod`).
   - **version**: Enter the version to deploy, which should correspond to a git tag.

This workflow facilitates the deployment of infrastructure to the specified environment, using the version details provided.
