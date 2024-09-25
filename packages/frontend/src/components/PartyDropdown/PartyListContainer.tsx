import { useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { useDialogs } from '../../api/useDialogs.tsx';
import { useParties } from '../../api/useParties.ts';
import { useSavedSearches } from '../../pages/SavedSearches/useSavedSearches.ts';
import type { SideBarView } from '../Sidebar';
import { PartyList } from './PartyList.tsx';
import { type MergedPartyGroup, getOptionsGroups } from './mergePartiesByName.ts';

interface PartyListAdapterProps {
  counterContext?: SideBarView;
  children: (props: {
    optionsGroups: MergedPartyGroup;
    selectedPartyIds: string[];
    onSelect: (values: string[]) => void;
    showSearchFilter: boolean;
  }) => JSX.Element;
}

interface PartyListContainerProps {
  counterContext?: SideBarView;
  onSelect?: () => void;
}

const PartyListAdapter = ({ counterContext = 'inbox', children }: PartyListAdapterProps) => {
  const queryClient = useQueryClient();
  const { parties, setSelectedPartyIds, selectedPartyIds } = useParties();
  const { dialogsByView } = useDialogs(parties);
  const { savedSearches } = useSavedSearches(selectedPartyIds);
  const showSearchFilter = parties.length > 10;

  const onSelect = (ids: string[]) => {
    setSelectedPartyIds(ids);
    void queryClient.invalidateQueries({ queryKey: [['dialogs'], ['savedSearches']] });
  };

  const optionsGroups: MergedPartyGroup = useMemo(() => {
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
        onSelect={(ids: string[]) => {
          onAdapterSelect(ids);
          onSelect?.();
        }}
        showSearchFilter={showSearchFilter}
      />
    )}
  </PartyListAdapter>
);
