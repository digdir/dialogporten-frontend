import { setTimeout } from 'node:timers/promises';
import * as appInsights from 'applicationinsights';

export const initAppInsights = async (connectionString: string) => {
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

  await setTimeout(1000);

  if (appInsights.defaultClient) {
    console.log('AppInsights initialized properly.');
    return true;
  }
  console.error('AppInsights failed to initialize properly.');
  return false;
};

export const initAppInsightWithRetry = async (connectionString: string, retryTimes: number) => {
  for (let i = 0; i <= retryTimes; i++) {
    try {
      await initAppInsights(connectionString);
      return;
    } catch (error) {
      console.error(`Error setting up appInsights (retried ${i} time${i > 0 ? 's' : ''}: `, error);
    }
    await setTimeout((1 + i * 5) * 1000); // Increased waiting time for each retry (1s, 6s, 11s, etc)
  }

  throw new Error(`AppInsight initialization failed after ${retryTimes} retries`);
};
