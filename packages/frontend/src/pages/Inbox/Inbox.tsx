import { ArrowForwardIcon, ClockDashedIcon, EnvelopeOpenIcon, TrashIcon } from '@navikt/aksel-icons';
import type { DialogStatus, SavedSearchData, SearchDataValueFilter } from 'bff-types-generated';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router-dom';
import { createSavedSearch } from '../../api/queries.ts';
import { type InboxViewType, getViewType, useDialogs, useSearchDialogs } from '../../api/useDialogs.tsx';
import { useParties } from '../../api/useParties.ts';
import {
  ActionPanel,
  InboxItem,
  type InboxItemTag,
  InboxItems,
  type Participant,
  SortOrderDropdown,
  useSearchString,
} from '../../components';
import { type Filter, FilterBar } from '../../components';
import { useSelectedDialogs } from '../../components';
import { useSnackbar } from '../../components';
import type { FilterBarRef } from '../../components/FilterBar/FilterBar.tsx';
import { FosToolbar } from '../../components/FosToolbar';
import { InboxItemsHeader } from '../../components/InboxItem/InboxItemsHeader.tsx';
import { PartyDropdown } from '../../components/PartyDropdown';
import { SaveSearchButton } from '../../components/SavedSearchButton/SaveSearchButton.tsx';
import type { SortOrderDropdownRef, SortingOrder } from '../../components/SortOrderDropdown/SortOrderDropdown.tsx';
import { useFormat } from '../../i18n/useDateFnsLocale.tsx';
import { InboxSkeleton } from './InboxSkeleton.tsx';
import { filterDialogs, getFilterBarSettings } from './filters.ts';
import styles from './inbox.module.css';
import { getFiltersFromQueryParams, getSortingOrderFromQueryParams } from './queryParams.ts';

interface InboxProps {
  viewType: InboxViewType;
}

export enum Routes {
  inbox = '/',
  sent = '/sent',
  draft = '/drafts',
  savedSearches = '/saved-searches',
  archive = '/archive',
  deleted = '/deleted',
}

export interface InboxItemInput {
  id: string;
  party: string;
  title: string;
  description: string;
  sender: Participant;
  receiver: Participant;
  tags: InboxItemTag[];
  linkTo: string;
  date: string;
  createdAt: string;
  status: DialogStatus;
  isModifiedLastByServiceOwner: boolean;
  isSeenByEndUser: boolean;
}
interface DialogCategory {
  label: string;
  id: string;
  items: InboxItemInput[];
}

const sortDialogs = (dialogs: InboxItemInput[], sortOrder: SortingOrder): InboxItemInput[] => {
  return dialogs.sort((a, b) => {
    if (sortOrder === 'created_desc') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
};

export const Inbox = ({ viewType }: InboxProps) => {
  const format = useFormat();
  const filterBarRef = useRef<FilterBarRef>(null);
  const sortOrderDropdownRef = useRef<SortOrderDropdownRef>(null);

  const location = useLocation();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedItems, setSelectedItems, selectedItemCount, inSelectionMode } = useSelectedDialogs();
  const { openSnackbar } = useSnackbar();
  const [isSavingSearch, setIsSavingSearch] = useState<boolean>(false);
  const [selectedSortOrder, setSelectedSortOrder] = useState<SortingOrder>('created_desc');

  const { selectedParties } = useParties();
  const { searchString } = useSearchString();
  const [initialFilters, setInitialFilters] = useState<Filter[]>([]);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);

  const { searchResults, isFetching: isFetchingSearchResults } = useSearchDialogs({
    parties: selectedParties,
    searchString,
  });

  const { dialogsByView, isLoading: isLoadingDialogs, isSuccess: dialogsIsSuccess } = useDialogs(selectedParties);
  const dialogsForView = dialogsByView[viewType];

  const showingSearchResults = searchString.length > 0;
  const dataSource = showingSearchResults ? searchResults : dialogsForView;

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  const itemsToDisplay = useMemo(() => {
    return sortDialogs(filterDialogs(dataSource, activeFilters, format), selectedSortOrder);
  }, [dataSource, activeFilters, selectedSortOrder]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  useEffect(() => {
    setInitialFilters(getFiltersFromQueryParams(searchParams));
    const sortBy = getSortingOrderFromQueryParams(searchParams);
    if (sortBy && sortBy !== selectedSortOrder) {
      setSelectedSortOrder(getSortingOrderFromQueryParams(searchParams));
    }
  }, [location.pathname]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('sortBy', selectedSortOrder);
    setSearchParams(newSearchParams);
  }, [selectedSortOrder]);

  const shouldShowSearchResults = !isFetchingSearchResults && showingSearchResults;

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  useEffect(() => {
    if (showingSearchResults && activeFilters.length) {
      filterBarRef.current?.resetFilters();
    }
  }, [showingSearchResults]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  const dialogsGroupedByCategory: DialogCategory[] = useMemo(() => {
    const allWithinSameYear = itemsToDisplay.every(
      (d) => new Date(d.createdAt).getFullYear() === new Date().getFullYear(),
    );

    return itemsToDisplay.reduce((acc, item, _, list) => {
      const createdAt = new Date(item.createdAt);
      const key = shouldShowSearchResults
        ? getViewType(item)
        : allWithinSameYear
          ? format(createdAt, 'LLLL')
          : format(createdAt, 'yyyy');

      const label = shouldShowSearchResults
        ? t(`inbox.heading.search_results.${key}`, { count: list.filter((i) => getViewType(i) === key).length })
        : key;

      const existingCategory = acc.find((c) => c.id === key);

      if (existingCategory) {
        existingCategory.items.push(item);
      } else {
        acc.push({ label, id: key, items: [item] });
      }

      return acc;
    }, [] as DialogCategory[]);
  }, [itemsToDisplay, shouldShowSearchResults]);

  const handleSaveSearch = async () => {
    try {
      const data: SavedSearchData = {
        filters: activeFilters as SearchDataValueFilter[],
        searchString,
        fromView: Routes[viewType],
      };
      setIsSavingSearch(true);
      await createSavedSearch('', data);
      openSnackbar({
        message: t('savedSearches.saved_success'),
        variant: 'success',
      });
    } catch (error) {
      openSnackbar({
        message: t('savedSearches.saved_error'),
        variant: 'error',
      });
      console.error('Error creating saved search: ', error);
    } finally {
      setIsSavingSearch(false);
    }
  };

  const handleCheckedChange = (checkboxValue: string, checked: boolean) => {
    setSelectedItems((prev: Record<string, boolean>) => ({
      ...prev,
      [checkboxValue]: checked,
    }));
  };

  const filterBarSettings = useMemo(() => getFilterBarSettings(itemsToDisplay, format), [itemsToDisplay, format]);

  const savedSearchDisabled = !activeFilters?.length && !searchString;

  if (isFetchingSearchResults) {
    return (
      <main>
        <InboxSkeleton numberOfItems={3} />
      </main>
    );
  }

  if (isLoadingDialogs) {
    return (
      <main>
        <InboxSkeleton numberOfItems={5} withHeader />
      </main>
    );
  }

  if (itemsToDisplay.length === 0 && dialogsIsSuccess) {
    return (
      <main>
        <section className={styles.filtersArea}>
          <div className={styles.gridContainer}>
            <div className={styles.filterSaveContainer}>
              <PartyDropdown />
            </div>
          </div>
        </section>
        <InboxItemsHeader title={t('inbox.heading.no_results')} />
      </main>
    );
  }

  return (
    <main>
      <section className={styles.filtersArea}>
        <div className={styles.gridContainer}>
          <div className={styles.filterSaveContainer}>
            <PartyDropdown />
            <FilterBar
              ref={filterBarRef}
              settings={filterBarSettings}
              onFilterChange={setActiveFilters}
              initialFilters={initialFilters}
              addFilterBtnClassNames={styles.hideForSmallScreens}
              nResults={itemsToDisplay.length}
            />
            <SaveSearchButton
              onBtnClick={handleSaveSearch}
              className={styles.hideForSmallScreens}
              disabled={savedSearchDisabled}
              isLoading={isSavingSearch}
            />
          </div>
          <div className={styles.sortOrderContainer}>
            <SortOrderDropdown
              ref={sortOrderDropdownRef}
              onSelect={setSelectedSortOrder}
              selectedSortOrder={selectedSortOrder}
              btnClassName={styles.hideForSmallScreens}
            />
          </div>
        </div>
        <FosToolbar
          onFilterBtnClick={() => {
            filterBarRef?.current?.openFilter();
          }}
          onSortBtnClick={() => {
            sortOrderDropdownRef?.current?.openSortOrder();
          }}
          onSaveBtnClick={handleSaveSearch}
          hideSaveButton={savedSearchDisabled}
        />
      </section>
      {inSelectionMode && (
        <ActionPanel
          actionButtons={[
            {
              label: t('actionPanel.buttons.share'),
              icon: <ArrowForwardIcon />,
              onClick: () => {
                openSnackbar({ message: 'del clicked', variant: 'success' });
                setSelectedItems({});
              },
            },
            {
              label: t('actionPanel.buttons.mark_as_read'),
              icon: <EnvelopeOpenIcon />,
              onClick: () => {
                openSnackbar({ message: 'read clicked', variant: 'success' });
                setSelectedItems({});
              },
            },
            {
              label: t('actionPanel.buttons.archive'),
              icon: <ClockDashedIcon />,
              onClick: () => {
                openSnackbar({ message: 'arkiv clicked', variant: 'success' });
                setSelectedItems({});
              },
            },
            {
              label: t('actionPanel.buttons.delete'),
              icon: <TrashIcon />,
              onClick: () => {
                openSnackbar({ message: 'delete clicked', variant: 'success' });
                setSelectedItems({});
              },
            },
          ]}
          selectedItemCount={selectedItemCount}
          onUndoSelection={() => setSelectedItems({})}
        />
      )}
      <section>
        {dialogsGroupedByCategory.map(({ id, label, items }) => {
          const hideSelectAll = items.every((item) => selectedItems[item.id]);
          return (
            <InboxItems key={id}>
              <InboxItemsHeader
                hideSelectAll={hideSelectAll}
                onSelectAll={() => {
                  const newItems = Object.fromEntries(items.map((item) => [item.id, true]));
                  setSelectedItems({
                    ...selectedItems,
                    ...newItems,
                  });
                }}
                title={label}
              />
              {items.map((item) => (
                <InboxItem
                  key={item.id}
                  checkboxValue={item.id}
                  title={item.title}
                  toLabel={t('word.to')}
                  description={item.description}
                  sender={item.sender}
                  receiver={item.receiver}
                  isChecked={selectedItems[item.id]}
                  onCheckedChange={(checked) => handleCheckedChange(item.id, checked)}
                  tags={item.tags}
                  linkTo={item.linkTo}
                />
              ))}
            </InboxItems>
          );
        })}
      </section>
    </main>
  );
};
