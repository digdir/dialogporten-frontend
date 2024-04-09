import { RenderOptions, render } from '@testing-library/react';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import '../src/i18n/config.ts';
import { FeatureFlagProvider, featureFlags } from '../src/featureFlags';

interface IExtendedRenderOptions extends RenderOptions {
  initialEntries?: string[];
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const customRender = (ui: ReactElement, options?: Omit<IExtendedRenderOptions, 'wrapper'>) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <FeatureFlagProvider flags={featureFlags}>
          <MemoryRouter initialEntries={options?.initialEntries ?? ['/']}>{children}</MemoryRouter>
        </FeatureFlagProvider>
      </QueryClientProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
};
