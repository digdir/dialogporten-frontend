import type { SavedSearchesFieldsFragment } from 'bff-types-generated';
import type { FormatDistanceFunction } from '../../i18n/useDateFnsLocale.tsx';

export const autoFormatRelativeTime = (date: Date, formatDistance: FormatDistanceFunction): string => {
  try {
    return formatDistance(new Date(date), new Date(), {
      addSuffix: true,
    });
  } catch (error) {
    console.error('autoFormatRelativeTime Error: ', error);
    return '';
  }
};

export const getMostRecentSearchDate = (data: SavedSearchesFieldsFragment[]): Date | null => {
  try {
    if (!data?.length) {
      return null;
    }
    const timestamp = data?.reduce((latest, search) => {
      return Number.parseInt(search?.updatedAt!, 10) > Number.parseInt(latest?.updatedAt!, 10) ? search : latest;
    })!.updatedAt;
    return new Date(Number.parseInt(timestamp, 10));
  } catch (error) {
    console.error('getMostRecentSearchDate Error: ', error);
    return null;
  }
};
