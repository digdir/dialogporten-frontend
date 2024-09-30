interface Window {
  __CONFIG__: {
    applicationInsightsInstrumentationKey: string | undefined;
  };
}

declare const window: Window;

export type Config = typeof window.__CONFIG__;

export const config: Config = window.__CONFIG__;
