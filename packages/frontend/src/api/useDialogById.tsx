import { ClockIcon, EyeIcon } from '@navikt/aksel-icons';
import type {
  AttachmentFieldsFragment,
  DialogByIdFieldsFragment,
  GetDialogByIdQuery,
  PartyFieldsFragment,
} from 'bff-types-generated';
import { useQuery } from 'react-query';
import type { GuiActionButtonProps } from '../components';
import { i18n } from '../i18n/config.ts';
import { type FormatFunction, useFormat } from '../i18n/useDateFnsLocale.tsx';
import { getOrganisation } from './organisations.ts';
import { graphQLSDK } from './queries.ts';

export interface Participant {
  name: string;
  isCompany: boolean;
  imageURL?: string;
}

interface InboxItemTag {
  label: string;
  icon?: JSX.Element;
  className?: string;
}

interface MainContentReference {
  url: string;
  mediaType: 'markdown' | 'html' | 'unknown';
}

export interface DialogByIdDetails {
  toLabel: string;
  description: string | React.ReactNode;
  sender: Participant;
  receiver: Participant;
  title: string;
  tags: InboxItemTag[];
  guiActions: GuiActionButtonProps[];
  additionalInfo: string | React.ReactNode;
  attachments: AttachmentFieldsFragment[];
  dialogToken: string;
  mainContentReference?: MainContentReference;
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

/* TODO: Add more tags */
const getTags = (item: DialogByIdFieldsFragment, format: FormatFunction): { label: string; icon: JSX.Element }[] => {
  const tags = [];
  tags.push({ label: format(item.createdAt, 'do MMMM'), icon: <ClockIcon /> });
  if (item.seenSinceLastUpdate.find((seenLogEntry) => seenLogEntry.isCurrentEndUser)) {
    tags.push({
      label: i18n.t('word.seen'),
      icon: <EyeIcon />,
    });
  }
  return tags;
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
  format: FormatFunction,
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
  return {
    title: getPropertyByCultureCode(titleObj),
    description: getPropertyByCultureCode(summaryObj),
    toLabel: i18n.t('word.to'), // TODO: Remove this
    sender: {
      name: serviceOwner?.name ?? '',
      isCompany: true,
      imageURL: serviceOwner?.logo,
    },
    receiver: {
      name: actualReceiverParty?.name ?? '',
      isCompany: actualReceiverParty?.partyType === 'Organisation',
    },
    tags: getTags(item, format),
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
    attachments: item.attachments,
    mainContentReference: getMainContentReference(mainContentReference),
    dialogToken: item.dialogToken!,
  };
}

export const useDialogById = (parties: PartyFieldsFragment[], id?: string): UseDialogByIdOutput => {
  const format = useFormat();
  const partyURIs = parties.map((party) => party.party);
  const { data, isSuccess, isLoading } = useQuery<GetDialogByIdQuery>({
    queryKey: ['dialogById', id],
    queryFn: () => getDialogsById(id!),
    enabled: typeof id !== 'undefined' && partyURIs.length > 0,
  });
  return {
    isLoading,
    isSuccess,
    dialog: mapDialogDtoToInboxItem(data?.dialogById.dialog, parties, format),
  };
};
