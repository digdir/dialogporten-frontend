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
import util from 'util';
import { SlowBuffer } from 'buffer';

console.log('****** VERY BEGINNING OF CODE');

const DIST_DIR = path.join(__dirname, 'public');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

console.log('isLocal: ', process.env.IS_LOCAL);
const isLocal = process.env.IS_LOCAL === 'true';

if (isLocal) console.log('****** FOUND LOCAL');
else console.log("Didn't find local:", process.env.IS_LOCAL);
const debug = false;

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
      debug && console.log('AppInsights is initialized properly.');
    } else {
      debug && console.log('AppInsights is not initialized properly.');
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
//       } else reject({ error: 'Invalid postgresSettingsObject found' });
//     } catch (error) {
//       console.error('_getPsqlSettingsSecret: Vault error ');
//       reject({ error });
//     }
//   } catch (error) {
//     // console.error('DOWHILE ERROR on iteration no.: ', i);
//   }
//   await waitNSeconds(2);
//   i++;
// } while (!postgresSettingsObject);
// console.log(
//   '***** Key vault set up finished on iteration no.: ',
//   i,
//   ' time taken: ',
//   i * 2,
//   ' seconds'
// );

export async function getPsqlSettingsSecret() {
  return new Promise(async (resolve, reject) => {
    try {
      debug && console.log('_____ GETTING POSTGRES SETTINGS FROM KEY VAULT:');
      const vaultName = process.env.KV_NAME;

      if (!vaultName) {
        return reject({ error: 'No KV_NAME found' });
      }
      const pgJson = JSON.parse(process.env.Infrastructure__DialogDbConnectionString!);

      if (pgJson?.host) resolve(pgJson);
      else reject({ error: 'No pgJson found' });
    } catch (error) {
      debug && console.log('getPsqlSettingsSecret failed: ');
      process.exit(1);
    }
  });
}
// export async function getPsqlSettingsSecretOld() {
//   return new Promise(async (resolve, reject) => {
//     try {
//       debug && console.log('_____ GETTING POSTGRES SETTINGS FROM KEY VAULT:');
//       const vaultName = process.env.KV_NAME;

//       if (!vaultName) {
//         return reject({ error: 'No KV_NAME found' });
//       }

//       try {
//         const credential = new DefaultAzureCredential();
//         const url = `https://${vaultName}.vault.azure.net`;
//         const kvClient = new SecretClient(url, credential);

//         const secretName = process.env.Infrastructure__DialogDbConnectionString;
//         if (!secretName) {
//           return reject({ error: 'No Infrastructure__DialogDbConnectionString found' });
//         }

//         const latestSecret = await kvClient.getSecret(secretName);
//         if (latestSecret.value) {
//           debug && console.log(`_ Latest version of the secret ${secretName}: `, latestSecret);
//           const postgresSettingsObject = JSON.parse(latestSecret.value);
//           const { host, password, dbname, port: dbport, sslmode, user } = postgresSettingsObject;
//           debug &&
//             console.log(
//               `_ Saving values to env: host: ${host}, user: ${user}, password: ${password}, dbname: ${dbname}, port: ${dbport}, sslmode: ${sslmode}, `
//             );
//              process.env.DB_HOST = host;
//             process.env.DB_PORT = dbport;
//              process.env.DB_USER = user;
//              process.env.DB_PASSWORD = password;
//              process.env.DB_NAME = dbname;
//              process.env.DB_SSLMODE = sslmode;
//             debug && console.log('getPsqlSettingsSecret SUCESS!!!!!!!! ');

//           resolve(postgresSettingsObject);
//         } else reject({ error: 'Invalid postgresSettingsObject found' });
//       } catch (error) {
//         debug && console.error('_getPsqlSettingsSecret: Vault error ', error);
//         reject({ error });
//       }
//     } catch (error) {
//       debug && console.log('getPsqlSettingsSecret failed: ');
//       process.exit(1);
//     }
//   });
// }

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
        console.error('DOWHILE ERROR on iteration no.: ', i, ' error: ', error);
      }
      await waitNSeconds(2);
      i++;
    } while (!postgresSettingsObject);
    debug &&
      console.log(
        '***** Key vault set up finished on iteration no.: ',
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
          debug && console.log('checkMigrationComplete is resolving true');
          resolve(true);
        }
      } catch (error) {
        debug && console.error('checkMigrationComplete DOWHILE ERROR on iteration no.: ', i, error);
      }
      i++;
      await waitNSeconds(10);
    } while (!isSuccess);

    debug &&
      console.log(
        '***** checkMigrationComplete finished on iteration no.: ',
        i,
        ' time taken: ',
        i * 10,
        ' seconds'
      );
  });
};

const execMigration = async () => {
  const { exec } = await import('child_process');
  const execAsync = util.promisify(exec);

  // try {
  //   const { stdout, stderr } = await execAsync('yarn typeorm:run');
  //   console.log('Command output:');
  //   console.log('stdout:', stdout);
  //   console.error('stderr:', stderr);
  //   console.log('Migration completed successfully');
  // } catch (error) {
  //   console.error('Error running the command:', error);
  // }

  try {
    const { stdout, stderr } = await execAsync('yarn typeorm migration:run');

    if (stdout) {
      console.log('Standard Output:', stdout);
    }

    if (stderr) {
      console.error('Standard Error:', stderr);
    }

    if (stderr) {
      // if (stdout || stderr) {
      console.error('Migration failed');
      return false;
    } else {
      console.log('Migration completed successfully');
      return true;
    }
  } catch (error) {
    console.error('Error running the command:', error);
    return false;
  }
};

const doMigration = async () => {
  // ************ INIT APP INSIGHTS ************
  let appInsightSetupComplete = false;
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING && !isLocal)
    do {
      try {
        debug && console.log('doMigration: Starting initAppInsights()');
        const appInsightResult = await initAppInsights();
        if (appInsightResult === 'Done') appInsightSetupComplete = true;
      } catch (error) {
        debug && console.log('Migration: Error setting up appInsights: ', error);
      }
      await waitNSeconds(5);
    } while (!appInsightSetupComplete);
  console.log('************* MIGRATION doMigration v 1.1 *************');
  debug && console.log('************* Printing ENV VARS *************', process.env);

  let pgJson;
  if (process.env.Infrastructure__DialogDbConnectionString && !isLocal)
    do {
      try {
        debug && console.log('BFF: Starting dbConnectionStringOK()');
        pgJson = JSON.parse(process.env.Infrastructure__DialogDbConnectionString!);
      } catch (error) {
        debug && console.log('BFF: Error reading dbConnectionStringOK: ', error);
      }
      await waitNSeconds(5);
    } while (!pgJson?.host);
  process.env.DB_HOST = pgJson?.host;
  process.env.DB_USER = pgJson?.user;
  process.env.DB_PORT = pgJson?.port;
  process.env.DB_PASSWORD = pgJson?.password;
  process.env.DB_NAME = pgJson?.dbname;

  debug && console.log('BFF: pgJson: SUCESS!!!!:', pgJson);
  console.log('BFF: Connecting to DB with credentials:', pgJson);

  // process.env.DEV_ENV !== 'dev' && console.log('Migration: Starting getPgDetails');
  // let pgDetails;
  // if (process.env.DEV_ENV !== 'dev') pgDetails = await getPGDetails();
  // process.env.DEV_ENV !== 'dev' && console.log('Migration: pgDetails:', pgDetails);

  // const vaultName = process.env.KV_NAME;
  // console.log(
  //   '************* Infrastructure__DialogDbConnectionString test *************',
  //   process.env.Infrastructure__DialogDbConnectionString
  // );
  // console.log('************* adoconnectionstringsecreturi test *************');

  // if (vaultName) {
  //   console.log('************* adoconnectionstringsecreturi test inside IF *************');
  //   const credential = new DefaultAzureCredential();
  //   const url = `https://${vaultName}.vault.azure.net`;
  //   const kvClient = new SecretClient(url, credential);
  //   kvClient
  //     .getSecret('adoconnectionstringsecreturi')
  //     .then((data) => {
  //       console.log('adoconnectionstringsecreturi secret value: ', data.value);
  //     })
  //     .catch((error) => {
  //       console.log("getSecret('adoconnectionstringsecreturi')", error);
  //     });
  // }

  let migrationStatusFetched = false;
  let migrationStatusValue;

  debug && console.log('Migration: ************ READ APP CONFIG ************');
  // ************ READ APP CONFIG ************

  if (process.env.AZURE_APPCONFIG_URI && !isLocal)
    do {
      // const migrationStatus = await getAppConfigValue('Infrastructure:MigrationCompleted');
      try {
        if (process.env.AZURE_APPCONFIG_URI) {
          const endpoint = process.env.AZURE_APPCONFIG_URI;
          const credential = new DefaultAzureCredential();

          // console.log('Time now: ', d);
          // console.log('________Connection endpoint: ' + endpoint);
          const key = 'Infrastructure:MigrationCompleted';
          const client = new AppConfigurationClient(
            endpoint, // ex: <https://<your appconfig resource>.azconfig.io>
            credential
          );
          let configValue = await client.getConfigurationSetting({
            key,
          });
          debug && console.log('Migration: Trying to print key: ', key);
          debug &&
            console.log('Migration: ', key, ' value :', configValue?.value || 'No value found');
          if (configValue?.value) {
            migrationStatusValue = configValue?.value;
            migrationStatusFetched = true;
          }
        } else {
          console.log('Migration: No AZURE_APPCONFIG_URI found');
        }
      } catch (error) {
        console.log('Migration: getAppConfigValue failed: ', error);
      }
      await waitNSeconds(5);
    } while (!migrationStatusFetched);
  if (isLocal) migrationStatusValue = 'false';

  // ************ RUN MIGRATION ************
  debug && console.log('Migration: ************ RUN MIGRATION ************');

  let migrationsuccessful = false;
  if (migrationStatusValue === 'true') {
    console.log('MIGRATION: Already completed migration. Exiting process.');
    process.exit(0);
  } else if (migrationStatusValue === 'false') {
    console.log('MIGRATION: Migration is needed, starting migration:');

    debug && console.log('doMigration: process.env.DB_HOST: ', process.env.DB_HOST);
    debug && console.log('doMigration: process.env.DB_USER: ', process.env.DB_USER);
    debug && console.log('doMigration: process.env.DB_PORT: ', process.env.DB_PORT);
    debug && console.log('doMigration: process.env.DB_PASSWORD: ', process.env.DB_PASSWORD);
    debug && console.log('doMigration: process.env.DB_NAME: ', process.env.DB_NAME);

    try {
      migrationsuccessful = await execMigration();

      // await new Promise((resolve, reject) => {
      //   const migrate = exec('yarn typeorm:run', (err) =>
      //     err ? reject(err) : resolve('Migration completed successfuly')
      //   );
      //   migrate?.stdout?.on('data', (data) => {
      //     console.log(`stdout: ${data}`);
      //   });

      //   migrate?.stdout?.on('data', (data) => {
      //     console.error(`stderr: ${data}`);
      //   });

      //   migrate.on('close', (code) => {
      //     if (code === 0) {
      //       console.log('Migration: Migration completed successfuly');
      //       migrationsuccessful = true;
      //     } else {
      //       console.error(`Migration: Migration failed with code ${code}`);
      //     }
      //   });
      // Forward stdout+stderr to this process
      // migrate?.stdout?.pipe(process.stdout);
      // migrate?.stdout?.pipe(process.stderr);
      // });
    } catch (error) {
      console.error('doMigration: Migration run failed: ', error);
      migrationsuccessful = false;
    }

    if (migrationsuccessful) {
      console.log('Migration successful, setting migrationStatus to true');
      try {
        if (process.env.AZURE_APPCONFIG_URI && !isLocal) {
          debug && console.log('Migration: WOULD Now trying to set migrationStatus to true');
          const result = await setAppConfigValue('Infrastructure:MigrationCompleted', 'true');
          debug && console.log('Migration: result: ', result);
        }
      } catch (error) {
        console.error('doMigration: Migration setAppConfigValue failed: ', error);
      }
    } else
      console.log(
        'Migration not successful, not setting migrationStatus to true: migrationsuccessful: ',
        migrationsuccessful
      );
  } else {
    console.log(
      "Migration: Something must have gone wrong fetching migrationStatusValue, it's: ",
      migrationStatusValue
    );
    console.log('************* MIGRATION FINISHED, EXITING PROCESS *************');
    process.exit(1);
  }
};

// ******************************
// ************ MAIN ************
// ******************************

const start = async (): Promise<void> => {
  if (process.env.DEV_ENV !== 'dev')
    try {
      debug && console.log('BFF: Starting initAppInsights()');
      const appInsightResult = await initAppInsights();
      debug && console.log('BFF: Finished initAppInsights() with result: ', appInsightResult);
    } catch (error) {
      console.log('BFF: Error setting up appInsights: ', error);
    }
  console.log('BFF: ************* NODE BFF v 1.1 STARTING *************');
  let nMigrationChecks = 0;
  let migrationCheckSuccess = false;
  do {
    try {
      const migrationCompleteStatus = await checkMigrationComplete();
      debug && console.log('BFF: migrationCompleteStatus: ', migrationCompleteStatus);
      if (migrationCompleteStatus) migrationCheckSuccess = true;
    } catch (error) {
      console.log('BFF: checkMigrationComplete failed, retrying in 10 seconds...', error);
    }
    await waitNSeconds(1);
    console.log('BFF: Waiting for migration to complete: ', nMigrationChecks, ' seconds');
  } while (!migrationCheckSuccess);
  console.log('BFF: Checked AppConfig and found Migration completed.');
  // let pgDetails;
  // if (process.env.DEV_ENV !== 'dev') pgDetails = await getPGDetails();

  let pgJson;
  if (process.env.Infrastructure__DialogDbConnectionString && !isLocal)
    do {
      try {
        debug && console.log('doMigration: Starting dbConnectionStringOK()');
        pgJson = JSON.parse(process.env.Infrastructure__DialogDbConnectionString!);
      } catch (error) {
        debug && console.log('Migration: Error reading dbConnectionStringOK: ', error);
      }
      await waitNSeconds(5);
    } while (!pgJson?.host);
  process.env.DB_HOST = pgJson?.host;
  process.env.DB_USER = pgJson?.user;
  process.env.DB_PORT = pgJson?.port;
  process.env.DB_PASSWORD = pgJson?.password;
  process.env.DB_NAME = pgJson?.dbname;

  debug && console.log('BFF: Starting dataSource.initialize()');
  const { connectionOptions } = await import('./data-source');

  const dataSource = await new DataSource(connectionOptions).initialize();

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

  if (debug && process.env.DEV_ENV !== 'dev')
    try {
      console.log('BFF: DB Setup done, entering main try/catch');
      // console.log('Starting initAppInsights()');
      // await initAppInsights();
      // console.log('Finished initAppInsights()');
      const personRepository = dataSource.getRepository(Person);

      console.log('BFF: Loading users from the database...');
      // const users = await personRepository.find();
      const users = await personRepository.find({
        relations: {
          family: true,
        },
      });
      console.log('BFF: Loaded persons: ', users);
    } catch (error) {
      console.log('BFF: Loaded error: ', error);
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
      console.log(`BFF: ⚡️[server]: Server is running on PORT: ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// async function testAppConf() {
//   const d = new Date();
//   try {
//     const endpoint = process.env.AZURE_APPCONFIG_URI!;
//     const credential = new DefaultAzureCredential();

//     console.log('________testAppConf Start _________');
//     console.log('Time now: ', d);
//     console.log('________Connection endpoint: ' + endpoint);

//     const client = new AppConfigurationClient(
//       endpoint, // ex: <https://<your appconfig resource>.azconfig.io>
//       credential
//     );
//     // const client = new AppConfigurationClient(connectionString!);
//     let test = await client.getConfigurationSetting({
//       key: 'test',
//       // key: 'Infrastructure:DialogDbConnectionString',
//     });
//     let vaultUri = await client.getConfigurationSetting({
//       key: 'Infrastructure:DialogDbConnectionString',
//     });
//     console.log('Trying to print test:');
//     console.log(test);
//     console.log('Trying to print Infrastructure:DialogDbConnectionString:');
//     console.log(vaultUri);
//     console.log('Infrastructure:DialogDbConnectionString value :');
//     console.log(vaultUri?.value || 'No value found');
//     console.log('typeof vaultUri?.value: ', typeof vaultUri?.value);
//   } catch (error) {
//     console.log('testAppConf failed: ', error);
//     process.exit(1);
//   }
// }

async function getAppConfigValue(key: string) {
  return new Promise(async (resolve, reject) => {
    const d = new Date();
    try {
      if (process.env.AZURE_APPCONFIG_URI) {
        const endpoint = process.env.AZURE_APPCONFIG_URI;
        const credential = new DefaultAzureCredential();

        debug && console.log('Time now: ', d);
        debug && console.log('________Connection endpoint: ' + endpoint);

        const client = new AppConfigurationClient(
          endpoint, // ex: <https://<your appconfig resource>.azconfig.io>
          credential
        );
        let configValue = await client.getConfigurationSetting({
          key,
        });
        debug && console.log('Trying to print key: ', key);
        debug && console.log('', key, ' value :', configValue?.value || 'No value found');
        resolve(configValue?.value);
      } else {
        // reject('No AZURE_APPCONFIG_URI found');
        console.log('No AZURE_APPCONFIG_URI found');
      }
    } catch (error) {
      console.log('getAppConfigValue failed: ', error);
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

        debug && console.log('******* setAppConfigValue Start, iteration number: ', i);
        debug && console.log('Time now: ', d);
        debug && console.log('________Connection endpoint: ' + endpoint);

        const client = new AppConfigurationClient(
          endpoint, // ex: <https://<your appconfig resource>.azconfig.io>
          credential
        );
        debug && console.log('Trying to set key: ', key, ' to value: ', value);
        const newSetting = await client.setConfigurationSetting({
          key,
          value,
        });
        debug && console.log('Created config, response: ', newSetting);
        // console.log('typeof vaultUri?.value: ', typeof vaultUri?.value);
        if (newSetting) isSuccess = true;
        await waitNSeconds(2);
      } while (!isSuccess);
    } catch (error) {
      console.log('setAppConfigValue failed: ', error);
      process.exit(0);
    }
    resolve(true);
  });
}

// export async function testKeyVault() {
//   const d = new Date();
//   try {
//     console.log('_____ TESTING KEY VAULT:');
//     const vaultName = process.env.KV_NAME;
//     const credential = new DefaultAzureCredential();

//     if (vaultName) {
//       try {
//         const url = `https://${vaultName}.vault.azure.net`;
//         // console.log('Vault url: ', url);

//         const kvClient = new SecretClient(url, credential);

//         const secretName = process.env.PSQL_CONNECTION_JSON_NAME;
//         if (!secretName) return { error: 'No PSQL_CONNECTION_JSON_NAME found' };
//         const latestSecret = await kvClient.getSecret(secretName);
//         // console.log(`_ Latest version of the secret ${secretName}: `, latestSecret);
//         const specificSecret = await kvClient.getSecret(secretName, {
//           version: latestSecret.properties.version!,
//         });
//         console.log(
//           `_ The secret ${secretName} at the version ${latestSecret.properties.version!}: `,
//           specificSecret
//         );
//         return {
//           [secretName]: latestSecret,
//           [secretName + 'Parsed']: JSON.parse(latestSecret.value || '{}'),
//           vaultName,
//           url,
//           secretName,
//         };
//       } catch (error) {
//         console.error('Vault error: ', error);
//         return { error };
//       }
//     }
//   } catch (error) {
//     console.log('testAppConf failed: ', error);
//     process.exit(0);
//   }
// }

if (isLocal) process.exit(0);
else if (process.env.IS_MIGRATION_JOB === 'true') {
  console.log("_ ************* MIGRATION JOB, DON'T START SERVER *************");
  doMigration();
} else void start();
