interface Config {
  applicationInsightsInstrumentationKey: string | undefined;
}

const getEnvironmentConfig = (): Config => {
  const currentUrl = window.location.host;

  // Test
  if (currentUrl.includes('af.at.altinn.no')) {
    return {
      applicationInsightsInstrumentationKey:
        'InstrumentationKey=8b99e68d-215b-4424-aeaa-884d7510e892;IngestionEndpoint=https://norwayeast-0.in.applicationinsights.azure.com/;LiveEndpoint=https://norwayeast.livediagnostics.monitor.azure.com/;ApplicationId=c5ce3f61-16e0-43f2-917b-c73c7c31356f',
    };
  }
  // Staging
  if (currentUrl.includes('af.tt.altinn.no')) {
    return {
      applicationInsightsInstrumentationKey:
        'InstrumentationKey=a89c2321-61c9-4aa9-a749-47f25152e677;IngestionEndpoint=https://norwayeast-0.in.applicationinsights.azure.com/;LiveEndpoint=https://norwayeast.livediagnostics.monitor.azure.com/;ApplicationId=02a5415e-ecc8-4fb7-84b2-e924abcdad1a',
    };
  }
  // Production
  if (currentUrl.includes('af.altinn.no')) {
    return {
      applicationInsightsInstrumentationKey:
        'InstrumentationKey=e7b23535-6dc0-48fd-a2f1-0916ae35fdc0;IngestionEndpoint=https://norwayeast-0.in.applicationinsights.azure.com/;LiveEndpoint=https://norwayeast.livediagnostics.monitor.azure.com/;ApplicationId=5ae181ef-95e1-4f50-952f-49779026b08f',
    };
  }
  // Default configuration
  return {
    applicationInsightsInstrumentationKey: undefined,
  };
};

export const config: Config = getEnvironmentConfig();
