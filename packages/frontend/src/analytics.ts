import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import type { ITelemetryPlugin } from '@microsoft/applicationinsights-web';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { config } from './config';

let applicationInsights: ApplicationInsights | null = null;

// Application Insights expects a GUID format for the instrumentation key
function isValidInstrumentationKey(key: string): boolean {
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return guidRegex.test(key);
}

if (config.applicationInsightsInstrumentationKey) {
  if (isValidInstrumentationKey(config.applicationInsightsInstrumentationKey)) {
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
  } else {
    console.error('Invalid Application Insights instrumentation key format');
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
