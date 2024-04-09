import { useContext } from 'react';
import { FeatureFlagKeys } from './FeatureFlags';
import { FeatureFlagContext } from './FeatureFlagsProvider';

export function useFeatureFlag<T>(flag: FeatureFlagKeys): T {
  const context = useContext(FeatureFlagContext);

  if (context === undefined) {
    throw new Error('useFeatureFlag must be used within a FeatureFlagProvider');
  }

  return context[flag] as T;
}
