interface Window {
  applicationInsightsInstrumentationKey: string | undefined;
}

declare const window: Window;

export const config = {
  applicationInsightsInstrumentationKey: window.applicationInsightsInstrumentationKey,
};
