import { ContentType, GetAllDialogsForPartiesQuery, SearchDialogFieldsFragment } from 'bff-types-generated';
import { useQuery } from 'react-query';
import { InboxItemInput } from '../pages/Inbox/Inbox.tsx';
import { graphQLSDK } from './queries.ts';

interface UseDialogsOutput {
  dialogs: InboxItemInput[];
  isSuccess: boolean;
  isLoading: boolean;
}

export const getDialogs = (partyURIs: string[]): Promise<GetAllDialogsForPartiesQuery> =>
  graphQLSDK.getAllDialogsForParties({
    partyURIs,
  });

export function mapDialogDtoToInboxItem(input: SearchDialogFieldsFragment[]): InboxItemInput[] {
  return input.map((item) => {
    const titleObj = item?.content?.find((c) => c.type === ContentType.Title);
    const summaryObj = item?.content?.find((c) => c.type === ContentType.Summary);
    const sender = 'Unknown'; // TODO: Look under activities
    return {
      id: item.id ?? 'MISSING_ID', // Providing a default value for id if it's undefined
      title: titleObj?.value?.[0]?.value || 'No Title',
      description: summaryObj?.value?.[0]?.value ?? 'No Description',
      sender: { label: sender },
      receiver: { label: 'Static Receiver' },
      tags: [],
      linkTo: `/inbox/${item.id}`,
      date: item.createdAt ?? '',
      createdAt: item.createdAt ?? '',
      status: item.status ?? 'UnknownStatus',
    };
  });
}

export const useDialogs = (partyURIs: string[]): UseDialogsOutput => {
  const { data, isSuccess, isLoading } = useQuery<GetAllDialogsForPartiesQuery>({
    queryKey: ['parties', partyURIs],
    queryFn: () => getDialogs(partyURIs),
    enabled: partyURIs.length > 0,
  });
  return {
    isLoading,
    isSuccess,
    dialogs: mapDialogDtoToInboxItem(data?.searchDialogs?.items ?? []),
  };
};
