import { useSnackbar } from '@altinn/altinn-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  SavedSearchData,
  SavedSearchesFieldsFragment,
  SavedSearchesQuery,
  SearchDataValueFilter,
} from 'bff-types-generated';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createSavedSearch, deleteSavedSearch, fetchSavedSearches } from '../../api/queries.ts';
import type { InboxViewType } from '../../api/useDialogs.tsx';
import type { Filter } from '../../components';
import { QUERY_KEYS } from '../../constants/queryKeys.ts';
import { PageRoutes } from '../routes.ts';

interface UseSavedSearchesOutput {
  savedSearches: SavedSearchesFieldsFragment[];
  isSuccess: boolean;
  isCTALoading: boolean;
  isLoading: boolean;
  currentPartySavedSearches: SavedSearchesFieldsFragment[] | undefined;
  saveSearch: (props: HandleSaveSearchProps) => Promise<void>;
  deleteSearch: (savedSearchId: number) => Promise<void>;
}

interface HandleSaveSearchProps {
  filters: Filter[];
  selectedParties: string[];
  enteredSearchValue: string;
  viewType: InboxViewType;
}

export const filterSavedSearches = (
  savedSearches: SavedSearchesFieldsFragment[],
  selectedPartyIds: string[],
): SavedSearchesFieldsFragment[] => {
  return (savedSearches ?? []).filter((savedSearch) => {
    if (!savedSearch?.data.urn?.length) {
      return true;
    }

    if (savedSearch?.data?.urn?.length > 0) {
      return selectedPartyIds.includes(savedSearch?.data.urn[0]!);
    }

    if (selectedPartyIds?.length !== savedSearch?.data?.urn?.length) {
      return false;
    }

    return selectedPartyIds?.every((party) => savedSearch?.data?.urn?.includes(party));
  });
};

export const useSavedSearches = (selectedPartyIds?: string[]): UseSavedSearchesOutput => {
  const [isCTALoading, setIsCTALoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { openSnackbar } = useSnackbar();

  const { data, isLoading, isSuccess } = useQuery<SavedSearchesQuery>({
    queryKey: [QUERY_KEYS.SAVED_SEARCHES, selectedPartyIds],
    queryFn: fetchSavedSearches,
    retry: 3,
    staleTime: 1000 * 60 * 20,
  });

  const savedSearchesUnfiltered = (data?.savedSearches ?? []) as SavedSearchesFieldsFragment[];
  const currentPartySavedSearches = filterSavedSearches(savedSearchesUnfiltered, selectedPartyIds || []);

  const saveSearch = async ({
    filters,
    selectedParties,
    enteredSearchValue,
    viewType,
  }: HandleSaveSearchProps): Promise<void> => {
    try {
      setIsCTALoading(true);
      const data: SavedSearchData = {
        filters: filters as SearchDataValueFilter[],
        urn: selectedParties,
        searchString: enteredSearchValue,
        fromView: PageRoutes[viewType],
      };
      await createSavedSearch('', data);
      openSnackbar({
        message: t('savedSearches.saved_success'),
        color: 'success',
      });
    } catch (error) {
      openSnackbar({
        message: t('savedSearches.saved_error'),
        color: 'alert',
      });
      console.error('Error creating saved search: ', error);
    } finally {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAVED_SEARCHES] });
      setIsCTALoading(false);
    }
  };

  const deleteSearch = async (savedSearchId: number) => {
    setIsCTALoading(true);
    try {
      await deleteSavedSearch(savedSearchId);
      openSnackbar({
        message: t('savedSearches.deleted_success'),
        color: 'success',
      });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAVED_SEARCHES] });
    } catch (error) {
      console.error('Failed to delete saved search:', error);
      openSnackbar({
        message: t('savedSearches.delete_failed'),
        color: 'alert',
      });
    } finally {
      setIsCTALoading(false);
    }
  };

  return {
    savedSearches: savedSearchesUnfiltered,
    isLoading,
    isSuccess,
    currentPartySavedSearches,
    isCTALoading,
    saveSearch,
    deleteSearch,
  };
};
