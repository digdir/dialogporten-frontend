import type {
  GetAllDialogsForPartiesQuery,
  PartyFieldsFragment,
  SearchDialogFieldsFragment,
} from 'bff-types-generated';
import { DialogStatus } from 'bff-types-generated';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDebounce } from 'use-debounce';
import type { InboxItemMetaField, InboxItemMetaFieldType } from '../components/index.ts';
import { i18n } from '../i18n/config.ts';
import { type FormatFunction, useFormat } from '../i18n/useDateFnsLocale.tsx';
import type { InboxItemInput } from '../pages/Inbox/Inbox.tsx';
import { getOrganisation } from './organisations.ts';
import { graphQLSDK } from './queries.ts';

export type InboxViewType = 'inbox' | 'drafts' | 'sent';
interface UseDialogsOutput {
  dialogs: InboxItemInput[];
  dialogsByView: {
    [key in InboxViewType]: InboxItemInput[];
  };
  isSuccess: boolean;
  isLoading: boolean;
}

const getPropertyByCultureCode = (value: Record<string, string>[] | undefined): string => {
  const defaultCultureCode = 'nb';
  if (value) {
    return value.find((item) => item.languageCode === defaultCultureCode)?.value ?? '';
  }
  return '';
};

export function mapDialogDtoToInboxItem(
  input: SearchDialogFieldsFragment[],
  parties: PartyFieldsFragment[],
  format: FormatFunction,
): InboxItemInput[] {
  return input.map((item) => {
    const titleObj = item.content.title.value;
    const summaryObj = item.content.summary.value;
    const endUserParty = parties?.find((party) => party.isCurrentEndUser);
    const dialogReceiverParty = parties?.find((party) => party.party === item.party);
    const actualReceiverParty = dialogReceiverParty ?? endUserParty;
    const serviceOwner = getOrganisation(item.org, 'nb');
    const isSeenByEndUser =
      item.seenSinceLastUpdate.find((seenLogEntry) => seenLogEntry.isCurrentEndUser) !== undefined;
    return {
      id: item.id,
      party: item.party,
      title: getPropertyByCultureCode(titleObj),
      description: getPropertyByCultureCode(summaryObj),
      sender: {
        name: serviceOwner?.name ?? '',
        isCompany: true,
        imageURL: serviceOwner?.logo,
      },
      receiver: {
        name: actualReceiverParty?.name ?? '',
        isCompany: actualReceiverParty?.partyType === 'Organisation',
      },
      metaFields: getMetaFields(item, isSeenByEndUser, format),
      linkTo: `/inbox/${item.id}`,
      date: item.createdAt ?? '',
      createdAt: item.createdAt ?? '',
      status: item.status ?? 'UnknownStatus',
      isSeenByEndUser,
    };
  });
}

export const searchDialogs = (
  partyURIs: string[],
  search: string | undefined,
  org: string | undefined,
): Promise<GetAllDialogsForPartiesQuery> => {
  return graphQLSDK.getAllDialogsForParties({
    partyURIs,
    search,
    org,
  });
};

export const getDialogs = (partyURIs: string[]): Promise<GetAllDialogsForPartiesQuery> =>
  graphQLSDK.getAllDialogsForParties({
    partyURIs,
  });

interface searchDialogsProps {
  parties: PartyFieldsFragment[];
  searchString?: string;
  org?: string;
  status?: DialogStatus;
}
interface UseSearchDialogsOutput {
  isLoading: boolean;
  isSuccess: boolean;
  searchResults: InboxItemInput[];
  isFetching: boolean;
}

export const useSearchDialogs = ({ parties, searchString, org }: searchDialogsProps): UseSearchDialogsOutput => {
  const format = useFormat();
  const partyURIs = parties.map((party) => party.party);
  const debouncedSearchString = useDebounce(searchString, 300)[0];
  const enabled = !!debouncedSearchString && debouncedSearchString.length > 2;
  // const { data, isSuccess, isLoading, isFetching } = useQuery<GetAllDialogsForPartiesQuery>({
  const { data, isSuccess, isLoading, isFetching } = useQuery<GetAllDialogsForPartiesQuery>({
    queryKey: ['searchDialogs', partyURIs, debouncedSearchString, org],
    queryFn: () => searchDialogs(partyURIs, debouncedSearchString, org),
    enabled,
  });
  const [searchResults, setSearchResults] = useState([] as InboxItemInput[]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
  useEffect(() => {
    setSearchResults(enabled ? mapDialogDtoToInboxItem(data?.searchDialogs?.items ?? [], parties, format) : []);
  }, [setSearchResults, data?.searchDialogs?.items, enabled]);

  return {
    isLoading,
    isSuccess,
    searchResults,
    isFetching,
  };
};

export const isInboxDialog = (dialog: InboxItemInput): boolean =>
  dialog.status === DialogStatus.New ||
  dialog.status === DialogStatus.InProgress ||
  dialog.status === DialogStatus.RequiresAttention ||
  dialog.status === DialogStatus.Completed;
export const isDraftDialog = (dialog: InboxItemInput): boolean =>
  [DialogStatus.Draft, DialogStatus.Signing].includes(dialog.status);
export const isSentDialog = (dialog: InboxItemInput): boolean => dialog.status === DialogStatus.Sent;

export const getViewType = (dialog: InboxItemInput): InboxViewType => {
  if (isSentDialog(dialog)) {
    return 'sent';
  }
  if (isDraftDialog(dialog)) {
    return 'drafts';
  }
  return 'inbox';
};

export const useDialogs = (parties: PartyFieldsFragment[]): UseDialogsOutput => {
  const partyURIs = parties.map((party) => party.party);
  const { data, isSuccess, isLoading } = useQuery<GetAllDialogsForPartiesQuery>({
    queryKey: ['dialogs', partyURIs],
    queryFn: () => getDialogs(partyURIs),
    enabled: partyURIs.length > 0,
  });
  const format = useFormat();
  const dialogs = mapDialogDtoToInboxItem(data?.searchDialogs?.items ?? [], parties, format);
  return {
    isLoading,
    isSuccess,
    dialogs,
    dialogsByView: {
      inbox: dialogs.filter(isInboxDialog),
      drafts: dialogs.filter(isDraftDialog),
      sent: dialogs.filter(isSentDialog),
    },
  };
};

const getNewType = (type: string) => {
  switch (type) {
    case 'IN_PROGRESS':
      return 'InProgress';
    case 'NEW':
      return 'New';
    default:
      return type;
  }
};

export const getMetaFields = (item: SearchDialogFieldsFragment, isSeenByEndUser: boolean, format: FormatFunction) => {
  const nOtherSeen = item.seenSinceLastUpdate?.filter((seenLogEntry) => !seenLogEntry.isCurrentEndUser).length ?? 0;
  const metaFields: InboxItemMetaField[] = [];

  metaFields.push({
    type: `status_${getNewType(item.status)}` as InboxItemMetaFieldType,
    label: `${i18n.t('word.status')}: ${item.status}`,
  });

  metaFields.push({ type: 'timestamp', label: format(item.createdAt, 'do MMMM HH:mm') });

  if (typeof item.guiAttachmentCount === 'number' && item.guiAttachmentCount > 0) {
    metaFields.push({
      type: 'attachment',
      label: i18n.t('dialogs.attachment_count', { count: item.guiAttachmentCount }),
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
