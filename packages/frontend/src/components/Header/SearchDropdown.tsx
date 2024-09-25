import { ChevronRightIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useSearchDialogs } from '../../api/useDialogs';
import { useParties } from '../../api/useParties';
import { useFormatDistance } from '../../i18n/useDateFnsLocale.tsx';
import SearchFilterTag from '../../pages/SavedSearches/SearchFilterTag/SearchFilterTag.tsx';
import { autoFormatRelativeTime } from '../../pages/SavedSearches/searchUtils.ts';
import { useSavedSearches } from '../../pages/SavedSearches/useSavedSearches.ts';
import { Avatar } from '../Avatar';
import { PlusIcon } from '../Icons/PlusIcon/PlusIcon.tsx';
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
  const { savedSearches, isLoading: isLoadingSavedSearches } = useSavedSearches();
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
            {searchValue?.length > 2 ? <span className={styles.searchTermText}>{`«${searchValue}»`}</span> : 'Alt'}{' '}
            {t('search.title.in_inbox')}
          </div>
          <div className={styles.rightContent}>
            <span className={styles.keyText}>Return</span>
            <ChevronRightIcon fontSize="1.5rem" className={styles.arrowIcon} />
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
                summary={item.summary}
                sender={item.sender}
                receiver={item.receiver}
                metaFields={item.metaFields}
                linkTo={item.linkTo}
                onClose={() => handleClose()}
                isUnread={!item.isSeenByEndUser}
                isMinimalistic
              />
              <div className={cx(styles.rightContent)}>
                <span className={styles.timeSince}>
                  {autoFormatRelativeTime(new Date(item.updatedAt), formatDistance)}
                </span>
                <Avatar
                  name={item.sender.name}
                  profile={item.sender.isCompany ? 'organization' : 'person'}
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
              <div className={styles.displayText}>{t('savedSearches.title', { count: savedSearches?.length })}</div>
            </SearchDropdownItem>
            {!isLoadingSavedSearches &&
              savedSearches?.map((search) => {
                const { searchString, filters, fromView } = search.data;
                const queryParams = new URLSearchParams({
                  ...(searchString && { search: searchString }),
                  ...(filters?.length && { filters: JSON.stringify(filters) }),
                });
                return (
                  <a href={`${fromView}?${queryParams.toString()}`} key={search.id} className={styles.isLink}>
                    <SearchDropdownItem>
                      {search.name ? (
                        <div className={styles.savedSearchItem}>
                          <div className={styles.searchDetails}>{search.name}</div>
                        </div>
                      ) : (
                        <div className={styles.savedSearchItem}>
                          <div className={styles.searchDetails}>
                            <span className={styles.searchString}>
                              {search.data?.searchString && `«${search.data.searchString}»`}
                            </span>
                            {search.data?.searchString && search.data?.filters && search.data?.filters?.length > 0 && (
                              <PlusIcon />
                            )}
                            {search.data?.filters?.map((filter, index) => {
                              return (
                                <SearchFilterTag
                                  key={`${filter?.id}${index}`}
                                  searchValue={filter?.value}
                                  searchId={filter?.id}
                                  isLastItem={search.data?.filters?.length === index + 1}
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </SearchDropdownItem>
                  </a>
                );
              })}
          </>
        )}
      </ul>
    </div>
  );
};
