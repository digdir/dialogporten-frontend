import {
  ActivityType,
  ActorType,
  AttachmentUrlConsumer,
  DialogByIdFieldsFragment,
  GuiActionPriority,
  HttpVerb,
  SearchDialogFieldsFragment,
} from 'bff-types-generated';

export const getMockedMainContent = (dialogId: string) => {
  const idWithLegacyHTML = '019241f7-6f45-72fd-a574-f19d358aaf4e';

  if (idWithLegacyHTML === dialogId) {
    return {
      mediaType: 'application/vnd.dialogporten.frontchannelembed+json;type=html',
      value: [
        {
          value: 'https://dialogporten-serviceprovider.net/fce-html',
          languageCode: 'nb',
        },
      ],
    };
  }

  return {
    mediaType: 'application/vnd.dialogporten.frontchannelembed+json;type=markdown',
    value: [
      {
        value: 'https://dialogporten-serviceprovider.net/fce-markdown',
        languageCode: 'nb',
      },
    ],
  };
};

export const convertToDialogByIdTemplate = (input: SearchDialogFieldsFragment): DialogByIdFieldsFragment => {
  return {
    id: input.id,
    dialogToken: 'MOCKED_DIALOG_TOKEN',
    party: input.party,
    org: input.org,
    progress: input.progress,
    systemLabel: input.systemLabel,
    attachments: [
      {
        id: input.id,
        displayName: [
          {
            value: 'kvittering.pdf',
            languageCode: 'nb',
          },
        ],
        urls: [
          {
            id: 'hello-attachment-id',
            url: 'https://info.altinn.no/om-altinn/',
            consumerType: AttachmentUrlConsumer.Gui,
          },
        ],
      },
    ],
    activities: [
      {
        id: input.id,
        performedBy: {
          actorType: input.latestActivity!.performedBy.actorType as ActorType,
          actorId: input.latestActivity!.performedBy.actorId,
          actorName: input.latestActivity!.performedBy.actorName,
        },
        description: input.latestActivity!.description,
        type: ActivityType.Information,
        createdAt: input.createdAt,
      },
    ],
    guiActions: [
      {
        id: input.id,
        url: 'urn:dialogporten:unauthorized',
        isAuthorized: false,
        isDeleteDialogAction: false,
        action: 'submit',
        authorizationAttribute: null,
        priority: GuiActionPriority.Primary,
        httpMethod: HttpVerb.Get,
        title: [
          {
            languageCode: 'nb',
            value: 'Til skjema',
          },
        ],
        prompt: [],
      },
    ],
    // @ts-ignore-next-line
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // biome-ignore lint/suspicious/noExplicitAny: NA
    seenSinceLastUpdate: [
      {
        id: 'c4f4d846-2fe7-4172-badc-abc48f9af8a5',
        seenAt: '2024-09-30T11:36:01.572Z',
        seenBy: {
          actorType: null,
          actorId: 'urn:altinn:person:identifier-ephemeral:2b34ab491b',
          actorName: 'SØSTER FANTASIFULL',
        },
        isCurrentEndUser: true,
      },
    ],
    status: input.status,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
    extendedStatus: input.extendedStatus,
    content: {
      title: input.content.title,
      summary: input.content.summary,
      senderName: input.content.senderName,
      additionalInfo: {
        mediaType: 'text/plain',
        value: [
          {
            value: 'Denne setningen inneholder tilleggsinformasjon for dialogen.',
            languageCode: 'nb',
          },
        ],
      },
      extendedStatus: input.content.extendedStatus,
      mainContentReference: getMockedMainContent(input.id),
    },
  };
};
