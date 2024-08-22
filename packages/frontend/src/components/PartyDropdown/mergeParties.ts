import type { PartyFieldsFragment, SavedSearchesFieldsFragment } from 'bff-types-generated';
import type { SideBarView } from '../Sidebar';

type Dialog = {
  party: string;
};

type PartyGroupType = 'End_user' | 'Other_people' | 'Organizations';

export type MergedPartyGroup = {
  [key in PartyGroupType]: {
    title: string;
    parties: MergedParty[];
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

export function groupParties(mergedParties: MergedParty[]): MergedPartyGroup {
  return mergedParties.reduce<MergedPartyGroup>(
    (acc, party) => {
      if (party.isCurrentEndUser) {
        acc.End_user.parties.push(party);
      } else if (party.isCompany) {
        acc.Organizations.parties.push(party);
      } else {
        acc.Other_people.parties.push(party);
      }
      return acc;
    },
    {
      End_user: { title: '', parties: [] },
      Other_people: { title: 'parties.labels.persons', parties: [] },
      Organizations: { title: 'parties.labels.organizations', parties: [] },
    },
  );
}

export function mergeParties(
  party: PartyFieldsFragment,
  dialogs: Dialog[],
  savedSearches?: SavedSearchesFieldsFragment[],
  counterContext?: SideBarView,
): MergedParty {
  let count = 0;

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

  if (counterContext === 'saved-searches') {
    count = savedSearches?.filter((savedSearch) => savedSearch.data.urn === party.party).length ?? 0;
  } else {
    count = dialogs.filter((dialog) => mergedParties.includes(dialog.party)).length;
  }

  return {
    label: party.name,
    isCompany: party.partyType === 'Organization',
    value: party.party,
    onSelectValues: mergedParties,
    count,
    isCurrentEndUser: party.isCurrentEndUser,
  };
}
