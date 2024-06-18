import type { Meta } from '@storybook/react';
import { SortOrderDropdown } from 'frontend';
import { useState } from 'react';
import { withRouter } from 'storybook-addon-react-router-v6';

export default {
  title: 'Components/SortOrderDropdown',
  component: SortOrderDropdown,
  decorators: [
    withRouter,
    (Story) => {
      return (
        <div style={{ padding: 20 }}>
          <Story />
        </div>
      );
    },
  ],
  tags: ['autodocs'],
} as Meta<typeof SortOrderDropdown>;

export const Example = () => {
  const [selectedSortOrder, setSelectedSortOrder] = useState<string>('name');
  return (
    <SortOrderDropdown
      onSelect={(selectedSortOrder: string) => setSelectedSortOrder(selectedSortOrder)}
      selectedSortOrder={selectedSortOrder}
      options={[
        { label: 'Sorter etter navn', id: 'name' },
        { label: 'Sorter etter dato', id: 'date' },
        { label: 'Sorter etter størrelse', id: 'size' },
      ]}
    />
  );
};
