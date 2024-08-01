import type { Meta } from '@storybook/react';
import styles from 'frontend/src/components/FilterBar/FilterButton/filterButton.module.css';
import { ProfileCheckbox } from 'frontend/src/components/ProfileCheckbox';
import { useState } from 'react';

export default {
  title: 'Components/ProfileCheckbox',
  component: ProfileCheckbox,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 10 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof ProfileCheckbox>;

export const CompanyCheckbox = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div className="isCompany">
      <ProfileCheckbox
        onChange={() => setChecked(!checked)}
        size="sm"
        value={'check-me'}
        checked={checked}
        className={styles.checkbox}
      >
        Check me
      </ProfileCheckbox>
    </div>
  );
};

export const PersonCheckbox = () => {
  const [checked, setChecked] = useState(false);
  return (
    <ProfileCheckbox
      onChange={() => setChecked(!checked)}
      size="sm"
      value={'check-me'}
      checked={checked}
      className={styles.checkbox}
    >
      Check me
    </ProfileCheckbox>
  );
};
