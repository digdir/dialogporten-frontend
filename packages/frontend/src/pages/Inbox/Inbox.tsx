import { ArrowForwardIcon, ClockDashedIcon, EnvelopeOpenIcon, TrashIcon } from '@navikt/aksel-icons';
import type { DialogStatus, SavedSearchData, SearchDataValueFilter } from 'bff-types-generated';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router-dom';
import { createSavedSearch } from '../../api/queries.ts';
import { type InboxViewType, useDialogs, useSearchDialogs } from '../../api/useDialogs.tsx';
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
import { SaveSearchButton } from '../../components/SavedSearchButton/SaveSearchButton.tsx';
import type { SortOrderDropdownRef, SortingOrder } from '../../components/SortOrderDropdown/SortOrderDropdown.tsx';
import { filterDialogs, getFilterBarSettings } from './filters.ts';
import styles from './inbox.module.css';
import { InboxSkeleton } from './InboxSkeleton.tsx';

interface InboxProps {
  viewType: InboxViewType;
}

export interface InboxItemInput {
  id: string;
  title: string;
  description: string;
  sender: Participant;
  receiver: Participant;
  tags: InboxItemTag[];
  linkTo: string;
  date: string;
  createdAt: string;
  status: DialogStatus;
}

export const compressQueryParams = (params: SavedSearchData): string => {
  const queryParamsString = JSON.stringify(params);
  return compressToEncodedURIComponent(queryParamsString);
};

export const sortDialogs = (dialogs: InboxItemInput[], sortOrder: SortingOrder): InboxItemInput[] => {
  return dialogs.sort((a, b) => {
    if (sortOrder === 'created_desc') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
};

export const decompressQueryParams = (compressedString: string): SavedSearchData => {
  const decompressedString = decompressFromEncodedURIComponent(compressedString);
  if (!decompressedString) {
    throw new Error('Decompression failed');
  }
  return JSON.parse(decompressedString);
};

export const getFiltersFromQueryParams = (searchParams: URLSearchParams): Filter[] => {
  const compressedData = searchParams.get('data');
  if (compressedData) {
    try {
      const queryParams = decompressQueryParams(compressedData);
      return queryParams.filters as Filter[];
    } catch (error) {
      console.error('Failed to decompress query parameters:', error);
    }
  }
  return [] as Filter[];
};

const getSortingOrderFromQueryParams = (searchParams: URLSearchParams): SortingOrder => {
  return searchParams.get('sortBy') as SortingOrder;
};

export const Inbox = ({ viewType }: InboxProps) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSavingSearch, setIsSavingSearch] = useState<boolean>(false);
  const [selectedSortOrder, setSelectedSortOrder] = useState<SortingOrder>('created_desc');
  const { selectedItems, setSelectedItems, selectedItemCount, inSelectionMode } = useSelectedDialogs();
  const location = useLocation();
  const { parties } = useParties();
  const { dialogsByView, dialogs, isLoading: isLoadingDialogs } = useDialogs(parties);
  const { searchString, queryClient } = useSearchString();
  const { searchResults, isFetching: isFetchingSearchResults } = useSearchDialogs({
    parties,
    searchString,
  });
  const { openSnackbar } = useSnackbar();
  const dialogsForView = dialogsByView[viewType];
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const filterBarRef = useRef<FilterBarRef>(null);
  const sortOrderDropdownRef = useRef<SortOrderDropdownRef>(null);

  /*
      Todo: There are now many competing lists for dialogs as data source for the output of this component. This needs to be cleaned up.
      items, searchResults, filteredDialogsForView, dialogsForView, dialogs, ...
      Search should include filters, update of filters should refetch search results.
   */

  useEffect(() => {
    setActiveFilters(getFiltersFromQueryParams(searchParams));
    const sortBy = getSortingOrderFromQueryParams(searchParams);
    if (sortBy && sortBy !== selectedSortOrder) {
      setSelectedSortOrder(getSortingOrderFromQueryParams(searchParams));
    }
  }, [location.pathname]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('sortBy', selectedSortOrder);
    setSearchParams(newSearchParams);
  }, [selectedSortOrder]);

  const handleSaveSearch = async () => {
    try {
      const data: SavedSearchData = {
        filters: activeFilters as SearchDataValueFilter[],
        searchString,
      };
      setIsSavingSearch(true);
      await createSavedSearch('', data);
      openSnackbar({
        message: t('savedSearches.saved_success'),
        variant: 'success',
      });
      await queryClient.invalidateQueries('savedSearches');
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

  const filteredDialogsForView = useMemo(() => {
    return sortDialogs(filterDialogs(dialogsForView, activeFilters), selectedSortOrder);
  }, [dialogsForView, activeFilters, selectedSortOrder]);

  const items = searchString?.length && searchResults ? searchResults : filteredDialogsForView;

  const dataGroupedByYear = useMemo(() => {
    return items.reduce(
      (acc: Record<string, InboxItemInput[]>, item) => {
        const year = String(new Date(item.date).getFullYear());
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(item);
        return acc;
      },
      {} as Record<string, InboxItemInput[]>,
    );
  }, [filteredDialogsForView, items]);

  const handleCheckedChange = (checkboxValue: string, checked: boolean) => {
    setSelectedItems((prev: Record<string, boolean>) => ({
      ...prev,
      [checkboxValue]: checked,
    }));
  };

  const filterBarSettings = getFilterBarSettings(dialogs);
  const savedSearchDisabled = !activeFilters?.length && !searchString;
  const filteredView = !isFetchingSearchResults && ((searchString ?? []).length > 0 || activeFilters.length > 0);
  const sortOrderOptions = [
    {
      id: 'created_desc' as SortingOrder,
      label: t('sort_order.created_desc'),
    },
    {
      id: 'created_asc' as SortingOrder,
      label: t('sort_order.created_asc'),
    },
  ];

  return (
    <main>
      <section className={styles.filtersArea}>
        <div className={styles.gridContainer}>
          <div className={styles.filterSaveContainer}>
            <FilterBar
              ref={filterBarRef}
              settings={filterBarSettings}
              onFilterChange={setActiveFilters}
              initialFilters={activeFilters}
              addFilterBtnClassNames={styles.hideForSmallScreens}
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
              options={sortOrderOptions}
              btnClassName={styles.hideForSmallScreens}
            />
          </div>
        </div>
      </section>
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
        {isFetchingSearchResults ? <InboxSkeleton numberOfItems={3} /> : filteredView && <h2>{t('search.search.results', { count: items.length })}</h2>}
        {!isLoadingDialogs && Object.keys(dataGroupedByYear).length === 0 &&
          <InboxItemsHeader title={t('inbox.heading.no_results')} />}
        {!isLoadingDialogs ? Object.entries(dataGroupedByYear)
          .reverse()
          .map(([year, items]) => {
            const hideSelectAll = items.every((item) => selectedItems[item.id]);
            return (
              <InboxItems key={year}>
                <InboxItemsHeader
                  hideSelectAll={hideSelectAll}
                  onSelectAll={() => {
                    const newItems = Object.fromEntries(items.map((item) => [item.id, true]));
                    setSelectedItems({
                      ...selectedItems,
                      ...newItems,
                    });
                  }}
                  title={year}
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
            )
          }
          ) : <InboxSkeleton numberOfItems={5} withHeader />}
      </section>
    </main>
  );
};
