import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import type { ITelemetryPlugin } from '@microsoft/applicationinsights-web';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const config = {
  instrumentationKey: process.env.APP_INSIGHTS_INSTRUMENTATION_KEY,
};

let applicationInsights: ApplicationInsights | null = null;

if (config.instrumentationKey) {
  const reactPlugin = new ReactPlugin();

  applicationInsights = new ApplicationInsights({
    config: {
      ...config,
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
