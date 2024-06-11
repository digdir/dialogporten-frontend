import { ClockIcon, EyeIcon, PaperclipIcon } from '@navikt/aksel-icons';
import {
  ContentType,
  DialogStatus,
  GetAllDialogsForPartiesQuery,
  PartyFieldsFragment,
  SearchDialogFieldsFragment,
} from 'bff-types-generated';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useQuery } from 'react-query';
import { i18n } from '../i18n/config.ts';
import { InboxItemInput } from '../pages/Inbox/Inbox.tsx';
import { getOrganisation } from './organisations.ts';
import { graphQLSDK } from './queries.ts';

export type InboxViewType = 'inbox' | 'draft' | 'sent';
interface UseDialogsOutput {
  dialogs: InboxItemInput[];
  dialogsByView: {
    [key in InboxViewType]: InboxItemInput[];
  };
  isSuccess: boolean;
  isLoading: boolean;
}


const getPropertyByCultureCode = (value: Record<string, string>[] | undefined): string => {
  const defaultCultureCode = 'nb-no'; // TODO: Will be changed to -1 iso in the future
  if (value) {
    return value.find((item) => item.cultureCode === defaultCultureCode)?.value ?? '';
  }
  return '';
};

/* TODO: Add more tags */
const getTags = (item: SearchDialogFieldsFragment) => {
  const tags = [];
  tags.push({ label: format(item.createdAt, 'do MMMM', { locale: nb }), icon: <ClockIcon /> });
  if (typeof item.guiAttachmentCount === 'number' && item.guiAttachmentCount > 0) {
    tags.push({
      label: i18n.t('dialogs.attachment_count', { count: item.guiAttachmentCount }),
      icon: <PaperclipIcon />,
    });
  }

  if (item.seenSinceLastUpdate.find((seenLogEntry) => seenLogEntry.isCurrentEndUser)) {
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
): InboxItemInput[] {
  return input.map((item) => {
    const titleObj = item?.content?.find((c) => c.type === ContentType.Title)?.value;
    const summaryObj = item?.content?.find((c) => c.type === ContentType.Summary)?.value;
    const nameOfParty = parties?.find((party) => party.party === item.party)?.name ?? '';
    const serviceOwner = getOrganisation(item.org, 'nb');
    return {
      id: item.id,
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
      tags: getTags(item),
      linkTo: `/inbox/${item.id}`,
      date: item.createdAt ?? '',
      createdAt: item.createdAt ?? '',
      status: item.status ?? 'UnknownStatus',
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
  })
};

export const getDialogs = (partyURIs: string[]): Promise<GetAllDialogsForPartiesQuery> =>
  graphQLSDK.getAllDialogsForParties({
    partyURIs,
  });

interface searchDialogsProps {
  parties: PartyFieldsFragment[];
  search?: string;
  org?: string;
  status?: DialogStatus;
}
interface UseSearchDialogsOutput {
  isLoading: boolean;
  isSuccess: boolean;
  searchResults: InboxItemInput[];
}

export const useSearchDialogs = ({
  parties,
  search,
  org,
  status,
}: searchDialogsProps): UseSearchDialogsOutput => {
  const partyURIs = parties.map((party) => party.party);
  const { data, isSuccess, isLoading } = useQuery<GetAllDialogsForPartiesQuery>({
    queryKey: ['searchDialogs', partyURIs, search, org, status],
    queryFn: () => searchDialogs(partyURIs, search, org, status),
    enabled: partyURIs.length > 0,
  });

  return {
    isLoading,
    isSuccess,
    searchResults: mapDialogDtoToInboxItem(data?.searchDialogs?.items ?? [], parties)
  };
};

export const useDialogs = (parties: PartyFieldsFragment[]): UseDialogsOutput => {
  const partyURIs = parties.map((party) => party.party);
  const { data, isSuccess, isLoading } = useQuery<GetAllDialogsForPartiesQuery>({
    queryKey: ['dialogs', partyURIs],
    queryFn: () => getDialogs(partyURIs),
    enabled: partyURIs.length > 0,
  });
  const dialogInboxItems = mapDialogDtoToInboxItem(data?.searchDialogs?.items ?? [], parties);
  return {
    isLoading,
    isSuccess,
    dialogs: dialogInboxItems,
    /* TODO: As soon as logic for performedBy in lastActivity has changed,
     *  checking if service owner is last modifier for inbox items and end user is last modifier for draft, must be added
     */
    dialogsByView: {
      inbox: dialogInboxItems.filter((dii) => dii.status === DialogStatus.New),
      draft: dialogInboxItems.filter((dii) => [DialogStatus.InProgress, DialogStatus.Signing].includes(dii.status)),
      sent: dialogInboxItems.filter((dii) => dii.status === DialogStatus.Completed),
    },
  };
};
