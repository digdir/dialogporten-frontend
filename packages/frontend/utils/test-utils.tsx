import { type RenderOptions, render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { SelectedDialogsContainer } from '..';
import { FeatureFlagProvider, featureFlags } from '../src/featureFlags';
import '../src/i18n/config.ts';
import { MockAuthProvider } from '../src/components/Login/MockAuthContext.tsx';

interface IExtendedRenderOptions extends RenderOptions {
  initialEntries?: string[];
}

export const createCustomWrapper = (
  ownQueryClient?: QueryClient,
  options?: Omit<IExtendedRenderOptions, 'wrapper'>,
) => {
  const queryClient =
    ownQueryClient ||
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

  return ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <FeatureFlagProvider flags={featureFlags}>
          <MockAuthProvider>
            <MemoryRouter initialEntries={options?.initialEntries ?? ['/']}>
              <SelectedDialogsContainer>{children}</SelectedDialogsContainer>
            </MemoryRouter>
          </MockAuthProvider>
        </FeatureFlagProvider>
      </QueryClientProvider>
    );
  };
};

export const customRender = (ui: ReactElement, options?: Omit<IExtendedRenderOptions, 'wrapper'>) => {
  const Wrapper = createCustomWrapper(undefined, options);

  return render(ui, { wrapper: Wrapper, ...options });
};
