import * as appInsights from 'applicationinsights';
import config from './config';
import logger from './logger';

function waitNSeconds(n = 1): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000 * n);
  });
}

const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

export const initAppInsights = async () => {
  return new Promise((resolve, reject) => {
    if (!connectionString) {
      reject("No APPLICATIONINSIGHTS_CONNECTION_STRING found in env, can't initialize appInsights");
    }

    appInsights
      .setup(connectionString)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true, true)
      .setUseDiskRetryCaching(true)
      .setSendLiveMetrics(false)
      .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
      .start();

    waitNSeconds(1)
      .then(() => {
        if (appInsights.defaultClient) {
          logger.info(config.version, ': ', 'AppInsights initialized properly.');
        } else {
          logger.error(config.version, ': ', 'AppInsights failed to initialize properly.');
        }
        resolve('Done');
      })
      .catch(reject);
  });
};
