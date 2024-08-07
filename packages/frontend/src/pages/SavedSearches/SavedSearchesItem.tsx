import { DropdownMenu } from '@digdir/designsystemet-react';
import { EllipsisHorizontalIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon, PencilIcon } from '@navikt/aksel-icons';
import type { SavedSearchesFieldsFragment } from 'bff-types-generated';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HorizontalLine } from '../../components';
import { Backdrop } from '../../components/Backdrop';
import { getPredefinedRange } from '../../components/FilterBar/dateInfo.ts';
import styles from './savedSearches.module.css';

interface SavedSearchesItemProps {
  savedSearch: SavedSearchesFieldsFragment;
  onDelete?: (savedSearchToDelete: SavedSearchesFieldsFragment) => void;
  setSelectedSavedSearch?: (savedSearch: SavedSearchesFieldsFragment) => void;
}

export interface OpenSavedSearchLinkProps {
  savedSearch: SavedSearchesFieldsFragment;
  onClick?: () => void;
}

export const OpenSavedSearchLink = ({ savedSearch, onClick }: OpenSavedSearchLinkProps) => {
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

const RenderButtons = ({ savedSearch, onDelete, setSelectedSavedSearch }: SavedSearchesItemProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  if (!savedSearch?.data) return null;

  const handleOpenEditModal = () => {
    setSelectedSavedSearch?.(savedSearch);
  };

  return (
    <div className={styles.renderButtons}>
      <DropdownMenu.Root open={open} onClose={() => setOpen(false)}>
        <DropdownMenu.Trigger className={styles.linkButton} onClick={() => setOpen(!open)}>
          <EllipsisHorizontalIcon className={styles.icon} />
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
            <DropdownMenu.Item onClick={() => onDelete?.(savedSearch)}>
              <div className={styles.dropdownEditSearch}>
                <TrashIcon className={styles.icon} aria-hidden="true" />
                <span>{t('savedSearches.delete_search')}</span>
              </div>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <OpenSavedSearchLink savedSearch={savedSearch} />
      <Backdrop show={open} onClick={() => {}} />
    </div>
  );
};

export const SavedSearchesItem = ({ savedSearch, onDelete, setSelectedSavedSearch }: SavedSearchesItemProps) => {
  if (!savedSearch?.data) return null;
  const searchData = savedSearch.data;
  const { t } = useTranslation();

  if (savedSearch.name)
    return (
      <>
        <div className={styles.savedSearchItem} key={savedSearch.id}>
          <div className={styles.searchDetails}>{savedSearch.name}</div>
          <RenderButtons
            setSelectedSavedSearch={setSelectedSavedSearch}
            savedSearch={savedSearch}
            onDelete={onDelete}
          />
        </div>
        <HorizontalLine />
      </>
    );

  const getRouteName = (fromView: string) => {
    return t('route.' + `${fromView.split('/').pop() || 'inbox'}`);
  };

  return (
    <>
      <div className={styles.savedSearchItem} key={savedSearch.id}>
        <div className={styles.searchDetails}>
          <span>{searchData?.fromView && `In ${getRouteName(searchData.fromView)}:  `}</span>
          <span className={styles.searchString}>{searchData?.searchString && `«${searchData.searchString}»`}</span>
          {searchData?.searchString && `${searchData.filters?.length ? ' + ' : ''}`}
          {searchData?.filters?.map((search, index) => {
            const id = search?.id;
            const predefinedRange = getPredefinedRange().find((range) => range.value === search?.value);
            const value = predefinedRange && search?.id === 'created' ? predefinedRange.label : search?.value;
            return (
              <span key={`${id}${index}`} className={styles.filterElement}>{`${
                index === 0 ? '' : ' +'
              } ${value}`}</span>
            );
          })}
        </div>
        <RenderButtons
          key={savedSearch.id}
          setSelectedSavedSearch={setSelectedSavedSearch}
          savedSearch={savedSearch}
          onDelete={onDelete}
        />
      </div>
      <HorizontalLine />
    </>
  );
};
