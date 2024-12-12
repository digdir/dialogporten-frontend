import type { PartyFieldsFragment } from 'bff-types-generated';
import { type Dispatch, type SetStateAction, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Filter, FilterBarRef } from '../../components/FilterBar/FilterBar';
import { getQueryParamsWithoutFilters } from './queryParams';

interface UseFilterResetOnSelectedPartiesChangeProps {
  setActiveFilters: Dispatch<SetStateAction<Filter[]>>;
  selectedParties: PartyFieldsFragment[];
}

export const useFilterResetOnSelectedPartiesChange = ({
  setActiveFilters,
  selectedParties,
}: UseFilterResetOnSelectedPartiesChangeProps) => {
  const filterBarRef = useRef<FilterBarRef>(null);
  const [, setSearchParams] = useSearchParams();

  const resetAllFilters = () => {
    setActiveFilters([]);
    setSearchParams(getQueryParamsWithoutFilters());
    filterBarRef.current?.resetFilters();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  useEffect(() => {
    resetAllFilters();
  }, [selectedParties]);
};
