import express, { Express } from 'express';
import bodyParser from 'body-parser';
// import swaggerUi from 'swagger-ui-express';
// import swaggerFile from './swagger_output.json';
import './config/env';
// import { DBConnection } from './config/database';
import { routes } from './routes';
import path from 'path';
import { DefaultAzureCredential } from '@azure/identity';
import { AppConfigurationClient } from '@azure/app-configuration';
import { setup, DistributedTracingModes } from 'applicationinsights';
import { SecretClient } from '@azure/keyvault-secrets';

const DIST_DIR = path.join(__dirname, 'public');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

const app: Express = express();
const port = process.env.PORT || 80;

// Setup Application Insights:
console.log('_ ________Setting upp App Insights _________');
console.log(
  '_ APPLICATIONINSIGHTS_CONNECTION_STRING: ',
  process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
);
setup()
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true, true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectConsole(true)
  .setUseDiskRetryCaching(true)
  .setSendLiveMetrics(false)
  .setDistributedTracingMode(DistributedTracingModes.AI_AND_W3C)
  .start();

console.log('_ ________Done setting up App Insights _________');

app.use(express.static(DIST_DIR));
app.get('/', (req, res) => {
  res.sendFile(HTML_FILE);
});
app.use(bodyParser.json());
app.use('/api/v1', routes);

function printEnvVars() {
  console.log('_ ________ENVIRONMENT START _________');
  console.log('ENV_TEST: ', process.env.ENV_TEST);
  console.log('ALL: ', process.env);
  console.log('process.env.BICEP_TEST_ENV_VARIABLE: ', process.env.BICEP_TEST_ENV_VARIABLE);
  console.log('_ ________ENVIRONMENT END _________');
}

async function testAppConf() {
  const d = new Date();
  try {
    const endpoint = process.env.AZURE_APPCONFIG_URI!;
    // const endpoint = 'https://dp-fe-dev-appconfiguration.azconfig.io';
    // const connectionString = process.env.APPCONFIG_CONNECTION_STRING;

    console.log('_ ________testAppConf Start _________');
    console.log('_ Time now: ', d);
    console.log('_ ________Connection endpoint: ' + endpoint);
    // console.log('_ ________Connection string: ' + connectionString);
    // Create a new AppConfigurationClient object using the connection string
    // const client = new AppConfigurationClient(connectionString!);

    const credential = new DefaultAzureCredential();
    console.log('credential', credential);
    const client = new AppConfigurationClient(
      endpoint, // ex: <https://<your appconfig resource>.azconfig.io>
      credential
    );
    // const client = new AppConfigurationClient(connectionString!);
    let test = await client.getConfigurationSetting({
      key: 'test',
      // key: 'Infrastructure:DialogDbConnectionString',
    });
    let vaultUri = await client.getConfigurationSetting({
      key: 'Infrastructure:DialogDbConnectionString',
    });
    console.log('_ Trying to print test:');
    console.log(test);
    console.log('_ Trying to print Infrastructure:DialogDbConnectionString:');
    console.log(vaultUri);
    console.log('_ Infrastructure:DialogDbConnectionString value :');
    console.log(vaultUri?.value || 'No value found');
    console.log('_ Infrastructure:DialogDbConnectionString value :');
    console.log('_ typeof vaultUri?.value: ', typeof vaultUri?.value);

    console.log('_ _____ TESTING KEY VAULT:');

    if (vaultUri?.value) {
      try {
        // const valJSON = JSON.parse(vaultUri.value)

        const vaultName = process.env.KV_NAME;
        const url = `https://${vaultName}.vault.azure.net`;
        console.log('_ Vault url: ', url);

        const kvClient = new SecretClient(url, credential);

        const secretName = 'dialogportenPsqlConnectionString';

        const latestSecret = await kvClient.getSecret(secretName);
        console.log(`_ Latest version of the secret ${secretName}: `, latestSecret);
        const specificSecret = await kvClient.getSecret(secretName, {
          version: latestSecret.properties.version!,
        });
        console.log(
          `_ The secret ${secretName} at the version ${latestSecret.properties.version!}: `,
          specificSecret
        );
      } catch (error) {
        console.error('_ Vault error: ', error);
      }
    }
  } catch (error) {
    console.log('testAppConf failed: ', error);
    process.exit(1);
  }
}

// Call the function every 5 seconds
// setInterval(printEnvVars, 5000); // 5000 milliseconds = 5 seconds

// app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerFile));

const start = async (): Promise<void> => {
  try {
    console.log('_ STARTUP');
    // printEnvVars();
    testAppConf();
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running on PORT: ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();

// Env variables:
// {
//   "AZURE_APPCONFIG_URI": "https://dp-fe-dev-appconfiguration.azconfig.io",
//   "CONTAINER_APP_HOSTNAME": "dp-fe-dev-containerapp--0v1r5bt.gentleground-23fcbdca.norwayeast.azurecontainerapps.io",
//   "npm_package_devDependencies_ts_node": "^10.9.1",
//   "npm_package_devDependencies__types_node": "^20.6.2",
//   "npm_package_dependencies_zod": "^3.22.2",
//   "KUBERNETES_SERVICE_PORT": "443",
//   "KUBERNETES_PORT": "tcp://100.100.128.1:443",
//   "npm_package_dependencies__azure_app_configuration": "^1.4.1",
//   "npm_config_version_commit_hooks": "true",
//   "npm_config_user_agent": "yarn/1.22.19 npm/? node/v20.8.0 linux x64",
//   "NODE_VERSION": "20.8.0",
//   "npm_config_bin_links": "true",
//   "HOSTNAME": "dp-fe-dev-containerapp--0v1r5bt-ffff687d5-gsw52",
//   "YARN_VERSION": "1.22.19",
//   "npm_node_execpath": "/usr/local/bin/node",
//   "npm_package_devDependencies_nodemon": "^3.0.1",
//   "npm_config_init_version": "1.0.0",
//   "IDENTITY_HEADER": "2ea9ff8a-10fa-4ccc-94ee-21949af0829f",
//   "npm_package_devDependencies__types_express": "^4.17.17",
//   "HOME": "/root",
//   "CONTAINER_APP_ENV_DNS_SUFFIX": "gentleground-23fcbdca.norwayeast.azurecontainerapps.io",
//   "npm_config_init_license": "MIT",
//   "YARN_WRAP_OUTPUT": "false",
//   "npm_config_version_tag_prefix": "v",
//   "npm_package_dependencies_swagger_ui_express": "^5.0.0",
//   "npm_package_dependencies_reflect_metadata": "^0.1.13",
//   "npm_package_dependencies_mysql2": "^3.6.1",
//   "npm_package_dependencies_dotenv": "^16.3.1",
//   "npm_package_devDependencies_typescript": "^5.2.2",
//   "npm_package_description": "",
//   "npm_package_scripts_dev": "concurrently \"npx tsc --watch\" \"nodemon --watch 'src/**/*.ts'\"",
//   "CONTAINER_APP_REPLICA_NAME": "dp-fe-dev-containerapp--0v1r5bt-ffff687d5-gsw52",
//   "CONTAINER_APP_REVISION": "dp-fe-dev-containerapp--0v1r5bt",
//   "npm_package_dependencies_express": "^4.18.2",
//   "npm_config_registry": "https://registry.yarnpkg.com",
//   "KUBERNETES_PORT_443_TCP_ADDR": "100.100.128.1",
//   "npm_package_scripts_start": "ts-node src/index.ts",
//   "npm_config_ignore_scripts": "",
//   "npm_config_version": "1.22.19",
//   "PATH": "/tmp/yarn--1697185974551-0.166849368154532:/app/node_modules/.bin:/usr/local/share/.config/yarn/link/node_modules/.bin:/usr/local/libexec/lib/node_modules/npm/bin/node-gyp-bin:/usr/local/lib/node_modules/npm/bin/node-gyp-bin:/usr/local/bin/node_modules/npm/bin/node-gyp-bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
//   "NODE": "/usr/local/bin/node",
//   "npm_package_dependencies_swagger_autogen": "^2.23.5",
//   "npm_package_name": "bff-node",
//   "KUBERNETES_PORT_443_TCP_PORT": "443",
//   "BICEP_TEST_ENV_VARIABLE": "This is a test",
//   "KUBERNETES_PORT_443_TCP_PROTO": "tcp",
//   "npm_package_dependencies_sequelize_typescript": "^2.1.5",
//   "MSI_ENDPOINT": "http://localhost:42356/msi/token",
//   "MSI_SECRET": "2ea9ff8a-10fa-4ccc-94ee-21949af0829f",
//   "npm_lifecycle_script": "ts-node src/index.ts",
//   "npm_package_scripts_dev2": "nodemon --watch 'src/**/*.ts' --exec 'tsc && node dist/app.js'",
//   "npm_package_main": "src/index.ts",
//   "npm_package_devDependencies_concurrently": "^8.2.1",
//   "npm_package_scripts_dev3": "nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/app.ts",
//   "npm_package_dependencies_sequelize": "^6.33.0",
//   "npm_config_version_git_message": "v%s",
//   "npm_lifecycle_event": "start",
//   "npm_package_version": "0.0.1",
//   "npm_config_argv": "{\"remain\":[],\"cooked\":[\"run\",\"start\"],\"original\":[\"start\"]}",
//   "npm_package_devDependencies_tslib": "^2.6.2",
//   "npm_package_scripts_build": "tsc",
//   "APPLICATIONINSIGHTS_CONNECTION_STRING": "InstrumentationKey=e003e37e-3f4e-4aab-b212-d8879adfbecb;IngestionEndpoint=https://norwayeast-0.in.applicationinsights.azure.com/;LiveEndpoint=https://norwayeast.livediagnostics.monitor.azure.com/",
//   "CONTAINER_APP_PORT": "80",
//   "npm_config_version_git_tag": "true",
//   "npm_config_version_git_sign": "",
//   "KUBERNETES_SERVICE_PORT_HTTPS": "443",
//   "KUBERNETES_PORT_443_TCP": "tcp://100.100.128.1:443",
//   "npm_package_license": "MIT",
//   "npm_config_strict_ssl": "true",
//   "CONTAINER_APP_NAME": "dp-fe-dev-containerapp",
//   "IDENTITY_ENDPOINT": "http://localhost:42356/msi/token",
//   "KUBERNETES_SERVICE_HOST": "100.100.128.1",
//   "PWD": "/app",
//   "npm_execpath": "/opt/yarn-v1.22.19/bin/yarn.js",
//   "DEPLOY_TIMESTAMP": "2023-10-05T10:29:10Z",
//   "npm_config_save_prefix": "^",
//   "npm_config_ignore_optional": "",
//   "INIT_CWD": "/app",
//   "npm_package_devDependencies__types_swagger_ui_express": "^4.1.3"
// }
