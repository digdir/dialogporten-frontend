import type { PartyFieldsFragment, SavedSearchesFieldsFragment } from 'bff-types-generated';
import { t } from 'i18next';
import type { InboxItemInput } from '../../pages/Inbox/Inbox.tsx';
import { filterSavedSearches } from '../../pages/SavedSearches/useSavedSearches.ts';
import type { SideBarView } from '../Sidebar';

type Dialog = {
  party: string;
};

type PartyGroupType = 'End_user' | 'Other_people' | 'Organizations';

export type MergedPartyGroup = {
  [key in PartyGroupType]: {
    title: string;
    parties: MergedParty[];
    isSearchResults?: boolean;
  };
};

type MergedParty = {
  label: string;
  isCompany: boolean;
  value: string;
  onSelectValues: string[];
  count: number;
  isCurrentEndUser: boolean;
};

export const getOptionsGroups = (
  parties: PartyFieldsFragment[],
  dialogsByCounterContext: Record<string, InboxItemInput[]>,
  savedSearches: SavedSearchesFieldsFragment[] | undefined,
  counterContext: SideBarView = 'inbox',
): MergedPartyGroup => {
  return groupParties(
    parties.map((party) =>
      mergePartiesByName(party, dialogsByCounterContext[counterContext], savedSearches, counterContext),
    ),
  );
};

export function groupParties(parties: MergedParty[]): MergedPartyGroup {
  const groupingThreshold = 3;

  if (parties.length <= groupingThreshold) {
    return {
      Other_people: { title: '', parties },
      End_user: { title: '', parties: [] },
      Organizations: { title: '', parties: [] },
    };
  }

  const initialGroup: MergedPartyGroup = {
    End_user: { title: '', parties: [] },
    Other_people: { title: 'parties.labels.persons', parties: [] },
    Organizations: { title: 'parties.labels.organizations', parties: [] },
  };

  const grouped = parties.reduce<MergedPartyGroup>((acc, party) => {
    if (party.isCurrentEndUser) {
      acc.End_user.parties.push(party);
    } else if (party.isCompany) {
      acc.Organizations.parties.push(party);
    } else {
      acc.Other_people.parties.push(party);
    }
    return acc;
  }, initialGroup);

  /* add 'All organizations' option if there are more than one organization */
  const updatedOrganizations =
    grouped.Organizations.parties.length > 1
      ? {
          ...grouped.Organizations,
          parties: [
            ...grouped.Organizations.parties,
            {
              label: t('parties.labels.all_organizations'),
              isCompany: true,
              value: 'ALL_ORGANIZATIONS',
              onSelectValues: grouped.Organizations.parties.map((party) => party.value),
              count: grouped.Organizations.parties.reduce((acc, party) => acc + party.count, 0),
              isCurrentEndUser: false,
            },
          ],
        }
      : grouped.Organizations;

  return {
    ...grouped,
    Organizations: updatedOrganizations,
  };
}

export function mergePartiesByName(
  party: PartyFieldsFragment,
  dialogs: Dialog[],
  savedSearches?: SavedSearchesFieldsFragment[],
  counterContext?: SideBarView,
): MergedParty {
  let count: number;
  if (counterContext === 'saved-searches') {
    count = filterSavedSearches(savedSearches ?? [], [party.party]).length ?? 0;
  } else {
    count = dialogs.filter((dialogs) => dialogs?.party === party.party).length ?? 0;
  }

  const mergedParties = party.subParties?.reduce(
    (acc, subParty) => {
      if (subParty.name === party.name) {
        acc.push(subParty.party);
      } else {
        acc.push(subParty.party);
      }
      return acc;
    },
    [party.party],
  ) ?? [party.party];

  return {
    label: party.name,
    isCompany: party.partyType === 'Organization',
    value: party.party,
    onSelectValues: mergedParties,
    count,
    isCurrentEndUser: party.isCurrentEndUser ?? false,
  };
}
