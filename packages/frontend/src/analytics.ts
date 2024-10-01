import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import type { ITelemetryPlugin } from '@microsoft/applicationinsights-web';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { config } from './config';

let applicationInsights: ApplicationInsights | null = null;

if (config.applicationInsightsInstrumentationKey) {
  if (!import.meta.env.PROD) {
    console.warn(
      'ApplicationInsightsInstrumentationKey is defined but not enabled in non-production builds. Tracking is disabled.',
    );
  } else {
    const reactPlugin = new ReactPlugin();
    try {
      applicationInsights = new ApplicationInsights({
        config: {
          instrumentationKey: config.applicationInsightsInstrumentationKey,
          extensions: [reactPlugin as ITelemetryPlugin],
          enableAutoRouteTracking: true,
        },
      });
      applicationInsights.loadAppInsights();
      console.log('Application Insights initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Application Insights:', error);
      applicationInsights = null;
    }
  }
} else {
  console.warn('ApplicationInsightsInstrumentationKey is undefined. Tracking is disabled.');
}

const noop = () => {};

export const Analytics = {
  trackPageView: applicationInsights?.trackPageView.bind(applicationInsights) || noop,
  trackEvent: applicationInsights?.trackEvent.bind(applicationInsights) || noop,
  trackException: applicationInsights?.trackException.bind(applicationInsights) || noop,
};
