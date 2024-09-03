import { Fragment, useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { useDialogs } from '../../api/useDialogs.tsx';
import { useParties } from '../../api/useParties.ts';
import { useSavedSearches } from '../../pages/SavedSearches/useSavedSearches.ts';
import { Avatar } from '../Avatar';
import { HorizontalLine } from '../HorizontalLine';
import { MenuGroupHeader, MenuItem } from '../MenuBar';
import type { SideBarView } from '../Sidebar';
import { type MergedPartyGroup, groupParties, mergeParties } from './mergeParties.ts';
import styles from './partyDropdown.module.css';

interface PartyListProps {
  onOpenMenu: (value: boolean) => void;
  counterContext?: SideBarView;
}

export const PartyList = ({ onOpenMenu, counterContext = 'inbox' }: PartyListProps) => {
  const { parties, setSelectedPartyIds, selectedParties } = useParties();
  const { dialogsByView } = useDialogs(parties);
  const queryClient = useQueryClient();
  const { savedSearches } = useSavedSearches(selectedParties);

  const optionsGroups: MergedPartyGroup = useMemo(() => {
    return groupParties(
      parties.map((party) =>
        mergeParties(party, dialogsByView[counterContext as keyof typeof dialogsByView], savedSearches, counterContext),
      ),
    );
  }, [parties, dialogsByView, savedSearches, counterContext]);

  return (
    <>
      {Object.entries(optionsGroups)
        .filter(([_, group]) => group.parties.length > 0)
        .map(([key, group], index, list) => {
          const isLastGroup = index === list.length - 1;

          return (
            <Fragment key={key}>
              <MenuGroupHeader title={group.title} />
              {group.parties.map((option) => {
                const companyName = option.isCompany ? option.label : '';
                return (
                  <Fragment key={option.value}>
                    <MenuItem
                      isActive={selectedParties.every((party) => option.onSelectValues.includes(party.party))}
                      leftContent={
                        <MenuItem.LeftContent>
                          <Avatar name={option.label} companyName={companyName} size="small" />
                          <span className={styles.partyListLabel}>{option.label}</span>
                        </MenuItem.LeftContent>
                      }
                      count={option.count}
                      onClick={() => {
                        setSelectedPartyIds(option.onSelectValues);
                        void queryClient.invalidateQueries(['dialogs']);
                        void queryClient.invalidateQueries(['savedSearches']);
                        onOpenMenu(false);
                      }}
                    />
                    {!isLastGroup && <HorizontalLine />}
                  </Fragment>
                );
              })}
            </Fragment>
          );
        })}
    </>
  );
};
