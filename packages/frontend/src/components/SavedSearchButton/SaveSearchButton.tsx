import { BookmarkIcon } from '@navikt/aksel-icons';
import type { ButtonHTMLAttributes, RefAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileButton } from '../ProfileButton';

type SaveSearchButtonProps = {
  onBtnClick: () => void;
  disabled?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  RefAttributes<HTMLButtonElement>;

export const SaveSearchButton = ({ disabled, onBtnClick, className }: SaveSearchButtonProps) => {
  const { t } = useTranslation();

  if (disabled) {
    return null;
  }

  return (
    <ProfileButton size="small" className={className} onClick={onBtnClick} variant="secondary">
      <BookmarkIcon fontSize="1.5rem" /> {t('filter_bar.save_search')}
    </ProfileButton>
  );
};
