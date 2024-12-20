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
}

interface UseAccountsOutput {
  accounts: AccountMenuItem[];
  accountGroups: MenuItemGroups;
  selectedAccount: Account;
  accountSearch: AccountSearchProps | undefined;
}

type AccountType = 'company' | 'person';

const getBadgeProps = (count: number): BadgeProps | undefined => {
  if (count > 0) {
    return {
      label: count.toString(),
      size: 'sm',
    };
  }
};

export const useAccounts = ({ parties, selectedParties, dialogs }: UseAccountsProps): UseAccountsOutput => {
  const { t } = useTranslation();
  const [searchString, setSearchString] = useState<string>('');
  const accountSearchThreshold = 2;
  const showSearch = parties.length > accountSearchThreshold;

  const endUser = parties.find((party) => party.partyType === 'Person' && party.isCurrentEndUser);
  const otherUsers = parties.filter((party) => party.partyType === 'Person' && !party.isCurrentEndUser);
  const organizations = parties.filter((party) => party.partyType === 'Organization');

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

  const endUserDialogsCount = dialogs.filter((dialog) => dialog.party === endUser?.party).length;
  const endUserAccount = {
    id: endUser?.party ?? '',
    name: endUser?.name ?? '',
    type: 'person' as AccountType,
    groupId: 'primary',
    badge: getBadgeProps(endUserDialogsCount),
  };

  const otherUsersAccounts = otherUsers.map((party) => {
    const count = dialogs.filter((dialog) => dialog.party === party.party).length;
    return {
      id: party.party,
      name: party.name,
      type: 'person' as AccountType,
      groupId: 'other_users',
      badge: getBadgeProps(count),
    };
  });

  const organizationAccounts: AccountMenuItem[] = organizations.map((party) => {
    const count = dialogs.filter((dialog) => dialog.party === party.party).length;
    return {
      id: party.party,
      name: party.name,
      type: 'company' as AccountType,
      groupId: 'secondary',
      badge: getBadgeProps(count),
    };
  });

  const allOrgsDialogsCount = organizations.reduce((acc, party) => {
    const count = dialogs.filter((dialog) => dialog.party === party.party).length;
    return acc + count;
  }, 0);
  const allOrgsAccount: AccountMenuItem = {
    id: 'ALL',
    name: t('parties.labels.all_organizations'),
    type: 'company' as AccountType,
    groupId: 'secondary',
    accountNames: organizations.map((party) => party.name),
    badge: getBadgeProps(allOrgsDialogsCount),
  };

  const accounts: AccountMenuItem[] = [
    ...(endUser ? [endUserAccount] : []),
    ...otherUsersAccounts,
    ...(organizationAccounts.length > 1 ? [...organizationAccounts, allOrgsAccount] : organizationAccounts),
  ];

  const selectedAccount =
    selectedParties?.length === 1
      ? selectedParties.map((party) => ({
          id: party.party,
          name: party.name,
          type: party.partyType.toLowerCase() as AccountType,
        }))[0]
      : allOrgsAccount;

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
