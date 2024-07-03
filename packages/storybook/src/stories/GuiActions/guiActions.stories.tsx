import type { Meta, StoryFn } from '@storybook/react';
import { type GuiActionProps, GuiActions } from 'frontend';

export default {
  title: 'Components/GuiActions',
  component: GuiActions,
  argTypes: {
    actions: {
      control: 'object',
      description: 'Array of action button properties',
      table: {
        type: {
          summary: 'GuiButtonProps[]',
        },
      },
    },
  },
} as Meta<typeof GuiActions>;

const Template: StoryFn<GuiActionProps> = (args) => <GuiActions {...args} />;

export const Default = Template.bind({});
Default.args = {
  actions: [
    { id: 'btn1', url: '/submit', disabled: false, priority: 'Primary', method: 'POST', title: 'Submit' },
    { id: 'btn2', url: '/cancel', disabled: false, priority: 'Secondary', method: 'GET', title: 'Cancel' },
  ],
};

export const withDisabledButton = Template.bind({});
withDisabledButton.args = {
  actions: [
    { id: 'btn1', url: '/submit', disabled: false, priority: 'Primary', method: 'POST', title: 'Submit' },
    { id: 'btn2', url: '/cancel', disabled: true, priority: 'Secondary', method: 'GET', title: 'Cancel' },
  ],
};

export const TertiaryPriority = Template.bind({});
TertiaryPriority.args = {
  actions: [{ id: 'btn1', url: '/info', disabled: false, priority: 'Tertiary', method: 'GET', title: 'Info' }],
};
