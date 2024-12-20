import type { SavedSearchesFieldsFragment } from 'bff-types-generated';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { type Filter, HorizontalLine } from '../../../components';
import { PlusIcon } from '../../../components/Icons';
import { HorizontalLine } from '../../../components';
import { PlusIcon } from '../../../components/Icons';
import SearchFilterTag from '../SearchFilterTag/SearchFilterTag.tsx';
import styles from './savedSearchesItem.module.css';

interface SavedSearchesItemProps {
  savedSearch: SavedSearchesFieldsFragment;
  isLast: boolean;
  actionPanel?: React.ReactElement;
}

export const SavedSearchesItem = ({ savedSearch, actionPanel, isLast }: SavedSearchesItemProps) => {
  if (!savedSearch?.data) return null;
  const { searchString, filters, fromView } = savedSearch.data;

  const urlParams = new URLSearchParams(window.location.search);
  const queryParams = new URLSearchParams({
    ...(searchString && { search: searchString }),
    ...Object.fromEntries(urlParams.entries()),
  });

  for (const filter of filters as Filter[]) {
    queryParams.append(filter.id, String(filter.value));
  }

  const searchData = savedSearch.data;
  const { t } = useTranslation();

  if (savedSearch.name)
    return (
      <>
        <div className={styles.savedSearchItem} key={savedSearch.id}>
          <div className={styles.searchDetails}>
            <Link to={`${fromView}?${queryParams.toString()}`} className={styles.goToSavedSearchLink}>
              {savedSearch.name}
            </Link>
          </div>
          <div>{actionPanel}</div>
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
          <a href={`${fromView}?${queryParams.toString()}`} className={styles.goToSavedSearchLink}>
            <span className={styles.searchDetailsTitle}>
              {searchData?.fromView && `${t('word.in')} ${getRouteName(searchData.fromView)}:  `}
            </span>
            <span className={styles.searchString}>{searchData?.searchString && `«${searchData.searchString}»`}</span>
            {searchData?.searchString && searchData.filters?.length ? <PlusIcon /> : ''}
            {searchData?.filters?.map((search, index) => {
              return (
                <SearchFilterTag
                  key={`${search?.id}${index}`}
                  searchId={search?.id}
                  searchValue={search?.value}
                  isLastItem={searchData?.filters?.length === index + 1}
                />
              );
            })}
          </a>
        </div>
        <div className={styles.actionPanel}>{actionPanel}</div>
      </div>
      {!isLast && <HorizontalLine />}
    </>
  );
};
