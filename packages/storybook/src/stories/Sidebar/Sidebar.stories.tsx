import type { Meta, StoryObj } from '@storybook/react';
import { type ItemPerViewCount, Sidebar } from 'frontend';
import { withRouter } from 'storybook-addon-react-router-v6';

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  decorators: [withRouter],
  tags: ['autodocs'],
  argTypes: {
    isCompany: {
      control: 'boolean',
      description: 'Optional flag to indicate if the sidebar is being used in a company context.',
      defaultValue: false,
    },
    itemsPerViewCount: {
      control: 'object',
      description: 'An object containing the count of items for each view.',
    },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof Sidebar>;

const defaultItemsPerViewCount: ItemPerViewCount = {
  inbox: 5,
  drafts: 3,
  sent: 2,
  'saved-searches': 1,
  archive: 0,
  deleted: 0,
};

export const simpleDesktopExampleCompany: Story = (args) => (
  <div className={args.isCompany ? 'isCompany' : ''}>
    <Sidebar {...args} />
  </div>
);

simpleDesktopExampleCompany.args = {
  isCompany: true,
  itemsPerViewCount: defaultItemsPerViewCount,
};
