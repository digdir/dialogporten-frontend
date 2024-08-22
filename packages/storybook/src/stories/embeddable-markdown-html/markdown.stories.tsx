import type { Meta, StoryObj } from '@storybook/react';
import { Markdown } from 'embeddable-markdown-html';

export default {
  title: 'Embeddable-Html-Markdown/Markdown',
  component: Markdown,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof Markdown>;

export const Example: StoryObj<typeof Markdown> = {
  args: {
    children: `# Test

This is a test document written in markdown.
It supports **bold** and _cursive_.

## Header 2

> Quotes

Above here is a quote ^

### Header 3

#### Header 4

##### Header 5

###### Header 6

`,
  },
};
