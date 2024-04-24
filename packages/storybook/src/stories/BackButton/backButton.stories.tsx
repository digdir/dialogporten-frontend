import { Meta, StoryObj } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { BackButton } from '../../../../frontend';

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
    pathTo: '/',
  },
};
