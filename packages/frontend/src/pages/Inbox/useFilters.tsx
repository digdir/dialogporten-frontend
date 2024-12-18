import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Filter, InboxItemInput } from '../../components';
import type { FilterSetting } from '../../components/FilterBar/FilterBar.tsx';
import { useFormat } from '../../i18n/useDateFnsLocale.tsx';
import { createFiltersURLQuery, getFilterBarSettings, readFiltersFromURLQuery } from './filters.ts';

interface UseFiltersOutput {
  filters: Filter[];
  filterSettings: FilterSetting[];
  onFiltersChange: (filters: Filter[]) => void;
}

interface UseFiltersProps {
  dialogs: InboxItemInput[];
}

export const useFilters = ({ dialogs }: UseFiltersProps): UseFiltersOutput => {
  const [_, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filter[]>(readFiltersFromURLQuery(location.search));
  const format = useFormat();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const filterSettings = useMemo(() => {
    const settings = getFilterBarSettings(dialogs, filters, format).filter(
      (setting) =>
        setting.options.length > 1 ||
        typeof filters.find((filter) => filter.id === setting.id) !== 'undefined' ||
        setting.id === 'updated',
    );
    const legalFilterKeys = settings.map((setting) => setting.id);
    const containsIllegalFilter = filters.some((filter) => !legalFilterKeys.includes(filter.id));

    if (containsIllegalFilter) {
      setFilters(filters.filter((filter) => legalFilterKeys.includes(filter.id)));
    }

    return settings;
  }, [dialogs, filters]);

  const onFiltersChange = (filters: Filter[]) => {
    const currentURL = new URL(window.location.href);
    const filterKeys = filterSettings.map((setting) => setting.id);
    const updatedURL = createFiltersURLQuery(filters, filterKeys, currentURL.toString());
    setSearchParams(updatedURL.searchParams, { replace: true });
    setFilters(filters);
  };

  return { filters, filterSettings, onFiltersChange };
};
