import {
  ActivityType,
  ActorType,
  AttachmentUrlConsumer,
  DialogByIdFieldsFragment,
  GuiActionPriority,
  HttpVerb,
  SearchDialogFieldsFragment
} from "bff-types-generated";

export const convertToDialogByIdTemplate = (input: SearchDialogFieldsFragment): DialogByIdFieldsFragment => {
  return {
    id: input.id,
    dialogToken: "MOCKED_DIALOG_TOKEN",
    party: input.party,
    org: input.org,
    progress: input.progress,
    systemLabel: input.systemLabel,
    attachments: [
      {
        id: input.id,
        displayName: [
          {
            value: "kvittering.pdf",
            languageCode: "nb"
          }
        ],
        urls: [
          {
            "id": "hello-attachment-id",
            "url": "https://info.altinn.no/om-altinn/",
            "consumerType": AttachmentUrlConsumer.Gui,
          }
        ]
      }
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
      }
    ],
    guiActions: [
      {
        id: input.id,
        url: "urn:dialogporten:unauthorized",
        isAuthorized: false,
        isDeleteDialogAction: false,
        action: "submit",
        authorizationAttribute: null,
        priority: GuiActionPriority.Primary,
        httpMethod: HttpVerb.Get,
        title: [
          {
            languageCode: "nb",
            value: "Til skjema"
          }
        ],
        prompt: []
      }
    ],
    seenSinceLastUpdate: input.seenSinceLastUpdate.map((seen: any) => ({
      id: seen.id,
      seenAt: seen.seenAt,
      seenBy: {
        actorType: seen.seenBy.actorType,
        actorId: seen.seenBy.actorId,
        actorName: seen.seenBy.actorName
      },
      isCurrentEndUser: seen.isCurrentEndUser
    })),
    status: input.status,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
    extendedStatus: input.extendedStatus,
    content: {
      title: input.content.title,
      summary: input.content.summary,
      senderName: input.content.senderName,
      additionalInfo: {
        mediaType: "text/plain",
        value: [
          {
            value: "Denne setningen inneholder tilleggsinformasjon for dialogen.",
            languageCode: "nb"
          }
        ]
      },
      extendedStatus: input.content.extendedStatus,
      mainContentReference:{
        "mediaType": "application/vnd.dialogporten.frontchannelembed+json;type=markdown",
        "value": [
          {
            "value": "https://dialogporten-serviceprovider.net/fce",
            "languageCode": "nb"
          }
        ]
      }
    }
  };
}
