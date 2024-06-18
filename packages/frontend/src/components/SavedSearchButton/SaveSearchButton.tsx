import { BookmarkIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { ProfileButton } from '../ProfileButton';

type SaveSearchButtonProps = {
  onBtnClick: () => void;
  disabled?: boolean;
};

export const SaveSearchButton = ({ disabled, onBtnClick }: SaveSearchButtonProps) => {
  const { t } = useTranslation();

  if (disabled) {
    return null;
  }

  return (
    <ProfileButton size="small" onClick={onBtnClick} variant="secondary">
      <BookmarkIcon fontSize="1.5rem" /> {t('filter_bar.save_search')}
    </ProfileButton>
  );
};
