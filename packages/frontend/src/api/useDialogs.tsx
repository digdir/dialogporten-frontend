import { useQuery } from '@tanstack/react-query';

import {
  DialogStatus,
  type GetAllDialogsForPartiesQuery,
  type OrganizationFieldsFragment,
  type PartyFieldsFragment,
  type SearchDialogFieldsFragment,
  SystemLabel,
} from 'bff-types-generated';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import type { InboxItemMetaField, InboxItemMetaFieldType } from '../components';
import { QUERY_KEYS } from '../constants/queryKeys.ts';
import { i18n } from '../i18n/config.ts';
import { getPreferredPropertyByLocale } from '../i18n/property.ts';
import type { InboxItemInput } from '../pages/Inbox/Inbox.tsx';
import { useOrganizations } from '../pages/Inbox/useOrganizations.ts';
import { getOrganization } from './organizations.ts';
import { graphQLSDK } from './queries.ts';
import { useParties } from './useParties.ts';

export type InboxViewType = 'inbox' | 'drafts' | 'sent' | 'archive' | 'bin';
export type DialogsByView = { [key in InboxViewType]: InboxItemInput[] };
interface UseDialogsOutput {
  dialogs: InboxItemInput[];
  dialogsByView: DialogsByView;
  isSuccess: boolean;
  isLoading: boolean;
}

export function mapDialogDtoToInboxItem(
  input: SearchDialogFieldsFragment[],
  parties: PartyFieldsFragment[],
  organizations: OrganizationFieldsFragment[],
): InboxItemInput[] {
  return input.map((item) => {
    const titleObj = item.content.title.value;
    const summaryObj = item.content.summary.value;
    const endUserParty = parties?.find((party) => party.isCurrentEndUser);
    const dialogReceiverParty = parties?.find((party) => party.party === item.party);
    const actualReceiverParty = dialogReceiverParty ?? endUserParty;
    const serviceOwner = getOrganization(organizations || [], item.org, 'nb');
    const isSeenByEndUser =
      item.seenSinceLastUpdate.find((seenLogEntry) => seenLogEntry.isCurrentEndUser) !== undefined;
    return {
      id: item.id,
      party: item.party,
      title: getPreferredPropertyByLocale(titleObj)?.value ?? '',
      summary: getPreferredPropertyByLocale(summaryObj)?.value ?? '',
      sender: {
        name: serviceOwner?.name ?? '',
        isCompany: true,
        imageURL: serviceOwner?.logo,
      },
      receiver: {
        name: actualReceiverParty?.name ?? '',
        isCompany: actualReceiverParty?.partyType === 'Organization',
      },
      metaFields: getMetaFields(item, isSeenByEndUser),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      status: item.status ?? 'UnknownStatus',
      isSeenByEndUser,
      label: item.systemLabel,
    };
  });
}

export const searchDialogs = (
  partyURIs: string[],
  search: string | undefined,
): Promise<GetAllDialogsForPartiesQuery> => {
  return graphQLSDK.getAllDialogsForParties({
    partyURIs,
    search,
  });
};

export const getDialogs = (partyURIs: string[]): Promise<GetAllDialogsForPartiesQuery> =>
  graphQLSDK.getAllDialogsForParties({
    partyURIs,
  });

interface searchDialogsProps {
  parties: PartyFieldsFragment[];
  searchString?: string;
  status?: DialogStatus;
}
interface UseSearchDialogsOutput {
  isLoading: boolean;
  isSuccess: boolean;
  searchResults: InboxItemInput[];
  isFetching: boolean;
}

const flattenParties = (partiesToUse: PartyFieldsFragment[]) => {
  const partyURIs = partiesToUse.map((party) => party.party);
  const subPartyURIs = partiesToUse.flatMap((party) => party.subParties?.map((subParty) => subParty.party));
  return [...partyURIs, ...subPartyURIs] as string[];
};

export const useSearchDialogs = ({ parties, searchString }: searchDialogsProps): UseSearchDialogsOutput => {
  const { organizations } = useOrganizations();
  const { selectedParties } = useParties();

  const partiesToUse = parties ? parties : selectedParties;
  const mergedPartiesWithSubParties = flattenParties(partiesToUse);

  const debouncedSearchString = useDebounce(searchString, 300)[0];
  const enabled = !!debouncedSearchString && debouncedSearchString.length > 2;
  const { data, isSuccess, isLoading, isFetching } = useQuery<GetAllDialogsForPartiesQuery>({
    queryKey: [QUERY_KEYS.SEARCH_DIALOGS, mergedPartiesWithSubParties, debouncedSearchString],
    queryFn: () => searchDialogs(mergedPartiesWithSubParties, debouncedSearchString),
    staleTime: 1000 * 60 * 10,
    enabled,
  });
  const [searchResults, setSearchResults] = useState([] as InboxItemInput[]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  useEffect(() => {
    setSearchResults(enabled ? mapDialogDtoToInboxItem(data?.searchDialogs?.items ?? [], parties, organizations) : []);
  }, [setSearchResults, data?.searchDialogs?.items, enabled, parties, organizations]);

  return {
    isLoading,
    isSuccess,
    searchResults,
    isFetching,
  };
};

export const isBinDialog = (dialog: InboxItemInput): boolean => dialog.label === SystemLabel.Bin;

export const isArchivedDialog = (dialog: InboxItemInput): boolean => dialog.label === SystemLabel.Archive;

export const isInboxDialog = (dialog: InboxItemInput): boolean =>
  !isBinDialog(dialog) &&
  !isArchivedDialog(dialog) &&
  [DialogStatus.New, DialogStatus.InProgress, DialogStatus.RequiresAttention, DialogStatus.Completed].includes(
    dialog.status,
  );

export const isDraftDialog = (dialog: InboxItemInput): boolean =>
  !isBinDialog(dialog) && !isArchivedDialog(dialog) && dialog.status === DialogStatus.Draft;

export const isSentDialog = (dialog: InboxItemInput): boolean =>
  !isBinDialog(dialog) && !isArchivedDialog(dialog) && dialog.status === DialogStatus.Sent;

export const getViewType = (dialog: InboxItemInput): InboxViewType => {
  if (isDraftDialog(dialog)) {
    return 'drafts';
  }
  if (isArchivedDialog(dialog)) {
    return 'archive';
  }
  if (isSentDialog(dialog)) {
    return 'sent';
  }
  if (isBinDialog(dialog)) {
    return 'bin';
  }
  return 'inbox';
};

export const useDialogs = (parties: PartyFieldsFragment[]): UseDialogsOutput => {
  const { organizations } = useOrganizations();
  const { selectedParties } = useParties();

  const partiesToUse = parties ? parties : selectedParties;
  const mergedPartiesWithSubParties = flattenParties(partiesToUse);

  const { data, isSuccess, isLoading } = useQuery<GetAllDialogsForPartiesQuery>({
    queryKey: [QUERY_KEYS.DIALOGS, mergedPartiesWithSubParties, organizations],
    staleTime: 1000 * 60 * 10,
    retry: 3,
    queryFn: () => getDialogs(mergedPartiesWithSubParties),
    enabled: mergedPartiesWithSubParties.length > 0,
  });
  const dialogs = mapDialogDtoToInboxItem(data?.searchDialogs?.items ?? [], selectedParties, organizations);
  return {
    isLoading,
    isSuccess,
    dialogs,
    dialogsByView: {
      inbox: dialogs.filter(isInboxDialog),
      drafts: dialogs.filter(isDraftDialog),
      sent: dialogs.filter(isSentDialog),
      archive: dialogs.filter(isArchivedDialog),
      bin: dialogs.filter(isBinDialog),
    },
  };
};

export const getMetaFields = (item: SearchDialogFieldsFragment, isSeenByEndUser: boolean) => {
  const nOtherSeen = item.seenSinceLastUpdate?.filter((seenLogEntry) => !seenLogEntry.isCurrentEndUser).length ?? 0;
  const metaFields: InboxItemMetaField[] = [];
  metaFields.push({
    type: `status_${item.status}` as InboxItemMetaFieldType,
    label: `${i18n.t('word.status')}: ${item.status}`,
  });

  metaFields.push({ type: 'timestamp', label: item.updatedAt });

  if (typeof item.guiAttachmentCount === 'number' && item.guiAttachmentCount > 0) {
    metaFields.push({
      type: 'attachment',
      label: item.guiAttachmentCount.toString(),
    });
  }

  if (isSeenByEndUser && nOtherSeen) {
    metaFields.push({
      type: 'seenBy',
      label: `${i18n.t('word.seenBy')} ${i18n.t('word.you')} ${i18n.t('word.and')} ${nOtherSeen} ${i18n.t('word.others')}`,
      options: {
        tooltip: item.seenSinceLastUpdate.map((seenLogEntry) => seenLogEntry.seenBy.actorName).join('\n'),
      },
    });
  } else if (nOtherSeen) {
    metaFields.push({
      type: 'seenBy',
      label: `${i18n.t('word.seenBy')} ${nOtherSeen} ${i18n.t('word.others')}`,
      options: {
        tooltip: item.seenSinceLastUpdate.map((seenLogEntry) => seenLogEntry.seenBy.actorName).join('\n'),
      },
    });
  } else if (isSeenByEndUser) {
    metaFields.push({
      type: 'seenBy',
      label: `${i18n.t('word.seenBy')} ${i18n.t('word.you')}`,
      options: {
        tooltip: item.seenSinceLastUpdate.map((seenLogEntry) => seenLogEntry.seenBy.actorName).join('\n'),
      },
    });
  }

  return metaFields;
};
