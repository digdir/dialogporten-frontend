import type { Meta } from '@storybook/react';
import { ProfileButton } from 'frontend/src/components/ProfileButton/ProfileButton.tsx';
import { withRouter } from 'storybook-addon-react-router-v6';

export default {
  title: 'Components/ProfileButton',
  component: ProfileButton,
  decorators: [withRouter],
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof ProfileButton>;

export const CompanyPrimary = () => {
  return (
    <div className="isCompany">
      <ProfileButton size="small" onClick={() => {}} variant="primary">
        Primary
      </ProfileButton>
    </div>
  );
};

export const CompanySecondary = () => {
  return (
    <div className="isCompany">
      <ProfileButton size="small" onClick={() => {}} variant="secondary">
        Secondary
      </ProfileButton>
    </div>
  );
};

export const PersonPrimary = () => {
  return (
    <ProfileButton size="small" onClick={() => {}} variant="primary">
      Primary
    </ProfileButton>
  );
};

export const PersonSecondary = () => {
  return (
    <ProfileButton size="small" onClick={() => {}} variant="secondary">
      Secondary
    </ProfileButton>
  );
};

export const LoadingButton = () => {
  return <ProfileButton size="small" onClick={() => {}} variant="secondary" isLoading />;
};
