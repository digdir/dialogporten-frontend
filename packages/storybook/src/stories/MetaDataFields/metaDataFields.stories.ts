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
      { type: 'status_completed', label: 'Status: Completed' },
      { type: 'status_inprogress', label: 'Status: In Progress' },
      { type: 'status_sent', label: 'Status: Sent' },
      { type: 'status_requires_attention', label: 'Status: Requires Attention' },
      { type: 'status_draft', label: 'Status: Draft' },
      { type: 'timestamp', label: '5. september 15:40' },
      { type: 'attachment', label: 'Vedlegg her' },
      {
        type: 'seenBy',
        label: 'Seen By You',
        options: { tooltip: 'This is seen by \n Every person will be listed here' },
      },
    ],
  },
};
