import {
  endOfDay,
  endOfMonth,
  endOfToday,
  endOfWeek,
  endOfYear,
  endOfYesterday,
  formatISO,
  startOfDay,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYear,
  startOfYesterday,
} from 'date-fns';

import { t } from 'i18next';
import type { FormatFunction } from '../../i18n/useDateFnsLocale.tsx';
import { CustomFilterValueType } from './FilterBar.tsx';

interface CombinedDateInfo {
  isDate: boolean;
  startDate?: Date;
  endDate?: Date;
  label?: string;
}

/**
 * Parses a label containing a combined date range and returns information about the date range.
 * If the label contains valid dates in the format "startDate/endDate", it returns an object
 * indicating that it's a date range along with a formatted label showing the date range.
 * If the dates are invalid or the label is in an incorrect format, it returns an object
 * indicating that it's not a valid date range.
 *
 * @param {string} label - The label containing the combined date range in the format "startDate/endDate".
 * @param format - Format function
 * @returns {CombinedDateInfo} An object indicating whether the label represents a valid date range and, if so, the formatted date range label.
 */
export const isCombinedDateAndInterval = (label: string, format: FormatFunction): CombinedDateInfo => {
  try {
    const [startDateStr, endDateStr] = label.split('/');
    const startDate = startOfDay(new Date(startDateStr));
    const endDate = endOfDay(new Date(endDateStr));
    const currentYear = new Date().getFullYear();

    const datesAreValid = [startDate, endDate].every((date) => !Number.isNaN(date.getTime()));
    if (!datesAreValid) {
      return { isDate: false };
    }

    const startDay = format(startDate, 'do');
    const endDay = format(endDate, 'do');
    const startMonth = format(startDate, 'MMMM');
    const endMonth = format(endDate, 'MMMM');
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    let formattedLabel = '';

    if (startMonth === endMonth) {
      if (startDay === endDay) {
        formattedLabel = `${startDay} ${startMonth} ${startYear}`;
      } else if (startYear === currentYear) {
        formattedLabel = `${startDay}-${endDay} ${startMonth}`;
      } else if (startYear === endYear) {
        formattedLabel = `${startDay}-${endDay} ${startMonth} ${startYear}`;
      } else {
        formattedLabel = `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
      }
    } else {
      if (startYear === currentYear) {
        formattedLabel = `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
      } else {
        formattedLabel = `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
      }
    }

    return {
      isDate: true,
      label: formattedLabel,
      startDate,
      endDate,
    };
  } catch (e) {
    return {
      isDate: false,
    };
  }
};

const generateRange = (startDate: Date | number | string, endDate: Date | number | string) => {
  return `${formatISO(startDate)}/${formatISO(endDate)}`;
};

export const getPredefinedRange = (): { range: string; label: string; value: string }[] => {
  const now = new Date();
  const todayRange = generateRange(startOfToday(), endOfToday());
  const yesterdayRange = generateRange(startOfYesterday(), endOfYesterday());
  const thisWeekRange = generateRange(startOfWeek(now), endOfWeek(now));
  const thisMonthRange = generateRange(startOfMonth(now), endOfMonth(now));
  const thisYearRange = generateRange(startOfYear(now), endOfYear(now));

  return [
    { label: t('filter_bar.range.today'), value: '$today', range: todayRange },
    { label: t('filter_bar.range.yesterday'), value: '$yesterday', range: yesterdayRange },
    { label: t('filter_bar.range.this_week'), value: '$thisWeek', range: thisWeekRange },
    { label: t('filter_bar.range.this_month'), value: '$thisMonth', range: thisMonthRange },
    { label: t('filter_bar.range.this_year'), value: '$thisYear', range: thisYearRange },
  ];
};

export const generateDateOptions = (createdAt: Date[], format: FormatFunction) => {
  const firstDate = createdAt.sort((a, b) => a.getTime() - b.getTime())?.[0];
  const lastDate = createdAt.sort((a, b) => b.getTime() - a.getTime())?.[0];

  const predefinedOptions = getPredefinedRange()
    .map(({ label, value, range }) => {
      const { startDate, endDate } = isCombinedDateAndInterval(range, format);
      const count = createdAt.filter((date) => date >= startDate! && date <= endDate!).length;
      return {
        displayLabel: label,
        value,
        count,
      };
    })
    .filter((option) => option.count > 0);

  if (firstDate && lastDate) {
    const customOption = {
      value: `${format(firstDate, 'yyyy-MM-dd')}/${format(lastDate, 'yyyy-MM-dd')}`,
      displayLabel: t('filter_bar.range.custom'),
      count: 1,
      options: [
        {
          value: CustomFilterValueType['$startTime/$endTime'],
          displayLabel: t('filter_bar.range.custom'),
        },
      ],
    };
    return [...predefinedOptions, customOption];
  }
  return predefinedOptions;
};

export const countOccurrences = (array: string[]): Record<string, number> => {
  return array.reduce(
    (acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
};
