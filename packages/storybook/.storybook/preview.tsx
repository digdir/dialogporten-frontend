import type { Preview } from '@storybook/react';
import '@digdir/design-system-tokens/brand/altinn/tokens.css';
import customTheme from './customTheme';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';

import './i18next'

const preview: Preview = {
  globals: {
    locale: 'nb',
    locales: {
      nb: 'Norsk (bokmål)',
    },
  },
  decorators: [
    (Story) => {
      return (
        <I18nextProvider i18n={i18n}>
            <Story />
        </I18nextProvider>
    );
    },
  ],
  parameters: {
    i18n,
    actions: { argTypesRegex: '^on[A-Z].*' }, docs: {
      theme: customTheme
    }, controls: {
      matchers: {
        color: /(background|color)$/i, date: /Date$/i
      }
    }
  }
};



export default preview;
