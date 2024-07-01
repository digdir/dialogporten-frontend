import { useContext } from 'react';
import type { FeatureFlagKeys } from './FeatureFlags';
import { FeatureFlagContext } from './FeatureFlagsProvider';

export function useFeatureFlag<T>(flag: FeatureFlagKeys): T {
  const context = useContext(FeatureFlagContext);

  if (context === undefined) {
    console.error('useFeatureFlag must be used within a FeatureFlagProvider');
    return undefined as T;
  }
  return context[flag] as T;
}
