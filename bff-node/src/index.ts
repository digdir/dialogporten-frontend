import express, { Express } from 'express';
import bodyParser from 'body-parser';
import 'reflect-metadata';
// import swaggerUi from 'swagger-ui-express';
// import swaggerFile from './swagger_output.json';
import './config/env';
// import { DBConnection } from './config/database';
import path from 'path';
import { DefaultAzureCredential } from '@azure/identity';
import { AppConfigurationClient } from '@azure/app-configuration';
// import { setup, DistributedTracingModes , defaultClient} from 'applicationinsights';
import * as appInsights from 'applicationinsights';
import { SecretClient } from '@azure/keyvault-secrets';
import { DataSource, Repository } from 'typeorm';
import { Person } from './entities/Person';
import { Family } from './entities/Family';
console.log('_ ****** VERY BEGINNING OF CODE');

const DIST_DIR = path.join(__dirname, 'public');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

const initAppInsights = async () => {
  // Setup Application Insights:
  return new Promise(async (resolve, reject) => {
    if (!process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
      reject("No APPLICATIONINSIGHTS_CONNECTION_STRING found in env, can't initialize appInsights");
    appInsights
      .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true, true)
      .setUseDiskRetryCaching(true)
      .setSendLiveMetrics(false)
      // .setInternalLogging(true, true)
      .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
      .start();
    await waitNSeconds(5);
    if (appInsights.defaultClient) {
      console.log('_ AppInsights is initialized properly.');
    } else {
      console.log('_ AppInsights is not initialized properly.');
    }
    resolve('Done');
  });
};

export let mainDataSource: DataSource;
export let PersonRepository: Repository<Person> | undefined = undefined;
export let FamilyRepository: Repository<Family> | undefined = undefined;
// let postgresSettingsObject;
// let i = 0;
// do {
//   try {
//     const vaultName = process.env.KV_NAME;

//     if (!vaultName) {
//       throw new Error('No KV_NAME found');
//     }

//     try {
//       const credential = new DefaultAzureCredential();
//       const url = `https://${vaultName}.vault.azure.net`;
//       const kvClient = new SecretClient(url, credential);

//       const secretName = process.env.PSQL_CONNECTION_JSON_NAME;
//       if (!secretName) {
//         throw new Error('No PSQL_CONNECTION_JSON_NAME found');
//       }

//       const latestSecret = await kvClient.getSecret(secretName);
//       if (latestSecret.value) {
//         const postgresSettingsObject = JSON.parse(latestSecret.value);
//         const { host, password, dbname, port: dbport, sslmode, user } = postgresSettingsObject;
//         console.log(
//           `_ Saving values to env: host: ${host}, user: ${user}, password: ${password}, dbname: ${dbname}, port: ${dbport}, sslmode: ${sslmode}, `
//         );
//         process.env.DB_HOST = host;
//         process.env.DB_PORT = dbport;
//         process.env.DB_USER = user;
//         process.env.DB_PASSWORD = password;
//         process.env.DB_NAME = dbname;
//         process.env.DB_SSLMODE = sslmode;

//         resolve(postgresSettingsObject);
//       } else reject({ error: '_ Invalid postgresSettingsObject found' });
//     } catch (error) {
//       console.error('_getPsqlSettingsSecret: Vault error ');
//       reject({ error });
//     }
//   } catch (error) {
//     // console.error('_ DOWHILE ERROR on iteration no.: ', i);
//   }
//   await waitNSeconds(2);
//   i++;
// } while (!postgresSettingsObject);
// console.log(
//   '_ ***** Key vault set up finished on iteration no.: ',
//   i,
//   ' time taken: ',
//   i * 2,
//   ' seconds'
// );

export async function getPsqlSettingsSecret(debug = false) {
  return new Promise(async (resolve, reject) => {
    try {
      debug && console.log('_ _____ GETTING POSTGRES SETTINGS FROM KEY VAULT:');
      const vaultName = process.env.KV_NAME;

      if (!vaultName) {
        return reject({ error: 'No KV_NAME found' });
      }

      try {
        const credential = new DefaultAzureCredential();
        const url = `https://${vaultName}.vault.azure.net`;
        const kvClient = new SecretClient(url, credential);

        const secretName = process.env.PSQL_CONNECTION_JSON_NAME;
        if (!secretName) {
          return reject({ error: 'No PSQL_CONNECTION_JSON_NAME found' });
        }

        const latestSecret = await kvClient.getSecret(secretName);
        if (latestSecret.value) {
          debug && console.log(`_ Latest version of the secret ${secretName}: `, latestSecret);
          const postgresSettingsObject = JSON.parse(latestSecret.value);
          const { host, password, dbname, port: dbport, sslmode, user } = postgresSettingsObject;
          debug &&
            console.log(
              `_ Saving values to env: host: ${host}, user: ${user}, password: ${password}, dbname: ${dbname}, port: ${dbport}, sslmode: ${sslmode}, `
            );
          process.env.DB_HOST = host;
          process.env.DB_PORT = dbport;
          process.env.DB_USER = user;
          process.env.DB_PASSWORD = password;
          process.env.DB_NAME = dbname;
          process.env.DB_SSLMODE = sslmode;

          resolve(postgresSettingsObject);
        } else reject({ error: '_ Invalid postgresSettingsObject found' });
      } catch (error) {
        console.error('_getPsqlSettingsSecret: Vault error ');
        reject({ error });
      }
    } catch (error) {
      console.log('_ getPsqlSettingsSecret failed: ');
      process.exit(1);
    }
  });
}

function waitNSeconds(n: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000 * n);
  });
}

const getPGDetails = async () => {
  return new Promise(async (resolve, reject) => {
    let postgresSettingsObject;
    let i = 0;
    do {
      try {
        postgresSettingsObject = await getPsqlSettingsSecret();
      } catch (error) {
        // console.error('_ DOWHILE ERROR on iteration no.: ', i);
      }
      await waitNSeconds(2);
      i++;
    } while (!postgresSettingsObject);
    console.log(
      '_ ***** Key vault set up finished on iteration no.: ',
      i,
      ' time taken: ',
      i * 2,
      ' seconds'
    );
    resolve(postgresSettingsObject);
  });
};

const checkMigrationComplete = async () => {
  return new Promise(async (resolve, reject) => {
    let isSuccess;
    let i = 0;
    do {
      try {
        const migrationCompletedStatus = await getAppConfigValue(
          'Infrastructure:MigrationCompleted'
        );
        if (migrationCompletedStatus) isSuccess = true;
        if (migrationCompletedStatus === 'true') {
          console.log('_ checkMigrationComplete is resolving true');
          resolve(true);
        }
      } catch (error) {
        console.error('_ checkMigrationComplete DOWHILE ERROR on iteration no.: ', i, error);
      }
      i++;
      await waitNSeconds(10);
    } while (!isSuccess);

    console.log(
      '_ ***** checkMigrationComplete finished on iteration no.: ',
      i,
      ' time taken: ',
      i * 10,
      ' seconds'
    );
  });
};

const doMigration = async () => {
  let appInsightResult;
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
    do {
      try {
        console.log('_ doMigration: Starting initAppInsights()');
        const appInsightResult = await initAppInsights();
      } catch (error) {
        console.log('Error setting up appInsights: ', error);
      }
      await waitNSeconds(5);
    } while (!appInsightResult);

  console.log('_ Finished initAppInsights() with result: ', appInsightResult);

  let migrationStatusFetched = false;
  let migrationStatusValue;
  if (process.env.AZURE_APPCONFIG_URI)
    do {
      const migrationStatus = await getAppConfigValue('Infrastructure:MigrationCompleted');
      if (migrationStatus) {
        migrationStatusFetched = true;
        migrationStatusValue = migrationStatus;
        console.log('_ doMigration: migrationStatus: ', migrationStatus);
        if (migrationStatus === 'true') {
          console.log('_ doMigration: migrationStatus is already completed, exiting process');
          process.exit(0);
        }
      }
    } while (!migrationStatusFetched);

  if (migrationStatusValue === 'false') {
    console.log('_ doMigration: migrationStatus is NOT completed, starting migration:');
    try {
      const { exec } = await import('child_process');
      await new Promise((resolve, reject) => {
        const migrate = exec('yarn typeorm:run', (err) =>
          err ? reject(err) : resolve('Migration completed successfully')
        );

        // Forward stdout+stderr to this process
        migrate?.stdout?.pipe(process.stdout);
        migrate?.stdout?.pipe(process.stderr);
      });
    } catch (error) {
      console.error('_ doMigration: Migration run failed: ', error);
    }

    try {
      if (process.env.AZURE_APPCONFIG_URI) {
        console.log('_ Now trying to set migrationStatus to true');
        const result = await setAppConfigValue('Infrastructure:MigrationCompleted', 'true');
        console.log('_ result: ', result);
      }
    } catch (error) {
      console.error('_ doMigration: Migration setAppConfigValue failed: ', error);
    }
    console.log('_ ************* MIGRATION FINISHED, EXITING PROCESS *************');
    process.exit(0);
  }
};

if (process.env.IS_MIGRATION_JOB === 'true') {
  console.log("_ ************* MIGRATION JOB, DON'T START SERVER *************");
  doMigration();
}
console.log(
  '_ ************* process.env.IS_MIGRATION_JOB: ',
  process.env.IS_MIGRATION_JOB,
  process.env.IS_MIGRATION_JOB === 'true' ? 'true' : 'false'
);

// ******************************
// ************ MAIN ************
// ******************************

const start = async (): Promise<void> => {
  if (process.env.DEV_ENV === 'dev') console.log('Found DEV');
  else console.log('Found NOT DEV');
  console.log("process.env.DEV_ENV === 'dev': ", process.env.DEV_ENV);

  if (process.env.DEV_ENV !== 'dev')
    try {
      console.log('_ Starting initAppInsights()');
      const appInsightResult = await initAppInsights();
      console.log('_ Finished initAppInsights() with result: ', appInsightResult);
    } catch (error) {
      console.log('Error setting up appInsights: ', error);
    }

  let migrationCheckSuccess = false;
  do {
    try {
      const migrationCompleteStatus = await checkMigrationComplete();
      console.log('_ migrationCompleteStatus: ', migrationCompleteStatus);
      if (migrationCompleteStatus) migrationCheckSuccess = true;
    } catch (error) {
      console.log('_ checkMigrationComplete failed, retrying in 10 seconds...', error);
    }
    await waitNSeconds(10);
  } while (!migrationCheckSuccess);
  console.log('_ Migration completed, continueing...');
  process.env.DEV_ENV !== 'dev' && console.log('_ Starting getPgDetails');
  let pgDetails;
  if (process.env.DEV_ENV !== 'dev') pgDetails = await getPGDetails();
  process.env.DEV_ENV !== 'dev' && console.log('_ pgDetails:', pgDetails);

  console.log('_ Starting dataSource.initialize()');
  const { connectionOptions } = await import('./data-source');

  const dataSource = await new DataSource(connectionOptions).initialize();

  process.env.DEV_ENV === 'dev' && console.log('_ dataSource initialized! ');
  PersonRepository = dataSource.getRepository(Person);
  FamilyRepository = dataSource.getRepository(Family);
  const family = new Family();
  family.name = 'Etternavnsen';
  await FamilyRepository.save(family);
  const user = new Person();
  const d = new Date();
  user.name = 'Altinn Bruker';
  user.favoriteMovie = d.toLocaleString();
  user.age = 25;
  user.family = family;
  await PersonRepository.save(user);

  if (process.env.DEV_ENV !== 'dev')
    try {
      console.log('_ DB Setup done, entering main try/catch');
      // console.log('_ Starting initAppInsights()');
      // await initAppInsights();
      // console.log('_ Finished initAppInsights()');
      const personRepository = dataSource.getRepository(Person);

      console.log('_ Loading users from the database...');
      // const users = await personRepository.find();
      const users = await personRepository.find({
        relations: {
          family: true,
        },
      });
      console.log('_ Loaded persons: ', users);
    } catch (error) {
      console.log('_ Loaded error: ', error);
    }

  try {
    const { routes } = await import('./routes');

    const app: Express = express();
    const port = process.env.PORT || 80;

    app.use(express.static(DIST_DIR));
    app.get('/', (req, res) => {
      res.sendFile(HTML_FILE);
    });
    app.use(bodyParser.json());
    app.use('/api/v1', routes);
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running on PORT: ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();

async function testAppConf() {
  const d = new Date();
  try {
    const endpoint = process.env.AZURE_APPCONFIG_URI!;
    const credential = new DefaultAzureCredential();

    console.log('_ ________testAppConf Start _________');
    console.log('_ Time now: ', d);
    console.log('_ ________Connection endpoint: ' + endpoint);

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
    console.log('_ typeof vaultUri?.value: ', typeof vaultUri?.value);
  } catch (error) {
    console.log('_ testAppConf failed: ', error);
    process.exit(1);
  }
}

async function getAppConfigValue(key: string) {
  return new Promise(async (resolve, reject) => {
    const d = new Date();
    try {
      if (process.env.AZURE_APPCONFIG_URI) {
        const endpoint = process.env.AZURE_APPCONFIG_URI;
        const credential = new DefaultAzureCredential();

        console.log('_ Time now: ', d);
        console.log('_ ________Connection endpoint: ' + endpoint);

        const client = new AppConfigurationClient(
          endpoint, // ex: <https://<your appconfig resource>.azconfig.io>
          credential
        );
        let configValue = await client.getConfigurationSetting({
          key,
        });
        console.log('_ Trying to print key: ', key);
        console.log('_ ', key, ' value :', configValue?.value || 'No value found');
        resolve(configValue?.value);
      } else {
        // reject('_ No AZURE_APPCONFIG_URI found');
        console.log('_ No AZURE_APPCONFIG_URI found');
      }
    } catch (error) {
      console.log('_ getAppConfigValue failed: ', error);
    }
    await waitNSeconds(5);
  });
}

async function setAppConfigValue(key: string, value: string) {
  return new Promise(async (resolve, reject) => {
    let i = 0;
    const d = new Date();
    let isSuccess = false;
    try {
      do {
        const endpoint = process.env.AZURE_APPCONFIG_URI!;
        const credential = new DefaultAzureCredential();

        console.log('_ ******* setAppConfigValue Start, iteration number: ', i);
        console.log('_ Time now: ', d);
        console.log('_ ________Connection endpoint: ' + endpoint);

        const client = new AppConfigurationClient(
          endpoint, // ex: <https://<your appconfig resource>.azconfig.io>
          credential
        );
        console.log('_ Trying to set key: ', key, ' to value: ', value);
        const newSetting = await client.setConfigurationSetting({
          key,
          value,
        });
        console.log('_ Created config, response: ', newSetting);
        // console.log('_ typeof vaultUri?.value: ', typeof vaultUri?.value);
        if (newSetting) isSuccess = true;
        await waitNSeconds(2);
      } while (!isSuccess);
    } catch (error) {
      console.log('_ setAppConfigValue failed: ', error);
      process.exit(1);
    }
    resolve(true);
  });
}

export async function testKeyVault() {
  const d = new Date();
  try {
    console.log('_ _____ TESTING KEY VAULT:');
    const vaultName = process.env.KV_NAME;
    const credential = new DefaultAzureCredential();

    if (vaultName) {
      try {
        const url = `https://${vaultName}.vault.azure.net`;
        // console.log('_ Vault url: ', url);

        const kvClient = new SecretClient(url, credential);

        const secretName = process.env.PSQL_CONNECTION_JSON_NAME;
        if (!secretName) return { error: 'No PSQL_CONNECTION_JSON_NAME found' };
        const latestSecret = await kvClient.getSecret(secretName);
        // console.log(`_ Latest version of the secret ${secretName}: `, latestSecret);
        const specificSecret = await kvClient.getSecret(secretName, {
          version: latestSecret.properties.version!,
        });
        console.log(
          `_ The secret ${secretName} at the version ${latestSecret.properties.version!}: `,
          specificSecret
        );
        return {
          [secretName]: latestSecret,
          [secretName + 'Parsed']: JSON.parse(latestSecret.value || '{}'),
          vaultName,
          url,
          secretName,
        };
      } catch (error) {
        console.error('_ Vault error: ', error);
        return { error };
      }
    }
  } catch (error) {
    console.log('_ testAppConf failed: ', error);
    process.exit(1);
  }
}

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
