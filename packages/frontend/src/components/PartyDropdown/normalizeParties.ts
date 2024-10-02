import type { PartyFieldsFragment } from 'bff-types-generated';
import { toTitleCase } from '../../profile';

/* normalizes the parties and sub parties to title case and returns a flatten lists of PartyFieldsFragment
 where name of parent differs from sub parties
 */
export const normalizeParties = (parties: PartyFieldsFragment[]): PartyFieldsFragment[] => {
  const partiesInTitleCase =
    parties.map((party) => ({
      ...party,
      name: toTitleCase(party.name),
      subParties: party.subParties?.map((subParty) => ({
        ...subParty,
        name: toTitleCase(subParty.name),
        isCurrentEndUser: false,
        isDeleted: party.isDeleted,
      })),
    })) ?? [];

  return partiesInTitleCase.reduce<PartyFieldsFragment[]>((acc, party) => {
    const subParties = party.subParties ?? [];
    const subPartiesNotMatchingParent = subParties.filter((subParty) => subParty.name !== party.name);

    acc.push(party);
    acc.push(...subPartiesNotMatchingParent);

    return acc;
  }, []);
};
