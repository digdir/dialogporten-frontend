import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import './i18n/config.ts';

import '@digdir/designsystemet-css';
import '@digdir/designsystemet-theme';

import App from './App.tsx';
import { FeatureFlagProvider, featureFlags } from './featureFlags';

async function enableMocking() {
  if (import.meta.env.MODE === 'development') {
    const urlParams = new URLSearchParams(window.location.search);
    const enableMocking = urlParams.get('mock') === 'true';
    if (enableMocking) {
      const { worker } = await import('./mocks/browser');
      return worker.start();
    }
  }
}

const element = document.getElementById('root');
if (element) {
  const root = ReactDOM.createRoot(element);
  const queryClient = new QueryClient();
  enableMocking().then(() => {
    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <FeatureFlagProvider flags={featureFlags}>
              <App />
            </FeatureFlagProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </React.StrictMode>,
    );
  });
} else {
  console.log(`element with id "root" is not in DOM`);
}
