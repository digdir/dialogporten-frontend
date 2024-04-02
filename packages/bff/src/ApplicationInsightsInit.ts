import * as appInsights from 'applicationinsights';

function waitNSeconds(n = 1): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000 * n);
  });
}

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

  await waitNSeconds(1);

  if (appInsights.defaultClient) {
    console.log('AppInsights initialized properly.');
    return true;
  } else {
    console.error('AppInsights failed to initialize properly.');
    return false;
  }
};
