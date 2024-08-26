import type { PartyFieldsFragment } from 'bff-types-generated';
import { describe, expect, it } from 'vitest';
import { mergeParties } from './mergeParties.ts';

describe('mergeParties', () => {
  it('should correctly merge subparties with the same name as the parent party', () => {
    const party = {
      name: 'Acme Corp',
      party: 'party1',
      partyType: 'Organization',
      subParties: [
        { name: 'Acme Corp', party: 'subParty1', partyType: 'Organization' },
        { name: 'Acme Sub', party: 'subParty2', partyType: 'Organization' },
      ],
    } as PartyFieldsFragment;

    const dialogs = [{ party: 'party1' }, { party: 'subParty1' }, { party: 'subParty2' }];

    const result = mergeParties(party, dialogs);
    expect(result).toEqual({
      label: 'Acme Corp',
      isCompany: true,
      value: 'party1',
      onSelectValues: ['party1', 'subParty1', 'subParty2'],
      count: 1,
      isCurrentEndUser: false,
    });
  });

  it('should handle a party with no subparties', () => {
    const party = {
      name: 'Solo Corp',
      party: 'party2',
      partyType: 'Organization',
    } as PartyFieldsFragment;

    const dialogs = [{ party: 'party2' }];

    const result = mergeParties(party, dialogs);
    expect(result).toEqual({
      label: 'Solo Corp',
      isCompany: true,
      value: 'party2',
      onSelectValues: ['party2'],
      count: 1,
      isCurrentEndUser: false,
    });
  });

  it('should handle subparties with different names than the parent party', () => {
    const party = {
      name: 'Main Corp',
      party: 'party3',
      partyType: 'Organization',
      subParties: [{ name: 'Sub Corp', party: 'subParty3', partyType: 'Organization' }],
    } as PartyFieldsFragment;

    const dialogs = [{ party: 'party3' }, { party: 'subParty3' }];

    const result = mergeParties(party, dialogs);
    expect(result).toEqual({
      label: 'Main Corp',
      isCompany: true,
      value: 'party3',
      onSelectValues: ['party3', 'subParty3'],
      count: 1,
      isCurrentEndUser: false,
    });
  });
});
