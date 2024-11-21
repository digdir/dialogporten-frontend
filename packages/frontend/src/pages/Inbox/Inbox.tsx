import { ArrowForwardIcon, ClockDashedIcon, EnvelopeOpenIcon, TrashIcon } from '@navikt/aksel-icons';
import { useQueryClient } from '@tanstack/react-query';
import type { DialogStatus, SavedSearchData, SearchDataValueFilter, SystemLabel } from 'bff-types-generated';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router-dom';
import { createSavedSearch } from '../../api/queries.ts';
import type { Participant } from '../../api/useDialogById.tsx';
import { type InboxViewType, getViewType, useDialogs, useSearchDialogs } from '../../api/useDialogs.tsx';
import { useParties } from '../../api/useParties.ts';
import type { InboxItemMetaField } from '../../components';
import {
  ActionPanel,
  type Filter,
  FilterBar,
  InboxItem,
  InboxItems,
  PartyDropdown,
  useSearchString,
  useSelectedDialogs,
  useSnackbar,
} from '../../components';
import type { FilterBarRef } from '../../components/FilterBar/FilterBar.tsx';
import { FosToolbar } from '../../components/FosToolbar';
import { InboxItemsHeader } from '../../components/InboxItem/InboxItemsHeader.tsx';
import { SaveSearchButton } from '../../components/SavedSearchButton/SaveSearchButton.tsx';
import { QUERY_KEYS } from '../../constants/queryKeys.ts';
import { FeatureFlagKeys, useFeatureFlag } from '../../featureFlags';
import { useFormat } from '../../i18n/useDateFnsLocale.tsx';
import { InboxSkeleton } from './InboxSkeleton.tsx';
import { filterDialogs, getFilterBarSettings } from './filters.ts';
import styles from './inbox.module.css';
import { clearFiltersInQueryParams, getFiltersFromQueryParams } from './queryParams.ts';

interface InboxProps {
  viewType: InboxViewType;
}

export enum Routes {
  inbox = '/',
  inboxItem = '/inbox/:id',
  sent = '/sent',
  drafts = '/drafts',
  savedSearches = '/saved-searches',
  archive = '/archive',
  bin = '/bin',
}

export interface InboxItemInput {
  id: string;
  party: string;
  title: string;
  summary: string;
  sender: Participant;
  receiver: Participant;
  metaFields: InboxItemMetaField[];
  createdAt: string;
  updatedAt: string;
  status: DialogStatus;
  isSeenByEndUser: boolean;
  label: SystemLabel;
}

interface DialogCategory {
  label: string;
  id: string;
  items: InboxItemInput[];
}

export const Inbox = ({ viewType }: InboxProps) => {
  const format = useFormat();
  const filterBarRef = useRef<FilterBarRef>(null);
  const queryClient = useQueryClient();

  const disableBulkActions = useFeatureFlag<boolean>(FeatureFlagKeys.DisableBulkActions);

  const location = useLocation();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { selectedItems, setSelectedItems, selectedItemCount, inSelectionMode } = useSelectedDialogs();
  const { openSnackbar } = useSnackbar();
  const [isSavingSearch, setIsSavingSearch] = useState<boolean>(false);

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
    return filterDialogs(dataSource, activeFilters, format);
  }, [dataSource, activeFilters]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  useEffect(() => {
    setActiveFilters([]);
    clearFiltersInQueryParams();
    filterBarRef.current?.resetFilters();
  }, [selectedParties]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  useEffect(() => {
    setInitialFilters(getFiltersFromQueryParams(searchParams));
  }, [location.pathname]);

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

    const areNotInInbox = itemsToDisplay.every((d) => ['drafts', 'sent', 'bin', 'archive'].includes(getViewType(d)));
    if (!shouldShowSearchResults && areNotInInbox) {
      return [
        {
          label: t(`inbox.heading.title.${viewType}`, { count: itemsToDisplay.length }),
          id: viewType,
          items: itemsToDisplay,
        },
      ];
    }

    return itemsToDisplay.reduce((acc, item, _, list) => {
      const createdAt = new Date(item.createdAt);
      const viewType = getViewType(item);
      const key = shouldShowSearchResults
        ? viewType
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
        urn: selectedParties.map((party) => party.party) as string[],
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
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAVED_SEARCHES] });
    }
  };

  const handleCheckedChange = (checkboxValue: string, checked: boolean) => {
    setSelectedItems((prev: Record<string, boolean>) => ({
      ...prev,
      [checkboxValue]: checked,
    }));
  };

  const filterBarSettings = useMemo(
    () => getFilterBarSettings(dataSource, format).filter((setting) => setting.options.length > 1),
    [dataSource, format],
  );

  const savedSearchDisabled = !activeFilters?.length && !searchString;
  const showFilterButton = filterBarSettings.length > 0;

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
              <PartyDropdown counterContext={viewType} />
            </div>
          </div>
        </section>
        <InboxItemsHeader title={t(`inbox.heading.no_results.${viewType}`)} />
      </main>
    );
  }

  return (
    <main>
      <section className={styles.filtersArea}>
        <div className={styles.gridContainer}>
          <div className={styles.filterSaveContainer}>
            <PartyDropdown counterContext={viewType} />
            <FilterBar
              ref={filterBarRef}
              settings={filterBarSettings}
              onFilterChange={setActiveFilters}
              initialFilters={initialFilters}
              addFilterBtnClassNames={styles.hideForSmallScreens}
              resultsCount={itemsToDisplay.length}
            />
            <SaveSearchButton
              onBtnClick={handleSaveSearch}
              className={styles.hideForSmallScreens}
              disabled={savedSearchDisabled}
              isLoading={isSavingSearch}
              activeFilters={activeFilters}
            />
          </div>
        </div>
        <FosToolbar
          onFilterBtnClick={
            showFilterButton
              ? () => {
                  filterBarRef?.current?.openFilter();
                }
              : undefined
          }
          onSaveBtnClick={handleSaveSearch}
          hideSaveButton={savedSearchDisabled}
        />
      </section>
      {inSelectionMode && !disableBulkActions && (
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
                  summary={item.summary}
                  sender={item.sender}
                  receiver={item.receiver}
                  isUnread={!item.isSeenByEndUser}
                  isChecked={selectedItems[item.id]}
                  onCheckedChange={(checked) => handleCheckedChange(item.id, checked)}
                  metaFields={item.metaFields}
                  viewType={viewType}
                  linkTo={`/inbox/${item.id}/${location.search}`}
                />
              ))}
            </InboxItems>
          );
        })}
      </section>
    </main>
  );
};
