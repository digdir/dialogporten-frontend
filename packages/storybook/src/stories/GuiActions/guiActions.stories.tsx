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
          summary: 'GuiActionButton[]',
        },
      },
    },
    dialogToken: {
      control: 'text',
      description: 'Authorization token for dialog actions',
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    onDeleteSuccess: {
      control: 'function',
      description: 'Callback function to execute after a successful delete action',
      table: {
        type: {
          summary: '() => void',
        },
      },
    },
  },
} as Meta<typeof GuiActions>;

const Template: StoryFn<GuiActionProps> = (args) => <GuiActions {...args} />;

export const Default = Template.bind({});
Default.args = {
  actions: [
    {
      id: 'btn1',
      url: '/submit',
      disabled: false,
      priority: 'Primary',
      httpMethod: 'POST',
      title: 'Submit',
      isDeleteAction: false,
    },
    {
      id: 'btn2',
      url: '/cancel',
      disabled: false,
      priority: 'Secondary',
      httpMethod: 'GET',
      title: 'Cancel',
      isDeleteAction: false,
    },
  ],
  dialogToken: 'your-dialog-token',
  onDeleteSuccess: () => console.log('Deleted'),
};

export const withDisabledButton = Template.bind({});
withDisabledButton.args = {
  actions: [
    {
      id: 'btn1',
      url: '/submit',
      disabled: false,
      priority: 'Primary',
      httpMethod: 'POST',
      title: 'Submit',
      isDeleteAction: false,
    },
    {
      id: 'btn2',
      url: '/cancel',
      disabled: true,
      priority: 'Secondary',
      httpMethod: 'GET',
      title: 'Cancel',
      isDeleteAction: false,
    },
  ],
  dialogToken: 'your-dialog-token',
  onDeleteSuccess: () => console.log('Deleted'),
};

export const TertiaryPriority = Template.bind({});
TertiaryPriority.args = {
  actions: [
    {
      id: 'btn1',
      url: '/info',
      disabled: false,
      priority: 'Tertiary',
      httpMethod: 'GET',
      title: 'Info',
      isDeleteAction: false,
    },
  ],
  dialogToken: 'your-dialog-token',
  onDeleteSuccess: () => console.log('Deleted'),
};
