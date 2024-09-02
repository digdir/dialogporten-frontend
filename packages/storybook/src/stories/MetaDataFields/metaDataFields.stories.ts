import type { Meta, StoryObj } from '@storybook/react';
import { MetaDataFields } from 'frontend';

export default {
  title: 'Components/MetaDataFields',
  component: MetaDataFields,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof MetaDataFields>;

export const Default: StoryObj<typeof MetaDataFields> = {
  args: {
    metaFields: [
      { type: 'status', label: 'Status' },
      { type: 'timestamp', label: 'Timestamp' },
      { type: 'attachment', label: 'Attachment here' },
      {
        type: 'seenBy',
        label: 'Seen By You',
        options: { tooltip: 'This is seen by \n Every person will be listed here' },
      },
    ],
  },
};
