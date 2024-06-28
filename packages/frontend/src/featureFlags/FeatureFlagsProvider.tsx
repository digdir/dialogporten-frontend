import type React from 'react';
import { createContext, type ReactNode } from 'react'
import type { FeatureFlags } from './FeatureFlags';

export const FeatureFlagContext = createContext<FeatureFlags | undefined>(undefined);

interface FeatureFlagProviderProps {
  children: ReactNode;
  flags: FeatureFlags;
}

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({ children, flags }) => {
  return <FeatureFlagContext.Provider value={flags}>{children}</FeatureFlagContext.Provider>;
};
