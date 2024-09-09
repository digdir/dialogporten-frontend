import { useAzureMonitor } from '@azure/monitor-opentelemetry';
import { Resource } from '@opentelemetry/resources';
// SEMRESATTRS_SERVICE_INSTANCE_ID is deprecaed, but the replacement ATTR_SERVICE_INSTANCE_ID is not available in the semantic-conventions package
import { ATTR_SERVICE_NAME, SEMRESATTRS_SERVICE_INSTANCE_ID } from '@opentelemetry/semantic-conventions';
import config from '../config.ts';

export const initialize = () => {
  const { applicationInsights } = config;
  const { connectionString } = applicationInsights;

  if (!connectionString) {
    const errorMsg =
      'Unable to initialize Application Insights Monitor: Application Insights enabled, but connection string is missing.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const customResource = new Resource({
      [ATTR_SERVICE_NAME]: config.info.name,
      [SEMRESATTRS_SERVICE_INSTANCE_ID]: config.info.instanceId,
    });

    useAzureMonitor({
      resource: customResource,
      azureMonitorExporterOptions: {
        connectionString,
      },
      instrumentationOptions: {
        http: { enabled: true },
        azureSdk: { enabled: true },
        postgreSql: { enabled: true },
        redis: { enabled: true },
      },
    });
  } catch (error) {
    console.error('Error initializing Application Insights:', error);
    throw error;
  }
};
