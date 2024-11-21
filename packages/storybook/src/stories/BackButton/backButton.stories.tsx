import type { Meta, StoryObj } from '@storybook/react';
import { BackButton } from 'frontend';
import { withRouter } from 'storybook-addon-react-router-v6';

export default {
  title: 'Components/BackButton',
  component: BackButton,
  decorators: [withRouter],
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof BackButton>;

export const Default: StoryObj<typeof BackButton> = {
  args: {
    path: '/',
  },
};
