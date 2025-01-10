import { DialogStatus, type PartyFieldsFragment, SystemLabel } from 'bff-types-generated';
import { describe, expect, it } from 'vitest';
import type { InboxItemInput } from '../../InboxItem';
import { getCountBadge } from './useAccounts';

describe('getCountBadge', () => {
  const dialogs: InboxItemInput[] = [
    {
      party: 'party1',
      id: 'dialog-1',
      title: '',
      summary: '',
      sender: {
        name: '',
        isCompany: true,
        imageURL: '',
      },
      receiver: {
        name: '',
        isCompany: true,
      },
      metaFields: [],
      createdAt: '',
      updatedAt: '',
      status: DialogStatus.Completed,
      isSeenByEndUser: false,
      label: SystemLabel.Default,
    },
    {
      party: 'subParty1',
      id: 'dialog-2',
      title: '',
      summary: '',
      sender: {
        name: '',
        isCompany: true,
        imageURL: '',
      },
      receiver: {
        name: '',
        isCompany: true,
      },
      metaFields: [],
      createdAt: '',
      updatedAt: '',
      status: DialogStatus.Completed,
      isSeenByEndUser: false,
      label: SystemLabel.Default,
    },
    {
      party: 'party2',
      id: 'dialog-3',
      title: '',
      summary: '',
      sender: {
        name: '',
        isCompany: true,
        imageURL: '',
      },
      receiver: {
        name: '',
        isCompany: true,
      },
      metaFields: [],
      createdAt: '',
      updatedAt: '',
      status: DialogStatus.Completed,
      isSeenByEndUser: false,
      label: SystemLabel.Default,
    },
  ];

  const party: PartyFieldsFragment = {
    isAccessManager: false,
    isCurrentEndUser: false,
    isDeleted: false,
    isMainAdministrator: false,
    name: 'party1',
    partyType: 'Person',
    party: 'party1',
    subParties: [
      {
        name: 'party1',
        party: 'subParty1',
        partyType: 'Person',
        isAccessManager: false,
        isMainAdministrator: false,
        isCurrentEndUser: false,
        isDeleted: false,
      },
    ],
  };

  it('should return undefined if no party is provided', () => {
    expect(getCountBadge(dialogs)).toBeUndefined();
  });

  it('should return undefined if no dialogs are provided', () => {
    expect(getCountBadge([], party)).toBeUndefined();
  });

  it('should return a badge with the correct count, including sub party', () => {
    const badge = getCountBadge(dialogs, party);
    expect(badge).toEqual({ label: '2', size: 'sm' });
  });

  it('should return undefined if no matching dialogs are found', () => {
    const nonMatchingParty: PartyFieldsFragment = {
      isAccessManager: false,
      isCurrentEndUser: false,
      isDeleted: false,
      isMainAdministrator: false,
      name: '',
      partyType: '',
      party: 'party3',
      subParties: [],
    };
    expect(getCountBadge(dialogs, nonMatchingParty)).toBeUndefined();
  });

  it('should return a badge with the correct count for multiple parties', () => {
    const multipleParties: PartyFieldsFragment[] = [
      {
        party: 'party1',
        subParties: [],
        partyType: '',
        isAccessManager: false,
        isMainAdministrator: false,
        name: 'party1',
        isCurrentEndUser: false,
        isDeleted: false,
      },
      {
        party: 'party2',
        subParties: [],
        partyType: '',
        isAccessManager: false,
        isMainAdministrator: false,
        name: 'party2',
        isCurrentEndUser: false,
        isDeleted: false,
      },
    ];
    const badge = getCountBadge(dialogs, multipleParties);
    expect(badge).toEqual({ label: '2', size: 'sm' });
  });
});
