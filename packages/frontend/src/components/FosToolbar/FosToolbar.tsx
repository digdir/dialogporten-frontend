import { ArrowsUpDownIcon, BookmarkIcon, PlusIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { ProfileButton } from '../ProfileButton';

import styles from './fosToolbar.module.css';

interface FosToolbarProps {
  onFilterBtnClick: () => void;
  onSortBtnClick: () => void;
  onSaveBtnClick: () => void;
  hideSaveButton?: boolean;
}
/*
 * FosToolbar is a floating toolbar that is only visible on mobile and contains action buttons for filtering, sorting and saving search.
 * @param onFilterBtnClick - Function that is called when the filter button is clicked.
 * @param onSortBtnClick - Function that is called when the sort button is clicked.
 * @param onSaveBtnClick - Function that is called when the save button is clicked.
 * @param hideSaveButton - Optional boolean that determines if the save button should be hidden. Default is false
 * @returns A floating toolbar with action buttons for filtering, sorting and saving search.
 */
export const FosToolbar = ({
  onFilterBtnClick,
  onSaveBtnClick,
  onSortBtnClick,
  hideSaveButton = false,
}: FosToolbarProps) => {
  const { t } = useTranslation();
  return (
    <div className={styles.fosToolbar}>
      <div className={styles.buttons}>
        <ProfileButton onClick={onFilterBtnClick} size="small" variant="tertiary">
          <PlusIcon fontSize="1.5rem" /> {t('fos.buttons.filter')}
        </ProfileButton>
        <ProfileButton onClick={onSortBtnClick} size="small" variant="tertiary">
          <ArrowsUpDownIcon fontSize="1.5rem" /> {t('fos.buttons.sort')}
        </ProfileButton>
        {hideSaveButton ? null : (
          <ProfileButton onClick={onSaveBtnClick} size="small" variant="tertiary">
            <BookmarkIcon fontSize="1.5rem" /> {t('fos.buttons.save_search')}
          </ProfileButton>
        )}
      </div>
    </div>
  );
};
