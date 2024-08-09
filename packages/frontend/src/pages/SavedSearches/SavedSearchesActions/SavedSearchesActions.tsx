import { DropdownMenu } from '@digdir/designsystemet-react';
import { MenuElipsisHorizontalIcon, TrashIcon } from '@navikt/aksel-icons';
import { ChevronRightIcon, PencilIcon } from '@navikt/aksel-icons';
import type { SavedSearchesFieldsFragment } from 'bff-types-generated';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HorizontalLine } from '../../../components';
import styles from './savedSearchesActions.module.css';
interface SaveSearchesActionsProps {
  savedSearch: SavedSearchesFieldsFragment;
  onDeleteBtnClick?: (savedSearchToDelete: SavedSearchesFieldsFragment) => void;
  onEditBtnClick?: (savedSearch: SavedSearchesFieldsFragment) => void;
}
const SaveSearchesActions = ({ savedSearch, onDeleteBtnClick, onEditBtnClick }: SaveSearchesActionsProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  if (!savedSearch?.data) return null;

  const handleOpenEditModal = () => {
    onEditBtnClick?.(savedSearch);
  };

  return (
    <div className={styles.renderButtons}>
      <DropdownMenu.Root open={open} onClose={() => setOpen(false)}>
        <DropdownMenu.Trigger className={styles.linkButton} onClick={() => setOpen(!open)}>
          <MenuElipsisHorizontalIcon className={styles.icon} />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className={styles.dropdownContent}>
          <DropdownMenu.Group>
            <DropdownMenu.Item onClick={handleOpenEditModal}>
              <div className={styles.dropdownEditSearch}>
                <PencilIcon fontSize="1.5rem" aria-hidden="true" />
                <span>{t('savedSearches.change_name')}</span>
                <ChevronRightIcon fontSize={24} className={styles.icon} />
              </div>
            </DropdownMenu.Item>
            <HorizontalLine />
            <DropdownMenu.Item onClick={() => onDeleteBtnClick?.(savedSearch)}>
              <div className={styles.dropdownEditSearch}>
                <TrashIcon className={styles.icon} aria-hidden="true" />
                <span>{t('savedSearches.delete_search')}</span>
              </div>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <OpenSavedSearchLink savedSearch={savedSearch} />
    </div>
  );
};

export interface OpenSavedSearchLinkProps {
  savedSearch: SavedSearchesFieldsFragment;
  onClick?: () => void;
}
const OpenSavedSearchLink = ({ savedSearch, onClick }: OpenSavedSearchLinkProps) => {
  const { searchString, filters, fromView } = savedSearch.data;
  const queryParams = new URLSearchParams({
    ...(searchString && { search: searchString }),
    ...(filters?.length && { filters: JSON.stringify(filters) }),
  });
  return (
    <a href={`${fromView}?${queryParams.toString()}`}>
      <ChevronRightIcon fontSize={24} className={styles.icon} onClick={onClick} />
    </a>
  );
};

export { OpenSavedSearchLink, SaveSearchesActions };
