import { ClockIcon, EyeIcon, PaperclipIcon } from '@navikt/aksel-icons';
import {
  DialogStatus,
  type GetAllDialogsForPartiesQuery,
  type PartyFieldsFragment,
  type SearchDialogFieldsFragment,
} from 'bff-types-generated';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDebounce } from 'use-debounce';
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

/* TODO: Add more tags */
const getTags = (item: SearchDialogFieldsFragment, isSeenByEndUser: boolean, format: FormatFunction) => {
  const tags = [];
  tags.push({ label: format(item.createdAt, 'do MMMM'), icon: <ClockIcon /> });
  if (typeof item.guiAttachmentCount === 'number' && item.guiAttachmentCount > 0) {
    tags.push({
      label: i18n.t('dialogs.attachment_count', { count: item.guiAttachmentCount }),
      icon: <PaperclipIcon />,
    });
  }

  if (isSeenByEndUser) {
    tags.push({
      label: i18n.t('word.seen'),
      icon: <EyeIcon />,
    });
  }

  return tags;
};

export function mapDialogDtoToInboxItem(
  input: SearchDialogFieldsFragment[],
  parties: PartyFieldsFragment[],
  format: FormatFunction,
): InboxItemInput[] {
  return input.map((item) => {
    const titleObj = item.content.title.value;
    const summaryObj = item.content.summary.value;
    const nameOfParty = parties.find((party) => party.party === item.party)?.name ?? '';
    const serviceOwner = getOrganisation(item.org, 'nb');
    const isSeenByEndUser =
      item.seenSinceLastUpdate.find((seenLogEntry) => seenLogEntry.isCurrentEndUser) !== undefined;
    return {
      id: item.id,
      party: item.party,
      title: getPropertyByCultureCode(titleObj),
      description: getPropertyByCultureCode(summaryObj),
      sender: {
        label: serviceOwner?.name ?? item.org,
        ...(serviceOwner?.logo
          ? {
              icon: <img src={serviceOwner?.logo} alt={`logo of ${serviceOwner?.name ?? item.org}`} />,
            }
          : {}),
      },
      receiver: {
        label: nameOfParty,
      },
      tags: getTags(item, isSeenByEndUser, format),
      linkTo: `/inbox/${item.id}`,
      date: item.createdAt ?? '',
      createdAt: item.createdAt ?? '',
      status: item.status ?? 'UnknownStatus',
      isModifiedLastByServiceOwner: item.latestActivity?.performedBy === null,
      isSeenByEndUser,
    };
  });
}

export const searchDialogs = (
  partyURIs: string[],
  search: string | undefined,
  org: string | undefined,
  status: DialogStatus | undefined,
): Promise<GetAllDialogsForPartiesQuery> => {
  return graphQLSDK.getAllDialogsForParties({
    partyURIs,
    search,
    org,
    status,
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

export const useSearchDialogs = ({
  parties,
  searchString,
  org,
  status,
}: searchDialogsProps): UseSearchDialogsOutput => {
  const format = useFormat();
  const partyURIs = parties.map((party) => party.party);
  const debouncedSearchString = useDebounce(searchString, 300)[0];
  const enabled = !!debouncedSearchString && debouncedSearchString.length > 2;
  const { data, isSuccess, isLoading, isFetching } = useQuery<GetAllDialogsForPartiesQuery>({
    queryKey: ['searchDialogs', partyURIs, debouncedSearchString, org, status],
    queryFn: () => searchDialogs(partyURIs, debouncedSearchString, org, status),
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

export const isInboxDialog = (dialog: InboxItemInput): boolean => dialog.status === DialogStatus.New;
export const isDraftDialog = (dialog: InboxItemInput): boolean =>
  [DialogStatus.InProgress, DialogStatus.Signing].includes(dialog.status);
export const isSentDialog = (dialog: InboxItemInput): boolean => dialog.status === DialogStatus.Completed;

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
