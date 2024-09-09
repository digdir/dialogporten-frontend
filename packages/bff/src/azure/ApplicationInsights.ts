import { useAzureMonitor } from '@azure/monitor-opentelemetry';
import { HttpInstrumentationConfig } from "@opentelemetry/instrumentation-http";
import config from '../config.ts';

const { applicationInsights } = config;

export const initialize = () => {
  const { connectionString } = applicationInsights;
  if (!connectionString) {
    const errorMsg =
      'Unable to initialize Application Insights Monitor: Application Insights enabled, but connection string is missing.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {

    // Filter using HTTP instrumentation configuration
    const httpInstrumentationConfig: HttpInstrumentationConfig = {
      enabled: true,
      ignoreIncomingRequestHook: (request: IncomingMessage) => {
          // Ignore OPTIONS incoming requests
          if (request.method === 'OPTIONS') {
              return true;
          }
          return false;
      },
      ignoreOutgoingRequestHook: (options: RequestOptions) => {
          // Ignore outgoing requests with /test path
          if (options.path === '/test') {
              return true;
          }
          return false;
      }
  };

    useAzureMonitor({
      azureMonitorExporterOptions: {
        connectionString,
      },
      instrumentationOptions: {
        // Custom HTTP Instrumentation Configuration
        http: httpInstrumentationConfig,
        azureSdk: { enabled: true },
        mongoDb: { enabled: true },
        mySql: { enabled: true },
        postgreSql: { enabled: true },
        redis: { enabled: true },
        redis4: { enabled: true },
    },
    });
  } catch (error) {
    console.error('Error initializing Application Insights:', error);
    throw error;
  }
};
