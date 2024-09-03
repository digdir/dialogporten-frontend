export enum FeatureFlagKeys {
  EnableDebugHeaderScreen = 'EnableDebugHeaderScreen',
  DisableBulkActions = 'DisableBulkActions',
}

export interface FeatureFlags {
  [FeatureFlagKeys.EnableDebugHeaderScreen]: boolean;
  [FeatureFlagKeys.DisableBulkActions]: boolean;
}

export const featureFlags: FeatureFlags = {
  [FeatureFlagKeys.EnableDebugHeaderScreen]: true,
  [FeatureFlagKeys.DisableBulkActions]: true,
};
