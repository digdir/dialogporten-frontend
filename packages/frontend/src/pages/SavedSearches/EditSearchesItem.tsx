import { Button, Modal } from '@digdir/designsystemet-react';
import type { SavedSearchData, SavedSearchesFieldsFragment } from 'bff-types-generated';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { autoFormatRelativeTime } from '.';
import { updateSavedSearch } from '../../api/queries';
import { useSnackbar } from '../../components/Snackbar/useSnackbar';
import { useFormatDistance } from '../../i18n/useDateFnsLocale.tsx';
import styles from './savedSearches.module.css';

interface EditSavedSearchProps {
  savedSearch?: SavedSearchesFieldsFragment;
  onDelete?: (savedSearchToDelete: SavedSearchesFieldsFragment) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export const EditSavedSearch = ({ savedSearch, onDelete, onClose, isOpen }: EditSavedSearchProps) => {
  const { openSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [searchName, setSearchName] = useState(savedSearch?.name || '');
  const searchData = savedSearch?.data as SavedSearchData;
  const queryClient = useQueryClient();
  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
  };
  const formatDistance = useFormatDistance();

  const handleSave = () => {
    if (!savedSearch?.id) return;
    updateSavedSearch(savedSearch?.id, searchName).then(() => {
      openSnackbar({
        message: t('savedSearches.update_success'),
        variant: 'success',
      });
      queryClient.invalidateQueries('savedSearches');
      onClose?.();
    });
  };

  if (!isOpen || !savedSearch?.id) return null;

  return (
    <div className={styles.editSavedSearch}>
      <Modal
        onInteractOutside={() => console.log('Interact outside')} // NEEDS TO BE FIXED
        onBeforeClose={onClose}
        open={isOpen}
        onClose={onClose}
      >
        <Modal.Header className={styles.editSavedSearchHeader}>
          <div className={styles.searchDetails}>
            <span className={styles.searchString}>{searchData?.searchString && `«${searchData.searchString}»`}</span>
            {searchData?.searchString && `${searchData.filters?.length ? ' + ' : ''}`}
            {searchData?.filters?.map((search, index) => {
              const id = search?.id;
              return (
                <span key={`${id}${index}`} className={styles.filterElement}>{`${index === 0 ? '' : ' +'} ${id}`}</span>
              );
            })}
          </div>
        </Modal.Header>
        <Modal.Content>
          <hr className={styles.horizontalLine} />
          <div className={styles.searchFormBody}>
            <label htmlFor="searchName">{t('editSavedSearch.give_search_name')}</label>
            <input
              id="searchName"
              type="text"
              placeholder={t('editSavedSearch.search_without_name')}
              value={searchName}
              onChange={handleSearchNameChange}
            />
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className={styles.searchFormFooter}>
            <Button className={styles.saveButton} onClick={handleSave}>
              {t('editSavedSearch.save_and_close')}
            </Button>
            <Button variant="secondary" className={styles.deleteButton} onClick={() => onDelete?.(savedSearch)}>
              {t('word.delete')}
            </Button>
            <span className={styles.updateTime}>
              {t('savedSearches.lastUpdated')}
              {autoFormatRelativeTime(new Date(Number.parseInt(savedSearch?.updatedAt, 10)), formatDistance)}
            </span>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
