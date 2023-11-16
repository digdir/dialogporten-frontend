import 'reflect-metadata';
import '../config/env';
import { DefaultAzureCredential } from '@azure/identity';
import { AppConfigurationClient } from '@azure/app-configuration';
import * as appInsights from 'applicationinsights';
import { bffVersion } from '..';

const debug = true;

export const initAppInsights = async () => {
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
    await waitNSeconds(1);
    if (appInsights.defaultClient) {
      debug && console.log(bffVersion, ': ', 'AppInsights is initialized properly.');
    } else {
      debug && console.log(bffVersion, ': ', 'AppInsights is not initialized properly.');
    }
    resolve('Done');
  });
};

export async function getPsqlSettingsSecret() {
  return new Promise(async (resolve, reject) => {
    try {
      debug && console.log(bffVersion, ': ', '_____ GETTING POSTGRES SETTINGS FROM KEY VAULT:');
      const vaultName = process.env.KV_NAME;

      if (!vaultName) {
        return reject({ error: 'No KV_NAME found' });
      }
      const pgJson = JSON.parse(process.env.Infrastructure__DialogDbConnectionString!);

      if (pgJson?.host) resolve(pgJson);
      else reject({ error: 'No pgJson found' });
    } catch (error) {
      debug && console.log(bffVersion, ': ', 'getPsqlSettingsSecret failed: ');
      process.exit(1);
    }
  });
}

export const getPGDetails = async () => {
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

export const checkMigrationComplete = async () => {
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
          debug && console.log(bffVersion, ': ', 'checkMigrationComplete is resolving true');
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

export async function getAppConfigValue(key: string) {
  return new Promise(async (resolve, reject) => {
    const d = new Date();
    try {
      if (process.env.AZURE_APPCONFIG_URI) {
        const endpoint = process.env.AZURE_APPCONFIG_URI;
        const credential = new DefaultAzureCredential();

        debug && console.log(bffVersion, ': ', '________Connection endpoint: ' + endpoint);

        const client = new AppConfigurationClient(
          endpoint, // ex: <https://<your appconfig resource>.azconfig.io>
          credential
        );
        let configValue = await client.getConfigurationSetting({
          key,
        });
        debug && console.log(bffVersion, ': ', 'Trying to print key: ', key);
        debug &&
          console.log(
            bffVersion,
            ': ',
            '',
            key,
            ' value :',
            configValue?.value || 'No value found'
          );
        resolve(configValue?.value);
      } else {
        // reject('No AZURE_APPCONFIG_URI found');
        console.log(bffVersion, ': ', 'No AZURE_APPCONFIG_URI found');
      }
    } catch (error) {
      console.log(bffVersion, ': ', 'getAppConfigValue failed: ', error);
    }
    await waitNSeconds(10);
  });
}

export async function setAppConfigValue(key: string, value: string) {
  return new Promise(async (resolve, reject) => {
    let i = 0;
    const d = new Date();
    let isSuccess = false;
    try {
      do {
        const endpoint = process.env.AZURE_APPCONFIG_URI!;
        const credential = new DefaultAzureCredential();

        debug &&
          console.log(bffVersion, ': ', '******* setAppConfigValue Start, iteration number: ', i);
        debug && console.log(bffVersion, ': ', 'Time now: ', d);
        debug && console.log(bffVersion, ': ', '________Connection endpoint: ' + endpoint);

        const client = new AppConfigurationClient(
          endpoint, // ex: <https://<your appconfig resource>.azconfig.io>
          credential
        );
        debug && console.log(bffVersion, ': ', 'Trying to set key: ', key, ' to value: ', value);
        const newSetting = await client.setConfigurationSetting({
          key,
          value,
        });
        debug && console.log(bffVersion, ': ', 'Created config, response: ', newSetting);
        // console.log(bffVersion, ': ','typeof vaultUri?.value: ', typeof vaultUri?.value);
        if (newSetting) isSuccess = true;
        await waitNSeconds(2);
      } while (!isSuccess);
    } catch (error) {
      console.log(bffVersion, ': ', 'setAppConfigValue failed: ', error);
      process.exit(0);
    }
    resolve(true);
  });
}

export function waitNSeconds(n: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000 * n);
  });
}
