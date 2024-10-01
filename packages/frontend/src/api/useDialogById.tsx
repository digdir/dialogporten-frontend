import { useQuery } from '@tanstack/react-query';
import type {
  AttachmentFieldsFragment,
  DialogActivityFragment,
  DialogByIdFieldsFragment,
  GetDialogByIdQuery,
  PartyFieldsFragment,
} from 'bff-types-generated';
import type { GuiActionButtonProps, InboxItemMetaField } from '../components';
import { QUERY_KEYS } from '../constants/queryKeys.ts';
import { i18n } from '../i18n/config.ts';
import { getOrganisation } from './organisations.ts';
import { graphQLSDK } from './queries.ts';

export interface Participant {
  name: string;
  isCompany: boolean;
  imageURL?: string;
}

interface MainContentReference {
  url: string;
  mediaType: 'markdown' | 'html' | 'unknown';
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
  additionalInfo: string | React.ReactNode;
  attachments: AttachmentFieldsFragment[];
  dialogToken: string;
  mainContentReference?: MainContentReference;
  activities: DialogActivity[];
  updatedAt: string;
  createdAt: string;
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

type ValueType =
  | Array<{
      __typename?: 'Localization';
      value: string;
      languageCode: string;
    }>
  | null
  | undefined;

export const getPropertyByCultureCode = (value: ValueType): string => {
  const defaultCultureCodes = ['nb'];
  if (value) {
    return value.find((item) => defaultCultureCodes.includes(item.languageCode))?.value ?? '';
  }
  return '';
};

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
): MainContentReference | undefined => {
  if (typeof args === 'undefined' || args === null) return undefined;

  const { value, mediaType } = args;
  const url = getPropertyByCultureCode(value);

  /* TODO: add support for frontchannelembed+json;type=html */
  switch (mediaType) {
    case 'text/markdown':
    case 'application/vnd.dialogporten.frontchannelembed+json;type=markdown':
      return { url, mediaType: 'markdown' };
    default:
      return { url, mediaType: 'unknown' };
  }
};

export function mapDialogDtoToInboxItem(
  item: DialogByIdFieldsFragment | null | undefined,
  parties: PartyFieldsFragment[],
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
  const serviceOwner = getOrganisation(item.org, 'nb');
  const isSeenByEndUser = item.seenSinceLastUpdate.find((seenLogEntry) => seenLogEntry.isCurrentEndUser) !== undefined;

  return {
    title: getPropertyByCultureCode(titleObj),
    summary: getPropertyByCultureCode(summaryObj),
    sender: {
      name: serviceOwner?.name ?? '',
      isCompany: true,
      imageURL: serviceOwner?.logo,
    },
    receiver: {
      name: actualReceiverParty?.name ?? '',
      isCompany: actualReceiverParty?.partyType === 'Organisation',
    },
    metaFields: getMetaFields(item, isSeenByEndUser),
    additionalInfo: getPropertyByCultureCode(additionalInfoObj),
    guiActions: item.guiActions.map((guiAction) => ({
      id: guiAction.id,
      url: guiAction.url,
      hidden: !guiAction.isAuthorized,
      priority: guiAction.priority,
      httpMethod: guiAction.httpMethod,
      title: getPropertyByCultureCode(guiAction.title),
      prompt: getPropertyByCultureCode(guiAction.prompt),
      isDeleteAction: guiAction.isDeleteDialogAction,
      disabled: !guiAction.isAuthorized,
    })),
    attachments: item.attachments.filter((attachment) => attachment.urls.length > 0),
    mainContentReference: getMainContentReference(mainContentReference),
    dialogToken: item.dialogToken!,
    activities: item.activities
      .map((activity) => ({
        id: activity.id,
        type: activity.type,
        createdAt: activity.createdAt,
        performedBy: activity.performedBy,
        description: getPropertyByCultureCode(activity.description),
      }))
      .reverse(),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}
export const useDialogById = (parties: PartyFieldsFragment[], id?: string): UseDialogByIdOutput => {
  const partyURIs = parties.map((party) => party.party);
  const { data, isSuccess, isLoading } = useQuery<GetDialogByIdQuery>({
    queryKey: [QUERY_KEYS.DIALOG_BY_ID, id],
    staleTime: 1000 * 60 * 10,
    retry: 3,
    queryFn: () => getDialogsById(id!),
    enabled: typeof id !== 'undefined' && partyURIs.length > 0,
  });
  return {
    isLoading,
    isSuccess,
    dialog: mapDialogDtoToInboxItem(data?.dialogById.dialog, parties),
  };
};
