import * as appInsights from 'applicationinsights';
import config from '../config.ts';

const { applicationInsights } = config;

export const intitialize = () => {
  const { connectionString } = applicationInsights;
  if (!connectionString) {
    console.error('Application Insights enabled, but connection string is missing.');
    throw new Error('Unable to initialize Application Insights: Connection string not provided.');
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
    throw new Error('Failed to initialize Application Insights');
  }
};
