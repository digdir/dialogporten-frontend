import { ArrowForwardIcon, ClockDashedIcon, EnvelopeOpenIcon, TrashIcon } from '@navikt/aksel-icons';
import type { Meta, StoryObj } from '@storybook/react';
import { ActionPanel, BottomDrawerContainer } from 'frontend';

export default {
  title: 'Components/BottomDrawer/ActionPanel',
  component: ActionPanel,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <BottomDrawerContainer>
        <Story />
      </BottomDrawerContainer>
    ),
  ],
} as Meta<typeof ActionPanel>;

export const Default: StoryObj<typeof ActionPanel> = {
  args: {
    actionButtons: [
      {
        label: 'Del',
        icon: <ArrowForwardIcon />,
      },
      {
        label: 'Markert som lest',
        icon: <EnvelopeOpenIcon />,
      },
      {
        label: 'Flytt til arkiv',
        icon: <ClockDashedIcon />,
      },
      {
        label: 'Slett',
        icon: <TrashIcon />,
      },
    ],
    selectedItemCount: 3,
  },
};
