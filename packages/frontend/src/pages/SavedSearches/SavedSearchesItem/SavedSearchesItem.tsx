import type { SavedSearchesFieldsFragment } from 'bff-types-generated';
import { useTranslation } from 'react-i18next';
import { HorizontalLine } from '../../../components';
import SearchFilterTag from '../SearchFilterTag/SearchFilterTag.tsx';
import styles from './savedSearchesItem.module.css';

interface SavedSearchesItemProps {
  savedSearch: SavedSearchesFieldsFragment;
  isLast: boolean;
  actionPanel?: React.ReactElement;
}

export const SavedSearchesItem = ({ savedSearch, actionPanel, isLast }: SavedSearchesItemProps) => {
  if (!savedSearch?.data) return null;
  const searchData = savedSearch.data;
  const { t } = useTranslation();

  if (savedSearch.name)
    return (
      <>
        <div className={styles.savedSearchItem} key={savedSearch.id}>
          <div className={styles.searchDetails}>{savedSearch.name}</div>
          {actionPanel}
        </div>
        {!isLast && <HorizontalLine />}
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
            return (
              <SearchFilterTag
                key={`${search?.id}${index}`}
                searchId={search?.id}
                searchValue={search?.value}
                index={index}
              />
            );
          })}
        </div>
        {actionPanel}
      </div>
      {!isLast && <HorizontalLine />}
    </>
  );
};
