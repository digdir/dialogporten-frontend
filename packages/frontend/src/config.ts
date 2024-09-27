export interface Config {
  /**
   * The instrumentation key for Application Insights.
   * If undefined, Application Insights tracking should be disabled.
   */
  applicationInsightsInstrumentationKey: string | undefined;
}

export const config: Config = window.__CONFIG__;
