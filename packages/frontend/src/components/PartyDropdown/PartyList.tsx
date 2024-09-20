import { Search } from '@digdir/designsystemet-react';
import { Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../Avatar';
import { AvatarGroup } from '../AvatarGroup';
import { HorizontalLine } from '../HorizontalLine';
import { MenuGroupHeader, MenuItem } from '../MenuBar';
import type { MergedParty, MergedPartyGroup } from './mergePartiesByName.ts';
import styles from './partyDropdown.module.css';

interface PartyListProps {
  optionsGroups: MergedPartyGroup;
  selectedPartyIds: string[];
  onSelect: (ids: string[]) => void;
  showSearchFilter?: boolean;
}

/**
 * Component for rendering a list of parties
 * This component is only responsible for rendering the list of parties and certain business logic for grouping and filtering
 * @param optionsGroups - The groups of parties to render
 * @param selectedPartyIds - The ids of the selected parties
 * @param onSelect - The function to call when a party is selected
 * @param showSearchFilter - Whether to show the search filter
 * @returns A list of parties
 * @example
 * <PartyList
 *  optionsGroups={optionsGroups}
 *  selectedPartyIds={selectedPartyIds}
 *  onSelect={setSelectedPartyIds}
 *  showSearchFilter
 *  />
 *  */

export const PartyList = ({ optionsGroups, selectedPartyIds, onSelect, showSearchFilter }: PartyListProps) => {
  const [filterString, setFilterString] = useState<string>('');
  const { t } = useTranslation();

  const { filteredOptionGroups, allParties } = useMemo(() => {
    const allParties: MergedParty[] = Object.values(optionsGroups).flatMap((group) => group.parties);

    if (!filterString) {
      return {
        filteredOptionGroups: optionsGroups,
        allParties,
      };
    }

    const filteredParties = allParties.filter(({ label }) => label.toLowerCase().includes(filterString.toLowerCase()));

    return {
      filteredOptionGroups: {
        Filtered: {
          title: t('partyDropdown.filter_results', { count: filteredParties.length }),
          parties: filteredParties,
          isSearchResults: true,
        },
      },
      allParties,
    };
  }, [optionsGroups, filterString, t]);

  return (
    <>
      {showSearchFilter && (
        <MenuItem
          leftContent={
            <Search
              autoComplete="off"
              size="sm"
              aria-label={t('word.search')}
              placeholder={t('word.search')}
              onChange={(e) => {
                setFilterString(e.target.value);
              }}
              value={filterString}
              onClear={() => setFilterString('')}
            />
          }
        />
      )}
      {Object.entries(filteredOptionGroups)
        .filter(([_, group]) => group.isSearchResults || group.parties.length > 0)
        .map(([key, group], index, list) => {
          const isLastGroup = index === list.length - 1;

          return (
            <Fragment key={key}>
              <MenuGroupHeader title={group.title} />
              {group.parties.map((option) => {
                const isSelected = !!(
                  selectedPartyIds.length &&
                  selectedPartyIds.length === option.onSelectValues.length &&
                  selectedPartyIds.every((urn) => option.onSelectValues.includes(urn))
                );
                const isLastItem = isLastGroup && group.parties.indexOf(option) === group.parties.length - 1;
                return (
                  <Fragment key={option.value}>
                    <MenuItem
                      className={styles.partyListItem}
                      isActive={isSelected}
                      leftContent={
                        <MenuItem.LeftContent>
                          {option.value === 'ALL_ORGANIZATIONS' ? (
                            <AvatarGroup
                              profile="organization"
                              size="small"
                              avatars={allParties
                                .filter((party) => party.isCompany && party.value !== 'ALL_ORGANIZATIONS')
                                .map((party) => ({ name: party.label }))}
                            />
                          ) : (
                            <Avatar
                              name={option.label}
                              profile={option.isCompany ? 'organization' : 'person'}
                              size="small"
                              className={styles.avatar}
                            />
                          )}
                          <span className={styles.partyListLabel}>{option.label}</span>
                        </MenuItem.LeftContent>
                      }
                      count={option.count}
                      onClick={() => {
                        onSelect(option.onSelectValues);
                      }}
                    />
                    {option.showHorizontalLine && !isLastItem && <HorizontalLine />}
                  </Fragment>
                );
              })}
            </Fragment>
          );
        })}
    </>
  );
};
