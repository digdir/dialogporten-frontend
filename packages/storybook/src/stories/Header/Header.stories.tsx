import { Meta, StoryObj } from '@storybook/react';
import { Header } from 'frontend-design-poc';
import { withRouter } from 'storybook-addon-react-router-v6';

const meta = {
  title: 'Components/Header',
  component: Header,
  decorators: [withRouter],
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof Header>;

export const WithNameOnly: Story = {
  args: {
    name: 'Ola Nordmann',
  },
};

export const WithNameAndCompany: Story = {
  args: {
    name: 'Ola Nordmann',
    companyName: 'Aker Solutions AS',
  },
};
