import '../config/env';
import * as appInsights from 'applicationinsights';
import { bffVersion } from '..';
import { waitNSeconds } from './waitNSeconds';

export const initAppInsights = async () => {
  if (process.env.ENABLE_APP_INSIGHTS === 'true') {
    return new Promise((resolve, reject) => {
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
        .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
        .start();
      waitNSeconds(1);
      if (appInsights.defaultClient) {
        console.log(bffVersion, ': ', 'AppInsights initialized properly.');
      } else {
        console.error(bffVersion, ': ', 'AppInsights failed to initialize properly.');
      }
      resolve('Done');
    });
  }
};
