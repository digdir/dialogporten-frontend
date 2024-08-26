import * as appInsights from 'applicationinsights';
import config from '../config.ts';

const { applicationInsights } = config;

export const initialize = () => {
  const { connectionString } = applicationInsights;
  if (!connectionString) {
    const errorMsg =
      'Unable to initialize Application Insights: Application Insights enabled, but connection string is missing.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
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
      .start();
  } catch (error) {
    console.error('Error initializing Application Insights:', error);
    throw error;
  }
};
