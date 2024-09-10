import type { PartyFieldsFragment, SavedSearchesFieldsFragment } from 'bff-types-generated';
import { t } from 'i18next';
import type { InboxItemInput } from '../../pages/Inbox/Inbox.tsx';
import { filterSavedSearches } from '../../pages/SavedSearches/useSavedSearches.ts';
import type { SideBarView } from '../Sidebar';

type Dialog = {
  party: string;
};

type PartyGroupType = 'End_user' | 'All_other_people' | 'Other_organization';

export type MergedPartyGroup = {
  [key in PartyGroupType]: {
    title: string;
    parties: MergedParty[];
    isSearchResults?: boolean;
  };
};

export type MergedParty = {
  label: string;
  isCompany: boolean;
  value: string;
  onSelectValues: string[];
  count: number;
  isCurrentEndUser: boolean;
  showHorizontalLine?: boolean;
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
      End_user: {
        title: 'parties.labels.you',
        parties: parties
          .filter((party) => party.isCurrentEndUser)
          .map((party) => ({
            ...party,
            showHorizontalLine: true,
          })),
      },
      All_other_people: { title: '', parties: parties.filter((party) => !party.isCurrentEndUser) },
      Other_organization: { title: '', parties: [] },
    };
  }

  const initialGroup: MergedPartyGroup = {
    End_user: { title: 'parties.labels.you', parties: [] },
    All_other_people: { title: 'parties.labels.persons', parties: [] },
    Other_organization: { title: '', parties: [] },
  };

  const grouped = parties.reduce<MergedPartyGroup>((acc, party) => {
    if (party.isCurrentEndUser) {
      acc.End_user.parties.push({ ...party, showHorizontalLine: true });
    } else if (party.isCompany) {
      acc.Other_organization.parties.push(party);
    } else {
      acc.All_other_people.parties.push(party);
    }
    return acc;
  }, initialGroup);

  /* add 'All organizations' option if there are more than one organization */
  const organizations = parties.filter((party) => party.isCompany);
  const updatedEndUserGroup =
    organizations.length > 1
      ? {
          ...grouped.End_user,
          parties: [
            ...grouped.End_user.parties,
            {
              label: t('parties.labels.all_organizations'),
              isCompany: true,
              value: 'ALL_ORGANIZATIONS',
              onSelectValues: organizations.map((party) => party.value),
              count: organizations.reduce((acc, party) => acc + party.count, 0),
              isCurrentEndUser: false,
              showHorizontalLine: true,
            },
          ],
        }
      : grouped.End_user;

  const updatedOtherPeopleGroup = {
    ...grouped.All_other_people,
    parties: [
      ...grouped.All_other_people.parties.map((party, index, list) => ({
        ...party,
        showHorizontalLine: list.length - 1 === index,
      })),
    ],
  };

  return {
    ...grouped,
    All_other_people: updatedOtherPeopleGroup,
    End_user: updatedEndUserGroup,
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
