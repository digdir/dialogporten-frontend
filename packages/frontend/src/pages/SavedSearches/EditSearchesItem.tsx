import styles from './savedSearches.module.css';
import { SavedSearchData, SavedSearchesFieldsFragment } from 'bff-types-generated';
import { Button, Modal } from '@digdir/designsystemet-react';
import { useState } from 'react';
import { updateSavedSearch } from '../../api/queries';
import { useQueryClient } from 'react-query';
import { autoFormatRelativeTime } from '.';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../../components/Snackbar/useSnackbar';


interface EditSavedSearchProps {
  savedSearch?: SavedSearchesFieldsFragment;
  onDelete?: (id: number) => void;
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

  const handleSave = () => {
    if (!savedSearch?.id) return
    updateSavedSearch(savedSearch?.id, searchName).then(() => {
      openSnackbar({
        message: t('savedSearches.update_success'),
        variant: 'success',
      });
      queryClient.invalidateQueries('savedSearches');
      onClose?.()
    });
  };

  if (!isOpen || !savedSearch?.id) return null

  return <div className={styles.editSavedSearch}>
    <Modal onInteractOutside={() => console.log("Interact outside")} onBeforeClose={onClose} open={isOpen} onClose={onClose}>
      <Modal.Header className={styles.editSavedSearchHeader} >
        <div className={styles.searchDetails}>
          <span className={styles.searchString}>{searchData?.searchString && `«${searchData.searchString}»`}</span>
          {searchData?.searchString && `${searchData.filters?.length ? ' + ' : ''}`}
          {searchData?.filters?.map((search, index) => {
            const fieldName = search?.fieldName;
            return (
              <span key={`${fieldName}${index}`} className={styles.filterElement}>{`${index === 0 ? '' : ' +'
                } ${fieldName}`}</span>
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
          <Button className={styles.saveButton} onClick={handleSave}>{t('editSavedSearch.save_and_close')}</Button>
          <Button variant='secondary' className={styles.deleteButton} onClick={() => onDelete?.(savedSearch?.id)}>{t('word.delete')}</Button>
          <span className={styles.updateTime}>{t('savedSearches.lastUpdated')}{autoFormatRelativeTime(new Date(parseInt(savedSearch?.updatedAt, 10)))}</span>
        </div>
      </Modal.Footer>
    </Modal>
  </div>
};
