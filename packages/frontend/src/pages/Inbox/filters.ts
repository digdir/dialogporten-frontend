import { t } from 'i18next';
import type { Participant } from '../../components';
import type { Filter, FilterSetting } from '../../components/FilterBar/FilterBar.tsx';
import {
  countOccurrences,
  generateDateOptions,
  getPredefinedRange,
  isCombinedDateAndInterval,
} from '../../components/FilterBar/dateInfo.ts';
import type { FormatFunction } from '../../i18n/useDateFnsLocale.tsx';
import type { InboxItemInput } from './Inbox.tsx';

/**
 * Filters dialogs based on active filters.
 *
 * @param {InboxItemInput[]} dialogs - The array of dialogs to filter.
 * @param {Array} activeFilters - The array of active filter objects, where each filter has an 'id' and a 'value'.
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
          return filter.value === participant.label;
        }
        if (filter.id === 'created') {
          const rangeProperties = getPredefinedRange().find((range) => range.value === filter.value);
          const { isDate, endDate, startDate } = isCombinedDateAndInterval(
            rangeProperties?.range ?? (filter.value as string),
            format,
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
      });
    });
  });
};

export const getFilterBarSettings = (dialogs: InboxItemInput[], format: FormatFunction): FilterSetting[] => {
  return [
    {
      id: 'sender',
      label: t('filter_bar.label.sender'),
      unSelectedLabel: t('filter_bar.label.all_senders'),
      mobileNavLabel: t('filter_bar.label.choose_sender'),
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
      mobileNavLabel: t('filter_bar.label.choose_recipient'),
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
      mobileNavLabel: t('filter_bar.label.choose_status'),
      operation: 'includes',
      horizontalRule: true,
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
      mobileNavLabel: t('filter_bar.label.choose_date'),
      unSelectedLabel: t('filter_bar.label.all_dates'),
      operation: 'equals',
      options: generateDateOptions(
        dialogs.map((p) => new Date(p.createdAt)),
        format,
      ),
    },
  ];
};
