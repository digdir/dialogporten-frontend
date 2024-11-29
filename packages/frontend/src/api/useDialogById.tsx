import { useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  AttachmentFieldsFragment,
  DialogActivityFragment,
  DialogByIdFieldsFragment,
  GetDialogByIdQuery,
  OrganizationFieldsFragment,
  PartyFieldsFragment,
  SystemLabel,
} from 'bff-types-generated';
import { AttachmentUrlConsumer } from 'bff-types-generated';
import type { GuiActionButtonProps, InboxItemMetaField } from '../components';
import { QUERY_KEYS } from '../constants/queryKeys.ts';
import { i18n } from '../i18n/config.ts';
import { type ValueType, getPreferredPropertyByLocale } from '../i18n/property.ts';
import { useOrganizations } from '../pages/Inbox/useOrganizations.ts';
import { getOrganization } from './organizations.ts';
import { graphQLSDK } from './queries.ts';
import { useEffect } from 'react';

export interface Participant {
  name: string;
  isCompany: boolean;
  imageURL?: string;
}

export enum EmbeddableMediaType {
  markdown = 'application/vnd.dialogporten.frontchannelembed+json;type=markdown',
  html = 'application/vnd.dialogporten.frontchannelembed+json;type=html',
}

export interface EmbeddedContent {
  url: string;
  mediaType: EmbeddableMediaType;
}

export interface DialogActivity {
  id: string;
  type: DialogActivityFragment['type'];
  createdAt: string;
  description: string;
  performedBy: DialogActivityFragment['performedBy'];
}
export interface DialogByIdDetails {
  summary: string;
  sender: Participant;
  receiver: Participant;
  title: string;
  metaFields: InboxItemMetaField[];
  guiActions: GuiActionButtonProps[];
  additionalInfo: { value: string; mediaType: string } | undefined;
  attachments: AttachmentFieldsFragment[];
  dialogToken: string;
  mainContentReference?: EmbeddedContent;
  activities: DialogActivity[];
  updatedAt: string;
  createdAt: string;
  label: SystemLabel;
}

interface UseDialogByIdOutput {
  isSuccess: boolean;
  isLoading: boolean;
  dialog?: DialogByIdDetails;
}
export const getDialogsById = (id: string): Promise<GetDialogByIdQuery> =>
  graphQLSDK.getDialogById({
    id,
  });

export const getMetaFields = (item: DialogByIdFieldsFragment, isSeenByEndUser: boolean) => {
  const nOtherSeen = item.seenSinceLastUpdate?.filter((seenLogEntry) => !seenLogEntry.isCurrentEndUser).length ?? 0;
  const metaFields: InboxItemMetaField[] = [];

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

const getMainContentReference = (
  args: { value: ValueType; mediaType: string } | undefined | null,
): EmbeddedContent | undefined => {
  if (typeof args === 'undefined' || args === null) return undefined;

  const { value, mediaType } = args;
  const content = getPreferredPropertyByLocale(value);
  const isValidMediaType = Object.values(EmbeddableMediaType).includes(mediaType as EmbeddableMediaType);

  if (!content || !isValidMediaType) return undefined;

  return {
    url: content.value,
    mediaType: mediaType as EmbeddableMediaType,
  };
};

export function mapDialogDtoToInboxItem(
  item: DialogByIdFieldsFragment | null | undefined,
  parties: PartyFieldsFragment[],
  organizations: OrganizationFieldsFragment[],
): DialogByIdDetails | undefined {
  if (!item) {
    return undefined;
  }

  const titleObj = item?.content?.title?.value;
  const additionalInfoObj = item?.content?.additionalInfo?.value;
  const summaryObj = item?.content?.summary?.value;
  const mainContentReference = item?.content?.mainContentReference;
  const endUserParty = parties?.find((party) => party.isCurrentEndUser);
  const dialogReceiverParty = parties?.find((party) => party.party === item.party);
  const actualReceiverParty = dialogReceiverParty ?? endUserParty;
  const serviceOwner = getOrganization(organizations || [], item.org, 'nb');
  const isSeenByEndUser = item.seenSinceLastUpdate.find((seenLogEntry) => seenLogEntry.isCurrentEndUser) !== undefined;

  return {
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
    additionalInfo: {
      value: getPreferredPropertyByLocale(additionalInfoObj)?.value ?? '',
      mediaType: item.content?.additionalInfo?.mediaType ?? '',
    },
    guiActions: item.guiActions.map((guiAction) => ({
      id: guiAction.id,
      url: guiAction.url,
      hidden: !guiAction.isAuthorized,
      priority: guiAction.priority,
      httpMethod: guiAction.httpMethod,
      title: getPreferredPropertyByLocale(guiAction.title)?.value ?? '',
      prompt: getPreferredPropertyByLocale(guiAction.prompt)?.value,
      isDeleteAction: guiAction.isDeleteDialogAction,
      disabled: !guiAction.isAuthorized,
    })),
    attachments: item.attachments.filter(
      (a) => a.urls.filter((url) => url.consumerType === AttachmentUrlConsumer.Gui).length > 0,
    ),
    mainContentReference: getMainContentReference(mainContentReference),
    dialogToken: item.dialogToken!,
    activities: item.activities
      .map((activity) => ({
        id: activity.id,
        type: activity.type,
        createdAt: activity.createdAt,
        performedBy: activity.performedBy,
        description: getPreferredPropertyByLocale(activity.description)?.value ?? '',
      }))
      .reverse(),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    label: item.systemLabel,
  };
}
export const useDialogById = (parties: PartyFieldsFragment[], id?: string): UseDialogByIdOutput => {
  const queryClient = useQueryClient();
  const { organizations, isLoading: isOrganizationsLoading } = useOrganizations();
  const partyURIs = parties.map((party) => party.party);
  const { data, isSuccess, isLoading } = useQuery<GetDialogByIdQuery>({
    queryKey: [QUERY_KEYS.DIALOG_BY_ID, id, organizations],
    staleTime: 1000 * 60 * 10,
    retry: 3,
    queryFn: () => getDialogsById(id!),
    enabled: typeof id !== 'undefined' && partyURIs.length > 0,
  });

  useEffect(() => {
    if (isSuccess && data?.dialogById.dialog) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DIALOGS],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DIALOG_BY_ID, id],
        exact: true,
      });
    }
  }, [isSuccess, data, id, queryClient]);

  if (isOrganizationsLoading) {
    return { isLoading: true, isSuccess: false };
  }

  return {
    isLoading,
    isSuccess,
    dialog: mapDialogDtoToInboxItem(data?.dialogById.dialog, parties, organizations),
  };
};
