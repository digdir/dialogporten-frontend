import { t } from 'i18next';
import type { Participant } from '../../api/useDialogById.tsx';
import type { Filter, FilterSetting } from '../../components/FilterBar/FilterBar.tsx';
import {
  countOccurrences,
  generateDateOptions,
  getPredefinedRange,
  isCombinedDateAndInterval,
} from '../../components/FilterBar/dateInfo.ts';
import type { InboxItemInput } from '../../components/InboxItem/InboxItem.tsx';
import type { FormatFunction } from '../../i18n/useDateFnsLocale.tsx';

/**
 * Filters dialogs based on active filters.
 *
 * @param {InboxItemInput[]} dialogs - The array of dialogs to filter.
 * @param {Array} activeFilters - The array of active filter objects, where each filter has an 'id' and a 'value'.
 * @param format
 * @returns {InboxItemInput[]} - The filtered array of dialogs.
 */

export const filterDialogs = (
  dialogs: InboxItemInput[],
  activeFilters: Filter[],
  format: FormatFunction,
): InboxItemInput[] => {
  if (!activeFilters.length) {
    return dialogs;
  }

  // Group filters by their IDs to apply OR logic within the same ID group
  const filtersById = activeFilters.reduce(
    (acc, filter) => {
      if (!acc[filter.id]) {
        acc[filter.id] = [];
      }
      acc[filter.id].push(filter);
      return acc;
    },
    {} as Record<string, typeof activeFilters>,
  );

  return dialogs.filter((item) => {
    // Apply AND logic across different filter ID groups
    return Object.keys(filtersById).every((filterId) => {
      const filters = filtersById[filterId];
      // Apply OR logic within each filter ID group
      return filters.some((filter) => {
        if (filter.id === 'sender' || filter.id === 'receiver') {
          const participant = item[filter.id as keyof InboxItemInput] as Participant;
          return filter.value === participant.name;
        }
        if (filter.id === 'updated') {
          const rangeProperties = getPredefinedRange().find((range) => range.value === filter.value);
          const { isDate, endDate, startDate } = isCombinedDateAndInterval(
            rangeProperties?.range ?? (filter.value as string),
            format,
          );

          if (isDate) {
            if (startDate && endDate) {
              return new Date(item.updatedAt) >= startDate && new Date(item.updatedAt) <= endDate;
            }
            if (startDate) {
              return new Date(item.updatedAt) >= startDate;
            }
            return true;
          }
          return new Date(filter.value as string).toDateString() === new Date(item.updatedAt).toDateString();
        }
        return filter.value === item[filter.id as keyof InboxItemInput];
      });
    });
  });
};

export enum FilterBarIds {
  SENDER = 'sender',
  RECEIVER = 'receiver',
  STATUS = 'status',
  UPDATED = 'updated',
}

/**
 * Generates filter settings for the filter bar.
 *
 * @param {InboxItemInput[]} dialogs - The array of dialogs to filter.
 * @param {Array} activeFilters - The array of active filter objects, where each filter has an 'id' and a 'value'.
 * @param format
 * @returns {Array} - The array of filter settings.
 */
export const getFilterBarSettings = (
  dialogs: InboxItemInput[],
  activeFilters: Filter[],
  format: FormatFunction,
): FilterSetting[] => {
  return [
    {
      id: FilterBarIds.SENDER,
      label: t('filter_bar.label.sender'),
      unSelectedLabel: t('filter_bar.label.all_senders'),
      mobileNavLabel: t('filter_bar.label.choose_sender'),
      operation: 'includes',
      options: (() => {
        const otherFilters = activeFilters.filter((activeFilter) => activeFilter.id !== 'sender');
        const filteredDialogs = filterDialogs(dialogs, otherFilters, format);
        const senders = filteredDialogs.map((p) => p.sender.name);
        const senderCounts = countOccurrences(senders);

        return Array.from(new Set(senders)).map((sender) => ({
          displayLabel: `${t('filter_bar_fields.from')} ${sender}`,
          value: sender,
          count: senderCounts[sender] ?? 0,
        }));
      })(),
    },
    {
      id: FilterBarIds.RECEIVER,
      label: t('filter_bar.label.recipient'),
      unSelectedLabel: t('filter_bar.label.all_recipients'),
      mobileNavLabel: t('filter_bar.label.choose_recipient'),
      operation: 'includes',
      options: (() => {
        const otherFilters = activeFilters.filter((activeFilter) => activeFilter.id !== 'receiver');
        const filteredDialogs = filterDialogs(dialogs, otherFilters, format);

        const receivers = filteredDialogs.map((p) => p.receiver.name);
        const receiversCount = countOccurrences(receivers);
        return Array.from(new Set(receivers)).map((receiver) => ({
          displayLabel: `${t('filter_bar_fields.to')} ${receiver}`,
          value: receiver,
          count: receiversCount[receiver] ?? 0,
        }));
      })(),
    },
    {
      id: FilterBarIds.STATUS,
      label: t('filter_bar.label.status'),
      unSelectedLabel: t('filter_bar.label.all_statuses'),
      mobileNavLabel: t('filter_bar.label.choose_status'),
      operation: 'includes',
      horizontalRule: true,
      options: (() => {
        const otherFilters = activeFilters.filter((activeFilter) => activeFilter.id !== 'status');
        const filteredDialogs = filterDialogs(dialogs, otherFilters, format);

        const status = filteredDialogs.map((p) => p.status);
        const statusCount = countOccurrences(status);

        return Array.from(new Set(status)).map((statusLabel) => ({
          displayLabel: t(`status.${statusLabel.toLowerCase()}`),
          value: statusLabel,
          count: statusCount[statusLabel] ?? 0,
        }));
      })(),
    },
    {
      id: FilterBarIds.UPDATED,
      label: t('filter_bar.label.updated'),
      mobileNavLabel: t('filter_bar.label.choose_date'),
      unSelectedLabel: t('filter_bar.label.all_dates'),
      operation: 'equals',
      options: generateDateOptions(
        dialogs.map((p) => new Date(p.updatedAt)),
        format,
      ),
    },
  ];
};

export const createFiltersURLQuery = (activeFilters: Filter[], allFilterKeys: string[], baseURL: string): URL => {
  const url = new URL(baseURL);

  for (const filter of allFilterKeys) {
    url.searchParams.delete(filter);
  }

  for (const filter of activeFilters.filter((filter) => typeof filter.value !== 'undefined')) {
    url.searchParams.append(filter.id, String(filter.value));
  }
  return url;
};

export const readFiltersFromURLQuery = (query: string): Filter[] => {
  const searchParams = new URLSearchParams(query);
  const allowedFilterKeys = Object.values(FilterBarIds) as string[];
  const filters: Filter[] = [];
  searchParams.forEach((value, key) => {
    if (allowedFilterKeys.includes(key)) {
      filters.push({ id: key, value });
    }
  });
  return filters;
};
