import '@digdir/designsystemet-css';
import '@digdir/designsystemet-theme';
import { A11yParameters } from '@storybook/addon-a11y';
import type { Preview } from '@storybook/react';
import { Rule, getRules } from 'axe-core';
import { SelectedDialogsContainer } from 'frontend';
import 'frontend/src/globals.css';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { nbResources } from '../../frontend';
import customTheme from './customTheme';

import './i18next';

const enabledTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const enabledRules: Rule[] = getRules(enabledTags).map((ruleMetadata) => ({
  id: ruleMetadata.ruleId,
  enabled: true,
}));

const a11y: A11yParameters = {
  config: {
    rules: enabledRules,
  },
};

const preview: Preview = {
  globals: {
    locale: 'nb',
    locales: {
      nb: nbResources,
    },
  },
  decorators: [
    (Story) => {
      const client = new QueryClient();
      return (
        <QueryClientProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <SelectedDialogsContainer>
              <Story />
            </SelectedDialogsContainer>
          </I18nextProvider>
        </QueryClientProvider>
      );
    },
  ],
  parameters: {
    i18n,
    a11y,
    actions: { argTypesRegex: '^on[A-Z].*' },
    docs: {
      theme: customTheme,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
