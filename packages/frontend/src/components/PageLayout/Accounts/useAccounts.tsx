import type {
  Account,
  AccountMenuItem,
  AccountSearchProps,
  BadgeProps,
  MenuItemGroups,
} from '@altinn/altinn-components';
import type { PartyFieldsFragment } from 'bff-types-generated';
import { type ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { InboxItemInput } from '../../InboxItem';

interface UseAccountsProps {
  parties: PartyFieldsFragment[];
  selectedParties: PartyFieldsFragment[];
  dialogs: InboxItemInput[];
  allOrganizationsSelected: boolean;
}

interface UseAccountsOutput {
  accounts: AccountMenuItem[];
  accountGroups: MenuItemGroups;
  selectedAccount: Account;
  accountSearch: AccountSearchProps | undefined;
}

type AccountType = 'company' | 'person';

export const getCountBadge = (
  dialogs: InboxItemInput[],
  party?: PartyFieldsFragment | PartyFieldsFragment[],
): BadgeProps | undefined => {
  if (!party || !dialogs?.length || (Array.isArray(party) && !party.length)) {
    return undefined;
  }

  const subPartyIds = Array.isArray(party) ? party.flatMap((p) => getSubPartyIds(p)) : getSubPartyIds(party);
  const partyIds = Array.isArray(party) ? party.map((p) => p.party) : [party.party];
  const allPartyIds = [...partyIds, ...subPartyIds];
  const count = dialogs.filter((dialog) => allPartyIds.includes(dialog.party)).length;

  if (count > 0) {
    return {
      label: count.toString(),
      size: 'sm',
    };
  }
};

const getSubPartyIds = (party?: PartyFieldsFragment): string[] => {
  return party?.subParties?.filter((subParty) => subParty.name === party.name).map((party) => party.party) ?? [];
};

export const useAccounts = ({
  parties,
  selectedParties,
  dialogs,
  allOrganizationsSelected,
}: UseAccountsProps): UseAccountsOutput => {
  const { t } = useTranslation();
  const [searchString, setSearchString] = useState<string>('');
  const accountSearchThreshold = 2;
  const showSearch = parties.length > accountSearchThreshold;

  const endUser = parties.find((party) => party.partyType === 'Person' && party.isCurrentEndUser);
  const nonEndUsers = parties.filter((party) => party.partyType === 'Person' && !party.isCurrentEndUser);
  const organizations = parties.filter((party) => party.partyType === 'Organization');

  if (!selectedParties?.length) {
    return {
      accounts: [],
      accountGroups: {},
      selectedAccount: {
        id: 'no-account',
        name: '?',
        type: 'person',
      },
      accountSearch: undefined,
    };
  }

  const accountGroups: MenuItemGroups = {
    ...(endUser && {
      primary: {
        title: t('parties.groups.yourself'),
      },
    }),
    ...(organizations.length && {
      secondary: {
        title: t('parties.groups.other_accounts'),
      },
    }),
  };

  const endUserAccount = {
    id: endUser?.party ?? '',
    name: endUser?.name ?? '',
    type: 'person' as AccountType,
    groupId: 'primary',
    badge: getCountBadge(dialogs, endUser),
  };

  const otherUsersAccounts = nonEndUsers.map((noEnderUserParty) => {
    return {
      id: noEnderUserParty.party,
      name: noEnderUserParty.name,
      type: 'person' as AccountType,
      groupId: 'other_users',
      badge: getCountBadge(dialogs, noEnderUserParty),
    };
  });

  const organizationAccounts: AccountMenuItem[] = organizations.map((party) => {
    return {
      id: party.party,
      name: party.name,
      type: 'company' as AccountType,
      groupId: 'secondary',
      badge: getCountBadge(dialogs, party),
    };
  });

  const allOrganizationsAccount: AccountMenuItem = {
    id: 'ALL',
    name: t('parties.labels.all_organizations'),
    type: 'company' as AccountType,
    groupId: 'secondary',
    accountNames: organizations.map((party) => party.name),
    badge: getCountBadge(dialogs, organizations),
  };

  const accounts: AccountMenuItem[] = [
    ...(endUser ? [endUserAccount] : []),
    ...otherUsersAccounts,
    ...(organizationAccounts.length > 1 ? [...organizationAccounts, allOrganizationsAccount] : organizationAccounts),
  ];

  const selectedAccount = allOrganizationsSelected
    ? allOrganizationsAccount
    : selectedParties.map((party) => ({
        id: party.party,
        name: party.name,
        type: party.partyType.toLowerCase() as AccountType,
      }))[0];

  const accountSearch = showSearch
    ? {
        name: 'account-search',
        value: searchString,
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          setSearchString(event.target.value);
        },
        placeholder: t('parties.search'),
        getResultsLabel: (hits: number) => {
          if (hits === 0) {
            return t('parties.search.no_results');
          }
          return t('parties.results', { hits });
        },
      }
    : undefined;

  return {
    accounts,
    accountGroups,
    selectedAccount,
    accountSearch,
  };
};
