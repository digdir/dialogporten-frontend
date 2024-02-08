import type { Preview } from '@storybook/react';
import '@digdir/design-system-tokens/brand/altinn/tokens.css';
import customTheme from './customTheme';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    docs: {
      theme: customTheme
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
