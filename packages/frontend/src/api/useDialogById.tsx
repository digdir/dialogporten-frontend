import { ClockIcon, EyeIcon } from '@navikt/aksel-icons';
import {
  type AttachmentFieldsFragment,
  ContentType,
  type DialogByIdFieldsFragment,
  type GetDialogByIdQuery,
  type PartyFieldsFragment,
} from 'bff-types-generated';
import { useQuery } from 'react-query';
import type { GuiButtonProps } from '../components';
import { i18n } from '../i18n/config.ts';
import { type FormatFunction, useFormat } from '../i18n/useDateFnsLocale.tsx';
import { getOrganisation } from './organisations.ts';
import { graphQLSDK } from './queries.ts';

interface Participant {
  label: string;
  icon?: JSX.Element;
}

interface InboxItemTag {
  label: string;
  icon?: JSX.Element;
  className?: string;
}

export interface DialogByIdDetails {
  toLabel: string;
  description: string | React.ReactNode;
  sender: Participant;
  receiver: Participant;
  title: string;
  tags: InboxItemTag[];
  guiActions: GuiButtonProps[];
  additionalInfo: string | React.ReactNode;
  attachments: AttachmentFieldsFragment[];
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

export const getPropertyByCultureCode = (
  value:
    | Array<{
        __typename?: 'Localization';
        value: string;
        cultureCode: string;
      }>
    | null
    | undefined,
): string => {
  const defaultCultureCodes = ['nb-no', 'nb']; // TODO: Will be changed to -1 iso in the future
  if (value) {
    return value.find((item) => defaultCultureCodes.includes(item.cultureCode))?.value ?? '';
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

export function mapDialogDtoToInboxItem(
  item: DialogByIdFieldsFragment | null | undefined,
  parties: PartyFieldsFragment[],
  format: FormatFunction,
): DialogByIdDetails | undefined {
  if (!item) {
    return undefined;
  }
  const titleObj = item?.content?.find((c) => c.type === ContentType.Title)?.value;
  const additionalInfoObj = item?.content?.find((c) => c.type === ContentType.AdditionalInfo)?.value;
  const summaryObj = item?.content?.find((c) => c.type === ContentType.Summary)?.value;
  const nameOfParty = parties?.find((party) => party.party === item.party)?.name ?? '';
  const serviceOwner = getOrganisation(item.org, 'nb');
  return {
    title: getPropertyByCultureCode(titleObj),
    description: getPropertyByCultureCode(summaryObj),
    toLabel: i18n.t('word.to'), // TODO: Remove this
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
    tags: getTags(item, format),
    additionalInfo: getPropertyByCultureCode(additionalInfoObj),
    guiActions: item.guiActions.map((guiAction) => ({
      id: guiAction.id,
      url: guiAction.url,
      hidden: !guiAction.isAuthorized,
      priority: guiAction.priority,
      method: guiAction.action,
      title: getPropertyByCultureCode(guiAction.title),
    })),
    attachments: item.attachments,
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
