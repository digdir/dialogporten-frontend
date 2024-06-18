import { ArrowForwardIcon, ClockDashedIcon, EnvelopeOpenIcon, TrashIcon } from '@navikt/aksel-icons';
import type { DialogStatus, SavedSearchData, SearchDataValueFilter } from 'bff-types-generated';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
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
import { InboxItemsHeader } from '../../components/InboxItem/InboxItemsHeader.tsx';
import { SaveSearchButton } from '../../components/SavedSearchButton/SaveSearchButton.tsx';
import { filterDialogs, getFilterBarSettings } from './filters.ts';
import styles from './inbox.module.css';

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

export const decompressQueryParams = (compressedString: string): SavedSearchData => {
  const decompressedString = decompressFromEncodedURIComponent(compressedString);
  if (!decompressedString) {
    throw new Error('Decompression failed');
  }
  return JSON.parse(decompressedString);
};

export const getFiltersFromQueryParams = (): Filter[] => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const compressedData = urlSearchParams.get('data');

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

export const getSearchStringFromQueryParams = (): string => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const compressedData = urlSearchParams.get('data');

  if (compressedData) {
    try {
      const queryParams = decompressQueryParams(compressedData);
      return queryParams.searchString || '';
    } catch (error) {
      console.error('Failed to decompress query parameters:', error);
    }
  }
  return '';
};

export const Inbox = ({ viewType }: InboxProps) => {
  const { t } = useTranslation();
  const [selectedSortOrder, setSelectedSortOrder] = useState<string>('created_desc');
  const { selectedItems, setSelectedItems, selectedItemCount, inSelectionMode } = useSelectedDialogs();
  const location = useLocation();
  const { parties } = useParties();
  const { dialogsByView, dialogs } = useDialogs(parties);
  const { searchString, queryClient } = useSearchString();
  const { searchResults, isFetching } = useSearchDialogs({
    parties,
    searchString,
  });
  const { openSnackbar } = useSnackbar();
  const dialogsForView = dialogsByView[viewType];
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);

  /*
      Todo: There are now many competing lists for dialogs as data source for the output of this component. This needs to be cleaned up.
      items, searchResults, filteredDialogsForView, dialogsForView, dialogs, ...
      Search should include filters, update of filters should refetch search results.
   */

  useEffect(() => {
    setActiveFilters(getFiltersFromQueryParams());
  }, [location]);

  const handleSaveSearch = async () => {
    try {
      const data: SavedSearchData = {
        filters: activeFilters as SearchDataValueFilter[],
        searchString,
      };
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
    }
  };

  const filteredDialogsForView = useMemo(() => {
    return filterDialogs(dialogsForView, activeFilters);
  }, [dialogsForView, activeFilters]);

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
  const filteredView = !isFetching && ((searchString ?? []).length > 0 || activeFilters.length > 0);
  const sortOrderOptions = [
    {
      id: 'created_desc',
      label: t('sort_order.created_desc'),
    },
    {
      id: 'created_asc',
      label: t('sort_order.created_asc'),
    },
  ];

  return (
    <main>
      <section className={styles.filtersArea}>
        <div className={styles.leftArea}>
          <FilterBar settings={filterBarSettings} onFilterChange={setActiveFilters} initialFilters={activeFilters} />
          <SaveSearchButton onBtnClick={handleSaveSearch} disabled={savedSearchDisabled} />
        </div>
        <div className={styles.rightArea}>
          <SortOrderDropdown
            onSelect={setSelectedSortOrder}
            selectedSortOrder={selectedSortOrder}
            options={sortOrderOptions}
          />
        </div>
      </section>
      {inSelectionMode && (
        <ActionPanel
          actionButtons={[
            {
              label: t('actionPanel.buttons.share'),
              icon: <ArrowForwardIcon />,
            },
            {
              label: t('actionPanel.buttons.mark_as_read'),
              icon: <EnvelopeOpenIcon />,
            },
            {
              label: t('actionPanel.buttons.archive'),
              icon: <ClockDashedIcon />,
            },
            {
              label: t('actionPanel.buttons.delete'),
              icon: <TrashIcon />,
            },
          ]}
          selectedItemCount={selectedItemCount}
          onUndoSelection={() => setSelectedItems({})}
        />
      )}
      <section>
        {isFetching ? <p>Spinner</p> : filteredView && <h2>{t('search.search.results', { count: items.length })}</h2>}
        {/* TODO: Replace with actual spinner */}
        {Object.entries(dataGroupedByYear)
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
            );
          })}
      </section>
    </main>
  );
};
