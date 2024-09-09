import type { Meta, StoryObj } from '@storybook/react';
import { AvatarGroup } from 'frontend/src/components/AvatarGroup';
import { withRouter } from 'storybook-addon-react-router-v6';

const meta = {
  title: 'Components/AvatarGroup',
  component: AvatarGroup,
  decorators: [
    withRouter,
    (Story) => {
      return (
        <div style={{ margin: 20 }}>
          <Story />
        </div>
      );
    },
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

export const FullExample: Story = {
  args: {
    profile: 'organization',
    avatars: [
      { name: 'JavaScript' },
      { name: 'Python' },
      { name: 'GoLang' },
      { name: 'TypeScript' },
      { name: 'Cobol' },
    ],
  },
};

export const TwoAvatars: Story = {
  args: {
    profile: 'organization',
    avatars: [{ name: 'JavaScript' }, { name: 'Python' }],
  },
};

export const ThreeAvatars: Story = {
  args: {
    profile: 'organization',
    avatars: [{ name: 'JavaScript' }, { name: 'Python' }, { name: 'GoLang' }],
  },
};

export const fiftyAvatars: Story = {
  args: {
    profile: 'organization',
    avatars: Array.from({ length: 50 }, (_, i) => ({ name: `${i} avatar` })),
  },
};
