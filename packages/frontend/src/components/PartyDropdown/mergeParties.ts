import type { PartyFieldsFragment } from 'bff-types-generated';

type Dialog = {
  party: string;
};

type MergedParty = {
  label: string;
  isCompany: boolean;
  value: string;
  onSelectValues: string[];
  count: number;
};

export function mergeParties(party: PartyFieldsFragment, dialogs: Dialog[]): MergedParty {
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
    count: dialogs.filter((dialog) => mergedParties.includes(dialog.party)).length,
  };
}
