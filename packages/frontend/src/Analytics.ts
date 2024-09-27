import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import type { ITelemetryPlugin } from '@microsoft/applicationinsights-web';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { config } from './config';

let applicationInsights: ApplicationInsights | null = null;

if (config.applicationInsightsInstrumentationKey) {
  const reactPlugin = new ReactPlugin();
  applicationInsights = new ApplicationInsights({
    config: {
      instrumentationKey: config.applicationInsightsInstrumentationKey,
      extensions: [reactPlugin as unknown as ITelemetryPlugin],
    },
  });

  applicationInsights.loadAppInsights();
} else {
  console.warn('ApplicationInsightsInstrumentationKey is undefined. Tracking is disabled.');
}

const noop = () => {};

export const Analytics = {
  trackPageView: applicationInsights?.trackPageView.bind(applicationInsights) || noop,
  trackEvent: applicationInsights?.trackEvent.bind(applicationInsights) || noop,
  trackException: applicationInsights?.trackException.bind(applicationInsights) || noop,
};
