import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from 'frontend';
import { withRouter } from 'storybook-addon-react-router-v6';

export default {
  title: 'Components/Badge',
  component: Badge,
  decorators: [
    withRouter,
    (Story) => {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
          <Story />
        </div>
      );
    },
  ],
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof Badge>;

export const Default: StoryObj<typeof Badge> = {
  args: {
    label: 19,
  },
};

export const strong: StoryObj<typeof Badge> = {
  args: {
    variant: 'strong',
    label: 4,
  },
};

export const smallStrong: StoryObj<typeof Badge> = {
  args: {
    size: 'small',
    variant: 'strong',
  },
};

export const smallDefault: StoryObj<typeof Badge> = {
  args: {
    size: 'small',
  },
};
