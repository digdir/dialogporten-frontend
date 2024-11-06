import { Avatar, AvatarGroup } from '@altinn/altinn-components';
import { Search } from '@digdir/designsystemet-react';
import { Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HorizontalLine } from '../HorizontalLine';
import { MenuGroupHeader, MenuItem } from '../MenuBar';
import type { PartyOption, PartyOptionGroup } from './mapToPartyOption.ts';
import styles from './partyDropdown.module.css';

interface PartyListProps {
  optionsGroups: PartyOptionGroup;
  selectedPartyIds: string[];
  onSelect: (ids: string[], allOrganizations: boolean) => void;
  showSearchFilter?: boolean;
}

/**
 * Component for rendering a list of parties
 * This component is only responsible for rendering the list of parties and certain business logic for grouping and filtering
 * @param optionsGroups - The groups of parties to render
 * @param selectedPartyIds - The ids of the selected parties
 * @param allOrganizations - Determine whether all organizations are selected
 * @param onSelect - The function to call when a party is selected
 * @param showSearchFilter - Whether to show the search filter
 * @returns A list of parties
 * @example
 * <PartyList
 *  optionsGroups={optionsGroups}
 *  selectedPartyIds={selectedPartyIds}
 *  onSelect={setSelectedPartyIds, false}
 *  showSearchFilter
 *  />
 *  */

export const PartyList = ({ optionsGroups, selectedPartyIds, onSelect, showSearchFilter }: PartyListProps) => {
  const [filterString, setFilterString] = useState<string>('');
  const { t } = useTranslation();

  const { filteredOptionGroups, allParties } = useMemo(() => {
    const allParties: PartyOption[] = Object.values(optionsGroups).flatMap((group) => group.parties);

    if (!filterString) {
      return {
        filteredOptionGroups: optionsGroups,
        allParties,
      };
    }

    const filteredParties = allParties.filter(({ label }) => label.includes(filterString));

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
                              defaultType="company"
                              size="xs"
                              items={allParties
                                .filter((party) => party.isCompany && party.value !== 'ALL_ORGANIZATIONS')
                                .map((party) => ({ name: party.label }))}
                            />
                          ) : (
                            <Avatar
                              name={option.label}
                              type={option.isCompany ? 'company' : 'person'}
                              size="sm"
                              className={styles.avatar}
                            />
                          )}
                          <span className={styles.partyListLabel}>{option.label}</span>
                        </MenuItem.LeftContent>
                      }
                      count={option.count}
                      onClick={() => {
                        const allOrganizations = option.value === 'ALL_ORGANIZATIONS';
                        onSelect(option.onSelectValues, allOrganizations);
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
