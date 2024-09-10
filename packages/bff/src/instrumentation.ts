import { useAzureMonitor } from '@azure/monitor-opentelemetry';
import { metrics, trace } from '@opentelemetry/api';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { logger } from '@digdir/dialogporten-node-logger';
import { Resource } from '@opentelemetry/resources';
// SEMRESATTRS_SERVICE_INSTANCE_ID is deprecaed, but the replacement ATTR_SERVICE_INSTANCE_ID is not available in the semantic-conventions package
import { ATTR_SERVICE_NAME, SEMRESATTRS_SERVICE_INSTANCE_ID } from '@opentelemetry/semantic-conventions';
import config from './config.ts';

const { applicationInsights } = config;

const initializeApplicationInsights = () => {
  if (!applicationInsights.connectionString) {
    const errorMsg =
      'Unable to initialize Application Insights: Application Insights enabled, but connection string is missing.';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const customResource = new Resource({
      [ATTR_SERVICE_NAME]: config.info.name,
      [SEMRESATTRS_SERVICE_INSTANCE_ID]: config.info.instanceId,
    });

    const instrumentations = [
      new HttpInstrumentation(),
      new FastifyInstrumentation(),
      new GraphQLInstrumentation(),
      new IORedisInstrumentation(),
    ];

    registerInstrumentations({
      tracerProvider: trace.getTracerProvider(),
      meterProvider: metrics.getMeterProvider(),
      instrumentations: instrumentations,
    });

    useAzureMonitor({
      resource: customResource,
      azureMonitorExporterOptions: {
        connectionString: applicationInsights.connectionString,
      },
      instrumentationOptions: {
        http: { enabled: true },
        azureSdk: { enabled: true },
        postgreSql: { enabled: true },
      },
    });

    logger.info('Application Insights initialized');
  } catch (error) {
    logger.error('Error initializing Application Insights:', error);
    throw error;
  }
};

if (applicationInsights.enabled) {
  initializeApplicationInsights();
}
