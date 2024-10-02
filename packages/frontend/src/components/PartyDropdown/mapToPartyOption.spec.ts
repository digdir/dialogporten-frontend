import type { PartyFieldsFragment, SavedSearchesFieldsFragment } from 'bff-types-generated';
import { describe, expect, it } from 'vitest';
import { mapToPartyOption } from './mapToPartyOption.ts';

describe('mapToPartyOption', () => {
  const partyMock: PartyFieldsFragment = {
    __typename: 'AuthorizedParty',
    party: 'party-id',
    partyType: 'Organization',
    isAccessManager: false,
    isMainAdministrator: false,
    name: 'Party Name',
    isCurrentEndUser: false,
    isDeleted: false,
    subParties: [],
  };

  const dialogsMock = [{ party: 'party-id' }, { party: 'other-id' }];

  it('should map party to PartyOption correctly for an organization', () => {
    const result = mapToPartyOption(partyMock, dialogsMock, undefined, 'inbox');
    expect(result).toEqual({
      label: 'Party Name',
      isCompany: true,
      value: 'party-id',
      onSelectValues: ['party-id'],
      count: 1,
      isCurrentEndUser: false,
    });
  });

  it('should correctly count matching dialogs for party', () => {
    const result = mapToPartyOption(partyMock, dialogsMock);
    expect(result.count).toBe(1);
  });

  it('should count saved searches when counterContext is "saved-searches"', () => {
    const savedSearchesMock: SavedSearchesFieldsFragment[] = [
      {
        id: 1,
        name: 'hei',
        createdAt: '1727692531961',
        updatedAt: '1727703271317',
        data: {
          urn: ['party-id'],
          searchString: '',
          fromView: '/',
          filters: [],
        },
      },
    ];

    const result = mapToPartyOption(partyMock, dialogsMock, savedSearchesMock, 'saved-searches');
    expect(result.count).toBe(1);
  });

  it('should handle subParties correctly', () => {
    const partyWithSubParties = {
      ...partyMock,
      subParties: [
        {
          party: 'sub-party-id',
          partyType: 'Organization',
          isAccessManager: false,
          isMainAdministrator: false,
          name: 'Party Name',
          isCurrentEndUser: false,
          isDeleted: false,
          subParties: [],
        },
      ],
    };
    const result = mapToPartyOption(partyWithSubParties, dialogsMock);
    expect(result.onSelectValues).toEqual(['party-id', 'sub-party-id']);
  });
});
