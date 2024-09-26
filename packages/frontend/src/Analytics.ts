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
  console.warn('ApplicationInsights not initialized');
}

const noop = () => {};

export const trackPageView = applicationInsights?.trackPageView || noop;
export const trackEvent = applicationInsights?.trackEvent || noop;
export const trackException = applicationInsights?.trackException || noop;
