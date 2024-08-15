import { Fragment, useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { useDialogs } from '../../api/useDialogs.tsx';
import { useParties } from '../../api/useParties.ts';
import { Avatar } from '../Avatar';
import { HorizontalLine } from '../HorizontalLine';
import { MenuGroupHeader, MenuItem } from '../MenuBar';
import { type MergedPartyGroup, groupParties, mergeParties } from './mergeParties.ts';
import styles from './partyDropdown.module.css';

interface PartyListProps {
  onOpenMenu: (value: boolean) => void;
}
export const PartyList = ({ onOpenMenu }: PartyListProps) => {
  const { parties, setSelectedPartyIds, selectedParties } = useParties();
  const { dialogs } = useDialogs(parties);
  const queryClient = useQueryClient();

  // biome-ignore lint: lint/correctness/useExhaustiveDependencies
  const optionsGroups: MergedPartyGroup = useMemo(() => {
    return groupParties(parties.map((party) => mergeParties(party, dialogs)));
  }, [parties, dialogs]);

  return (
    <>
      {Object.entries(optionsGroups).map(([key, group]) => {
        if (group.parties.length === 0) return null;

        return (
          <Fragment key={key}>
            <MenuGroupHeader title={group.title} />
            {group.parties.map((option, index, list) => {
              const companyName = option.isCompany ? option.label : '';
              const isLast = index === list.length - 1;
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
                      void queryClient.invalidateQueries({ queryKey: ['dialogs'] });
                      onOpenMenu(false);
                    }}
                  />
                  {isLast && list.length > 1 && <HorizontalLine />}
                </Fragment>
              );
            })}
          </Fragment>
        );
      })}
    </>
  );
};
