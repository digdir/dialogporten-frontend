import { ArrowForwardIcon, ClockDashedIcon, EnvelopeOpenIcon, TrashIcon } from '@navikt/aksel-icons';
import { DialogStatus, SavedSearchData, SearchDataValueFilter } from 'bff-types-generated';
import { t } from 'i18next';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { createSavedSearch } from '../../api/queries.ts';
import { InboxViewType, useDialogs, useSearchDialogs } from '../../api/useDialogs.tsx';
import { useParties } from '../../api/useParties.ts';
import { ActionPanel, InboxItem, InboxItemTag, InboxItems, Participant, useSearchString } from '../../components';
import { type Filter, FilterBar } from '../../components';
import { useSelectedDialogs } from '../../components';
import { FilterSetting } from '../../components/FilterBar/FilterBar.tsx';
import { SaveSearchButton } from '../../components/FilterBar/SaveSearchButton.tsx';
import {
  countOccurrences,
  generateDateOptions,
  getPredefinedRange,
  isCombinedDateAndInterval,
} from '../../components/FilterBar/dateInfo.ts';
import { InboxItemsHeader } from '../../components/InboxItem/InboxItemsHeader.tsx';
import { useSnackbar } from '../../components/Snackbar/useSnackbar.ts';
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

const getFilterBarSettings = (dialogs: InboxItemInput[]): FilterSetting[] => {
  return [
    {
      id: 'sender',
      label: t('filter_bar.label.sender'),
      unSelectedLabel: t('filter_bar.label.all_senders'),
      operation: 'includes',
      options: (() => {
        const senders = dialogs.map((p) => p.sender.label);
        const senderCounts = countOccurrences(senders);
        return Array.from(new Set(senders)).map((sender) => ({
          displayLabel: `${t('filter_bar_fields.from')} ${sender}`,
          value: sender,
          count: senderCounts[sender],
        }));
      })(),
    },
    {
      id: 'receiver',
      label: t('filter_bar.label.recipient'),
      unSelectedLabel: t('filter_bar.label.all_recipients'),
      operation: 'includes',
      options: (() => {
        const receivers = dialogs.map((p) => p.receiver.label);
        const receiversCount = countOccurrences(receivers);
        return Array.from(new Set(receivers)).map((receiver) => ({
          displayLabel: `${t('filter_bar_fields.to')} ${receiver}`,
          value: receiver,
          count: receiversCount[receiver],
        }));
      })(),
    },
    {
      id: 'status',
      label: t('filter_bar.label.status'),
      unSelectedLabel: t('filter_bar.label.all_statuses'),
      operation: 'includes',
      options: (() => {
        const status = dialogs.map((p) => p.status);
        const statusCount = countOccurrences(status);
        return Array.from(new Set(status)).map((statusLabel) => ({
          displayLabel: t(`dialog.status.${statusLabel.toLowerCase()}`),
          value: statusLabel,
          count: statusCount[statusLabel],
        }));
      })(),
    },
    {
      id: 'created',
      label: t('filter_bar.label.created'),
      unSelectedLabel: t('filter_bar.label.all_dates'),
      operation: 'equals',
      options: generateDateOptions(dialogs),
    },
  ];
};
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
  const { selectedItems, setSelectedItems, selectedItemCount, inSelectionMode } = useSelectedDialogs();
  const location = useLocation();
  const { parties } = useParties();
  const { dialogsByView, dialogs } = useDialogs(parties);
  const { searchString, queryClient } = useSearchString();
  const { searchResults, isFetching } = useSearchDialogs({ parties, searchString });
  const { openSnackbar } = useSnackbar();
  const dialogsForView = dialogsByView[viewType];
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);

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
    return dialogsForView.filter((item) =>
      activeFilters.every((filter) => {
        if (filter.id === 'sender' || filter.id === 'receiver') {
          const participant = item[filter.id as keyof InboxItemInput] as Participant;
          return filter.value === participant.label;
        }
        if (filter.id === 'created') {
          const rangeProperties = getPredefinedRange().find((range) => range.value === filter.value);
          // Section ~ 3.2.6 of ISO 8601-1:2019 specifies that the date and time components are separated by a solidus (/).
          const { isDate, endDate, startDate } = isCombinedDateAndInterval(
            rangeProperties?.range ?? (filter.value as string),
          );

          if (isDate) {
            if (startDate && endDate) {
              return new Date(item.createdAt) >= startDate && new Date(item.createdAt) <= endDate;
            }
            if (startDate) {
              return new Date(item.createdAt) >= startDate;
            }
            return true;
          }
          return new Date(filter.value as string).toDateString() === new Date(item.createdAt).toDateString();
        }
        return filter.value === item[filter.id as keyof InboxItemInput];
      }),
    );
  }, [dialogsForView, activeFilters]);

  const dataGroupedByYear = useMemo(() => {
    const items = (searchString?.length && searchResults) ? searchResults : filteredDialogsForView;
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
  }, [filteredDialogsForView, searchResults, searchString]);

  const handleCheckedChange = (checkboxValue: string, checked: boolean) => {
    setSelectedItems((prev: Record<string, boolean>) => ({
      ...prev,
      [checkboxValue]: checked,
    }));
  };

  const filterBarSettings = getFilterBarSettings(dialogs);
  return (
    <main>
      <section className={styles.filtersArea}>
        <FilterBar
          settings={filterBarSettings}
          onFilterChange={(filters) => {
            setActiveFilters(filters);
          }}
          initialFilters={activeFilters}
        />
        <SaveSearchButton onBtnClick={handleSaveSearch} disabled={!activeFilters?.length && !searchString} />
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
        {isFetching ?
          <p>Spinner</p> :
          !isFetching && !!searchString?.length && <h2>{t('search.search.results', { count: searchResults.length })}</h2>}
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
