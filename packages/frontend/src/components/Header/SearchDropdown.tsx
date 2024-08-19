import { ChevronRightIcon } from '@navikt/aksel-icons';
import type { SavedSearchesFieldsFragment } from 'bff-types-generated';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useSearchDialogs } from '../../api/useDialogs';
import { useParties } from '../../api/useParties';
import { useFormatDistance } from '../../i18n/useDateFnsLocale.tsx';
import { OpenSavedSearchLink } from '../../pages/SavedSearches/SavedSearchesActions/SavedSearchesActions.tsx';
import SearchFilterTag from '../../pages/SavedSearches/SearchFilterTag/SearchFilterTag.tsx';
import { autoFormatRelativeTime } from '../../pages/SavedSearches/searchUtils.ts';
import { useSavedSearches } from '../../pages/SavedSearches/useSavedSearches.ts';
import { Avatar } from '../Avatar';
import { InboxItem } from '../InboxItem';
import { SearchDropdownItem } from './SearchDropdownItem';
import { SearchDropdownSkeleton } from './SearchDropdownSkeleton';
import styles from './search.module.css';

interface SearchDropdownProps {
  showDropdownMenu: boolean;
  onClose: () => void;
  searchValue: string;
  onSearch: (value: string) => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({ showDropdownMenu, onClose, searchValue, onSearch }) => {
  const { t } = useTranslation();
  const { data, isLoading: isLoadingSavedSearches } = useSavedSearches();
  const savedSearches = data?.savedSearches as SavedSearchesFieldsFragment[];
  const { parties } = useParties();
  const { searchResults, isFetching } = useSearchDialogs({ parties, searchString: searchValue });
  const formatDistance = useFormatDistance();

  const handleClose = () => {
    onClose?.();
  };

  if (!showDropdownMenu) return <div className={cx(styles.menuItems)} />;

  return (
    <div className={cx(styles.menuItems, { [styles.showDropdownMenu]: showDropdownMenu })}>
      <ul className={styles.menuList}>
        <SearchDropdownItem onClick={() => onSearch(searchValue)} horizontalLine>
          <div className={styles.displayText}>
            {searchValue?.length > 2 ? <span className={styles.searchTermText}>{`«${searchValue}»`}</span> : 'Alt'} i
            innboks
          </div>
          <div className={styles.rightContent}>
            <span className={styles.keyText}>Return</span>
            <ChevronRightIcon fontSize={24} className={styles.arrowIcon} />
          </div>
        </SearchDropdownItem>

        {/* Search results: */}
        {isFetching ? (
          <SearchDropdownSkeleton numberOfItems={3} />
        ) : (
          searchResults?.slice(0, 5).map((item) => (
            <SearchDropdownItem key={item.id}>
              <InboxItem
                key={item.id}
                checkboxValue={item.id}
                title={item.title}
                toLabel={t('word.to')}
                description={item.description}
                sender={item.sender}
                receiver={item.receiver}
                tags={item.tags}
                linkTo={item.linkTo}
                onClose={() => handleClose()}
                isMinimalistic
              />
              <div className={cx(styles.rightContent)}>
                <span className={styles.timeSince}>{autoFormatRelativeTime(new Date(item.date), formatDistance)}</span>
                <Avatar
                  name={item.sender.name}
                  companyName={item.sender.isCompany ? item.sender.name : ''}
                  imageUrl={item.sender.imageURL}
                  size="small"
                />
              </div>
            </SearchDropdownItem>
          ))
        )}

        {/* Saved searches: */}
        {!searchResults?.length && (
          <>
            <SearchDropdownItem>
              <div className={styles.displayText}>{t('sidebar.saved_searches')}</div>
            </SearchDropdownItem>
            {!isLoadingSavedSearches &&
              savedSearches?.map((search) => (
                <SearchDropdownItem key={search.id}>
                  <div className={styles.searchDetails}>
                    <span className={styles.searchString}>
                      {search.data?.searchString && `«${search.data.searchString}»`}
                    </span>
                    {search.data?.searchString && `${search.data.filters?.length ? ' + ' : ''}`}
                    {search.data?.filters?.map((search, index) => {
                      return (
                        <SearchFilterTag
                          key={`${search?.id}${index}`}
                          searchValue={search?.value}
                          searchId={search?.id}
                          index={index}
                        />
                      );
                    })}
                  </div>
                  <OpenSavedSearchLink savedSearch={search} onClick={handleClose} />
                </SearchDropdownItem>
              ))}
          </>
        )}
      </ul>
    </div>
  );
};
