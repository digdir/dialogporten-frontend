import type { Meta, StoryObj } from '@storybook/react';
import { Html } from 'embeddable-markdown-html';
import { useState } from 'react';

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
