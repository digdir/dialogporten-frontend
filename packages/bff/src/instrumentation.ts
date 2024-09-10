import { useAzureMonitor } from '@azure/monitor-opentelemetry';
import { logger } from '@digdir/dialogporten-node-logger';
import { type ProxyTracerProvider, metrics, trace } from '@opentelemetry/api';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis';
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

    // register the azure monitor exporter
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

    // register additional instrumentations that are not included in the azure monitor exporter
    const instrumentations = [
      new HttpInstrumentation(),
      new FastifyInstrumentation(),
      new GraphQLInstrumentation(),
      new IORedisInstrumentation(),
    ];

    const tracerProvider = (trace.getTracerProvider() as ProxyTracerProvider).getDelegate();
    const meterProvider = metrics.getMeterProvider();

    registerInstrumentations({
      tracerProvider: tracerProvider,
      meterProvider: meterProvider,
      instrumentations: instrumentations,
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
