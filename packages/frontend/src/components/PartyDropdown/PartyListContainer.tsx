import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useDialogs } from '../../api/useDialogs.tsx';
import { useParties } from '../../api/useParties.ts';
import { QUERY_KEYS } from '../../constants/queryKeys.ts';
import { useSavedSearches } from '../../pages/SavedSearches/useSavedSearches.ts';
import type { SideBarView } from '../Sidebar';
import { PartyList } from './PartyList.tsx';
import { type PartyOptionGroup, getOptionsGroups } from './mapToPartyOption.ts';

interface PartyListAdapterProps {
  counterContext?: SideBarView;
  children: (props: {
    optionsGroups: PartyOptionGroup;
    selectedPartyIds: string[];
    onSelect: (values: string[], allOrganizationsSelected: boolean) => void;
    showSearchFilter: boolean;
  }) => JSX.Element;
}

interface PartyListContainerProps {
  counterContext?: SideBarView;
  onSelect?: () => void;
}

const PartyListAdapter = ({ counterContext = 'inbox', children }: PartyListAdapterProps) => {
  const queryClient = useQueryClient();
  const { parties, setSelectedPartyIds, selectedPartyIds, setAllOrganizationsSelected } = useParties();
  const { dialogsByView } = useDialogs(parties);
  const { savedSearches } = useSavedSearches(selectedPartyIds);
  const showSearchFilter = parties.length > 10;

  const onSelect = (ids: string[], allOrganizationsSelected: boolean) => {
    setAllOrganizationsSelected(allOrganizationsSelected);
    setSelectedPartyIds(ids);
    void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DIALOGS, QUERY_KEYS.SAVED_SEARCHES] });
  };

  const optionsGroups: PartyOptionGroup = useMemo(() => {
    return getOptionsGroups(parties, dialogsByView, savedSearches, counterContext);
  }, [parties, dialogsByView, savedSearches, counterContext]);

  return children({ optionsGroups, selectedPartyIds, onSelect, showSearchFilter });
};

export const PartyListContainer = ({ counterContext, onSelect }: PartyListContainerProps) => (
  <PartyListAdapter counterContext={counterContext}>
    {({ optionsGroups, selectedPartyIds, onSelect: onAdapterSelect, showSearchFilter }) => (
      <PartyList
        optionsGroups={optionsGroups}
        selectedPartyIds={selectedPartyIds}
        onSelect={(ids: string[], allOrganizations: boolean) => {
          onAdapterSelect(ids, allOrganizations);
          onSelect?.();
        }}
        showSearchFilter={showSearchFilter}
      />
    )}
  </PartyListAdapter>
);
