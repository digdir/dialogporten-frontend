import { BookmarkIcon } from '@navikt/aksel-icons';
import type { ButtonHTMLAttributes, RefAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileButton } from '../ProfileButton';

type SaveSearchButtonProps = {
  onBtnClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  RefAttributes<HTMLButtonElement>;

export const SaveSearchButton = ({ disabled, onBtnClick, className, isLoading }: SaveSearchButtonProps) => {
  const { t } = useTranslation();

  if (disabled) {
    return null;
  }

  return (
    <ProfileButton className={className} size="xs" onClick={onBtnClick} variant="tertiary" isLoading={isLoading}>
      <BookmarkIcon fontSize="1.25rem" /> {t('filter_bar.save_search')}
    </ProfileButton>
  );
};
