import { Meta, StoryObj } from '@storybook/react';
import { Footer } from '../../../../frontend';
import { withRouter } from 'storybook-addon-react-router-v6';

export default {
  title: 'Components/Footer',
  component: Footer,
  decorators: [withRouter],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof Footer>;

export const Default: StoryObj<typeof Footer> = {};
