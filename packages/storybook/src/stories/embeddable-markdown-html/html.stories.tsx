import type { Meta, StoryObj } from '@storybook/react';
import { Html } from 'embeddable-markdown-html';

export default {
  title: 'Embeddable-Html-Markdown/Html',
  component: Html,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof Html>;

export const Example: StoryObj<typeof Html> = {
  args: {
    children: '<h1>Test</h1>',
  },
};

export const FullExample: StoryObj<typeof Html> = {
  args: {
    children: `
    <html>
<body><p>Du finner selskapets stiftelsesdokument og vedtekter vedlagt. Disse dokumentene er sendt til utfylleren,
  stiftere og eventuelle fullmektiger.</p><p>Den som skal sende inn melding om registrering i Foretaksregisteret,
  oppretter en Samordnet registermelding ved å klikke på lenken under. Et gitt register må ha mottatt meldingen senest
  tre måneder etter at selskapet er stiftet.</p><b><a href='dinUrl'>Gå til registrering i
  nevnte register</a></b><br/><br/></body>
</html>
<html>
<body><p>Du har opprettet en relevant registermelding. Har du ikke gjort ferdig meldingen kan du åpne skjemaet og
  fortsette utfyllingen.</p><a href='dinurl'>Åpne skjema</a></body>
</html>
    `,
  },
};
