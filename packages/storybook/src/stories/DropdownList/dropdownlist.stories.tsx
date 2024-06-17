import { BeaconSignalsIcon } from '@navikt/aksel-icons';
import type { Meta, StoryObj } from '@storybook/react';
import { DropdownList, DropdownListItem } from 'frontend';
import { withRouter } from 'storybook-addon-react-router-v6';

export default {
  title: 'Components/DropdownList',
  component: DropdownList,
  decorators: [withRouter],
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof DropdownList>;

export const Default: StoryObj<typeof DropdownList> = {
  args: {
    children: [
      <DropdownListItem
        key="item-1"
        onClick={() => alert('clicked 1')}
        leftContent={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <BeaconSignalsIcon fontSize="1.5rem" style={{ marginRight: 8 }} />
            <span>Item 1</span>
          </div>
        }
      />,
      <DropdownListItem
        onClick={() => alert('clicked 2')}
        key="item-2"
        leftContent={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <BeaconSignalsIcon fontSize="1.5rem" style={{ marginRight: 8 }} />
            <span>Item 2</span>
          </div>
        }
      />,
    ],
  },
};
