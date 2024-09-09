import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { Header } from 'frontend';
import { withRouter } from 'storybook-addon-react-router-v6';

const meta = {
  title: 'Components/Header',
  component: Header,
  decorators: [
    withRouter,
    (Story, context) => {
      const { args } = context;
      return (
        <div className={args.profile === 'organization' ? 'isCompany' : ''}>
          <Story />
        </div>
      );
    },
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof Header>;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const Person: Story = {
  args: {
    name: 'Ola Nordmann',
    profile: 'person',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Ola Nordmann')).toBeInTheDocument();
  },
};

export const Company: Story = {
  args: {
    name: 'Organization AS',
    profile: 'organization',
  },
};
