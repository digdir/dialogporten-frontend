import { Button, Modal } from '@digdir/designsystemet-react';
import { TrashIcon } from '@navikt/aksel-icons';
import type { SavedSearchData, SavedSearchesFieldsFragment } from 'bff-types-generated';
import { type ForwardedRef, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { updateSavedSearch } from '../../../api/queries.ts';
import { HorizontalLine, useSnackbar } from '../../../components';
import { useFormatDistance } from '../../../i18n/useDateFnsLocale.tsx';
import { autoFormatRelativeTime } from '../searchUtils.ts';
import styles from './editSavedSearchDialog.module.css';

interface EditSavedSearchDialogProps {
  savedSearch: SavedSearchesFieldsFragment | null;
  onDelete?: (savedSearchToDelete: SavedSearchesFieldsFragment) => void;
}

export type EditSavedSearchDialogRef = {
  openDialog: () => void;
  close: () => void;
};

export const EditSavedSearchDialog = forwardRef(
  ({ savedSearch, onDelete }: EditSavedSearchDialogProps, ref: ForwardedRef<EditSavedSearchDialogRef>) => {
    const { openSnackbar } = useSnackbar();
    const { t } = useTranslation();
    const [searchName, setSearchName] = useState(savedSearch?.name || '');
    const searchData = savedSearch?.data as SavedSearchData;
    const queryClient = useQueryClient();
    const editDialogRef = useRef<HTMLDialogElement>(null);
    const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchName(event.target.value);
    };
    const formatDistance = useFormatDistance();

    useImperativeHandle(ref, () => ({
      openDialog: () => {
        editDialogRef.current?.showModal();
      },
      close: () => {
        editDialogRef.current?.close();
      },
    }));

    const handleSave = () => {
      if (!savedSearch?.id) return;

      updateSavedSearch(savedSearch?.id, searchName).then(() => {
        openSnackbar({
          message: t('savedSearches.update_success'),
          variant: 'success',
        });
        void queryClient.invalidateQueries('savedSearches');
        onClose?.();
      });
    };

    const onClose = () => {
      editDialogRef.current?.close();
    };

    return (
      <Modal.Root>
        <Modal.Dialog onClose={onClose} ref={editDialogRef} onInteractOutside={onClose}>
          <Modal.Header>
            <div className={styles.searchDetails}>
              <span className={styles.searchString}>{searchData?.searchString && `«${searchData.searchString}»`}</span>
              {searchData?.searchString && `${searchData.filters?.length ? ' + ' : ''}`}
              {searchData?.filters?.map((search, index) => {
                const id = search?.id;
                const label = `${index === 0 ? '' : ' +'} ${id}`;
                return (
                  <span key={`${id}-${index}`} className={styles.filterElement}>
                    {label}
                  </span>
                );
              })}
            </div>
          </Modal.Header>
          <Modal.Content>
            <HorizontalLine />
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
              <div className={styles.buttons}>
                <Button onClick={handleSave}>{t('editSavedSearch.save_and_close')}</Button>
                <Button variant="secondary" onClick={() => savedSearch && onDelete?.(savedSearch)}>
                  <TrashIcon className={styles.icon} aria-hidden="true" />
                  <span>{t('word.delete')}</span>
                </Button>
              </div>
              <span className={styles.updateTime}>
                {t('savedSearches.lastUpdated')}
                {savedSearch?.updatedAt &&
                  autoFormatRelativeTime(new Date(Number.parseInt(savedSearch.updatedAt, 10)), formatDistance)}
              </span>
            </div>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Root>
    );
  },
);
