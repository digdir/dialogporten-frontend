export enum FeatureFlagKeys {
  TestFeatureToggleEnabled = 'TestFeatureToggleEnabled',
}

export interface FeatureFlags {
  [FeatureFlagKeys.TestFeatureToggleEnabled]: boolean;
}

export const featureFlags: FeatureFlags = {
  [FeatureFlagKeys.TestFeatureToggleEnabled]: true,
};
