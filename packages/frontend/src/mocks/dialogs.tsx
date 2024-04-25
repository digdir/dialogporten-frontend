import { InboxItemInput } from '../pages/Inbox/Inbox.tsx';

export const dialogs = [
  {
    id: '49608e01-0329-0572-aaaf-20fbb19d3b4a',
    revision: '75c6ce94-a81a-4e49-92b3-22f994b14bfd',
    org: 'digdir',
    serviceResource: 'urn:altinn:resource:ttd-dialogporten-automated-tests',
    party: 'urn:altinn:organization:identifier-no::212475912',
    createdAt: '2024-03-21T08:55:42.5906890Z',
    updatedAt: '2024-03-21T08:55:42.5906890Z',
    status: 'New',
    content: [
      {
        type: 'Title',
        value: [
          {
            value: 'Skjema for rapportering av et eller annet',
            cultureCode: 'nb-no',
          },
        ],
      },
      {
        type: 'Summary',
        value: [
          {
            value: 'Et sammendrag her. Maks 200 tegn, ingen HTML-støtte. Påkrevd. Vises i liste.',
            cultureCode: 'nb-no',
          },
        ],
      },
      {
        type: 'AdditionalInfo',
        value: [
          {
            value:
              'Noe tilsvarende \'body\' i dag (<a href="https://github.com/digdir/dialogporten/blob/main/src/Digdir.Domain.Dialogporten.Application/Common/Extensions/FluentValidation/FluentValidation_LocalizationDto_Extensions.cs">enkel HTML-støtte</a>, inntil 1023 tegn). Ikke påkrevd. Vises kun i detaljvisning.',
            cultureCode: 'nb-no',
          },
        ],
      },
    ],
    elements: [
      {
        id: '253abdb5-ce38-4c55-ba27-5d903aa4a481',
        type: 'super-simple-service:prefill',
        urls: [
          {
            id: '39608e01-0529-0d76-9bab-6c4e361ab37d',
            url: 'https://digdir.apps.tt02.altinn.no/digdir/super-simple-service/#/instance/50756302/58d88b01-8840-8771-a6dd-e51e9809df2c/data/9b18d9f2-d197-4e5a-9b80-bdc0872f1a53',
            mimeType: 'application/json',
            consumerType: 'Api',
          },
        ],
      },
      {
        id: '39608e01-0529-0d76-9bba-00dc83eea40f',
        displayName: [
          {
            value: 'Information Letter',
            cultureCode: 'en-us',
          },
          {
            value: 'Informasjonsskriv',
            cultureCode: 'nb-no',
          },
        ],
        urls: [
          {
            id: '39608e01-0529-0d76-9bca-dba8582098fb',
            url: 'https://someexternalsite.com/with/a/document.pdf',
            mimeType: 'application/pdf',
            consumerType: 'Gui',
          },
          {
            id: '39608e01-0529-0d76-9bd9-0b5da4b51c10',
            url: 'https://someexternalsite.com/with/a/document.docx',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            consumerType: 'Gui',
          },
        ],
      },
    ],
    guiActions: [
      {
        id: '39608e01-0529-0d76-9bda-19dc3598753b',
        action: 'submit',
        url: 'https://digdir.apps.tt02.altinn.no/digdir/super-simple-service/#/instance/50756302/58d88b01-8840-8771-a6dd-e51e9809df2c',
        isBackChannel: false,
        isDeleteAction: false,
        priority: 'Primary',
        title: [
          {
            value: 'Gå til innsending',
            cultureCode: 'nb-no',
          },
        ],
      },
    ],
    apiActions: [
      {
        id: '39608e01-0429-9373-90e5-8548698fc5a0',
        action: 'submit',
        endpoints: [
          {
            id: '39608e01-0429-9373-90f4-5e49e4855264',
            version: '20231015',
            url: 'https://digdir.apps.tt02.altinn.no/digdir/super-simple-service/#/instance/50756302/58d88b01-8840-8771-a6dd-e51e9809df2c/data?dataType=mainform-20231015',
            httpMethod: 'POST',
            requestSchema:
              'https://digdir.apps.tt02.altinn.no/digdir/super-simple-service/api/jsonschema/mainform-20231015',
            responseSchema: 'https://docs.altinn.studio/swagger/altinn-app-v1.json#/components/schemas/DataElement',
            deprecated: false,
          },
        ],
      },
    ],
    activities: [
      {
        id: '39608e01-0429-9373-90cd-c281b4130de7',
        createdAt: '2024-03-21T08:00:00.0000000Z',
        type: 'Information',
        dialogElementId: '253abdb5-ce38-4c55-ba27-5d903aa4a481',
        performedBy: [
          {
            value: 'Norwegian Digitalisation Agency ',
            cultureCode: 'en-us',
          },
          {
            value: 'Digitaliseringsdirektoratet avd. BOD',
            cultureCode: 'nb-no',
          },
        ],
        description: [
          {
            value: 'Form created and prefilled',
            cultureCode: 'en-us',
          },
          {
            value: 'Skjema opprettet og forhåndsutfylt',
            cultureCode: 'nb-no',
          },
        ],
      },
      {
        id: '6d26ab76-f957-4229-a4b2-20dbe80df470',
        createdAt: '2024-03-21T08:55:52.0028870Z',
        performedBy: [
          {
            value: 'Local Development User',
            cultureCode: 'nb-no',
          },
        ],
      },
    ],
  },
  {
    id: '59608e01-0329-0572-aaaf-20fbb19d3b4a',
    revision: '75c6ce94-a81a-4e49-92b3-22f994b14bfd',
    org: 'digdir',
    serviceResource: 'urn:altinn:resource:ttd-dialogporten-automated-tests',
    party: 'urn:altinn:organization:identifier-no::212475912',
    createdAt: '2024-03-21T08:55:42.5906890Z',
    updatedAt: '2024-03-21T08:55:42.5906890Z',
    status: 'New',
    content: [
      {
        type: 'Title',
        value: [
          {
            value: 'Skjema for rapportering av noe viktig',
            cultureCode: 'nb-no',
          },
        ],
      },
      {
        type: 'Summary',
        value: [
          {
            value: 'Et sammendrag her. Maks 200 tegn, ingen HTML-støtte. Påkrevd. Vises i liste.',
            cultureCode: 'nb-no',
          },
        ],
      },
      {
        type: 'AdditionalInfo',
        value: [
          {
            value:
              'Noe tilsvarende \'body\' i dag (<a href="https://github.com/digdir/dialogporten/blob/main/src/Digdir.Domain.Dialogporten.Application/Common/Extensions/FluentValidation/FluentValidation_LocalizationDto_Extensions.cs">enkel HTML-støtte</a>, inntil 1023 tegn). Ikke påkrevd. Vises kun i detaljvisning.',
            cultureCode: 'nb-no',
          },
        ],
      },
    ],
    elements: [
      {
        id: '253abdb5-ce38-4c55-ba27-5d903aa4a481',
        type: 'super-simple-service:prefill',
        urls: [
          {
            id: '39608e01-0529-0d76-9bab-6c4e361ab37d',
            url: 'https://digdir.apps.tt02.altinn.no/digdir/super-simple-service/#/instance/50756302/58d88b01-8840-8771-a6dd-e51e9809df2c/data/9b18d9f2-d197-4e5a-9b80-bdc0872f1a53',
            mimeType: 'application/json',
            consumerType: 'Api',
          },
        ],
      },
      {
        id: '39608e01-0529-0d76-9bba-00dc83eea40f',
        displayName: [
          {
            value: 'Information Letter',
            cultureCode: 'en-us',
          },
          {
            value: 'Informasjonsskriv',
            cultureCode: 'nb-no',
          },
        ],
        urls: [
          {
            id: '39608e01-0529-0d76-9bca-dba8582098fb',
            url: 'https://someexternalsite.com/with/a/document.pdf',
            mimeType: 'application/pdf',
            consumerType: 'Gui',
          },
          {
            id: '39608e01-0529-0d76-9bd9-0b5da4b51c10',
            url: 'https://someexternalsite.com/with/a/document.docx',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            consumerType: 'Gui',
          },
        ],
      },
    ],
    guiActions: [
      {
        id: '39608e01-0529-0d76-9bda-19dc3598753b',
        action: 'submit',
        url: 'https://digdir.apps.tt02.altinn.no/digdir/super-simple-service/#/instance/50756302/58d88b01-8840-8771-a6dd-e51e9809df2c',
        isBackChannel: false,
        isDeleteAction: false,
        priority: 'Primary',
        title: [
          {
            value: 'Gå til innsending',
            cultureCode: 'nb-no',
          },
        ],
      },
    ],
    apiActions: [
      {
        id: '39608e01-0429-9373-90e5-8548698fc5a0',
        action: 'submit',
        endpoints: [
          {
            id: '39608e01-0429-9373-90f4-5e49e4855264',
            version: '20231015',
            url: 'https://digdir.apps.tt02.altinn.no/digdir/super-simple-service/#/instance/50756302/58d88b01-8840-8771-a6dd-e51e9809df2c/data?dataType=mainform-20231015',
            httpMethod: 'POST',
            requestSchema:
              'https://digdir.apps.tt02.altinn.no/digdir/super-simple-service/api/jsonschema/mainform-20231015',
            responseSchema: 'https://docs.altinn.studio/swagger/altinn-app-v1.json#/components/schemas/DataElement',
            deprecated: false,
          },
        ],
      },
    ],
    activities: [
      {
        id: '39608e01-0429-9373-90cd-c281b4130de7',
        createdAt: '2024-03-21T08:00:00.0000000Z',
        type: 'Information',
        dialogElementId: '253abdb5-ce38-4c55-ba27-5d903aa4a481',
        performedBy: [
          {
            value: 'Norwegian Digitalisation Agency ',
            cultureCode: 'en-us',
          },
          {
            value: 'Digitaliseringsdirektoratet avd. BOD',
            cultureCode: 'nb-no',
          },
        ],
        description: [
          {
            value: 'Form created and prefilled',
            cultureCode: 'en-us',
          },
          {
            value: 'Skjema opprettet og forhåndsutfylt',
            cultureCode: 'nb-no',
          },
        ],
      },
      {
        id: '6d26ab76-f957-4229-a4b2-20dbe80df470',
        createdAt: '2024-03-21T08:55:52.0028870Z',
        performedBy: [
          {
            value: 'Local Development User',
            cultureCode: 'nb-no',
          },
        ],
      },
    ],
  },
  {
    id: '39608e01-0329-0572-aaaf-20fbb19d3b4a',
    revision: '75c6ce94-a81a-4e49-92b3-22f994b14bfd',
    org: 'digdir',
    serviceResource: 'urn:altinn:resource:ttd-dialogporten-automated-tests',
    party: 'urn:altinn:organization:identifier-no::212475912',
    createdAt: '2023-03-21T08:55:42.5906890Z',
    updatedAt: '2023-03-21T08:55:42.5906890Z',
    status: 'New',
    content: [
      {
        type: 'Title',
        value: [
          {
            value: 'Skjema for rapportering av noe sånt som det',
            cultureCode: 'nb-no',
          },
        ],
      },
      {
        type: 'Summary',
        value: [
          {
            value: 'Et sammendrag her. Maks 200 tegn, ingen HTML-støtte. Påkrevd. Vises i liste.',
            cultureCode: 'nb-no',
          },
        ],
      },
      {
        type: 'AdditionalInfo',
        value: [
          {
            value:
              'Noe tilsvarende \'body\' i dag (<a href="https://github.com/digdir/dialogporten/blob/main/src/Digdir.Domain.Dialogporten.Application/Common/Extensions/FluentValidation/FluentValidation_LocalizationDto_Extensions.cs">enkel HTML-støtte</a>, inntil 1023 tegn). Ikke påkrevd. Vises kun i detaljvisning.',
            cultureCode: 'nb-no',
          },
        ],
      },
    ],
    elements: [
      {
        id: '253abdb5-ce38-4c55-ba27-5d903aa4a481',
        type: 'super-simple-service:prefill',
        urls: [
          {
            id: '39608e01-0529-0d76-9bab-6c4e361ab37d',
            url: 'https://digdir.apps.tt02.altinn.no/digdir/super-simple-service/#/instance/50756302/58d88b01-8840-8771-a6dd-e51e9809df2c/data/9b18d9f2-d197-4e5a-9b80-bdc0872f1a53',
            mimeType: 'application/json',
            consumerType: 'Api',
          },
        ],
      },
      {
        id: '39608e01-0529-0d76-9bba-00dc83eea40f',
        displayName: [
          {
            value: 'Information Letter',
            cultureCode: 'en-us',
          },
          {
            value: 'Informasjonsskriv',
            cultureCode: 'nb-no',
          },
        ],
        urls: [
          {
            id: '39608e01-0529-0d76-9bca-dba8582098fb',
            url: 'https://someexternalsite.com/with/a/document.pdf',
            mimeType: 'application/pdf',
            consumerType: 'Gui',
          },
          {
            id: '39608e01-0529-0d76-9bd9-0b5da4b51c10',
            url: 'https://someexternalsite.com/with/a/document.docx',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            consumerType: 'Gui',
          },
        ],
      },
    ],
    guiActions: [
      {
        id: '39608e01-0529-0d76-9bda-19dc3598753b',
        action: 'submit',
        url: 'https://digdir.apps.tt02.altinn.no/digdir/super-simple-service/#/instance/50756302/58d88b01-8840-8771-a6dd-e51e9809df2c',
        isBackChannel: false,
        isDeleteAction: false,
        priority: 'Primary',
        title: [
          {
            value: 'Gå til innsending',
            cultureCode: 'nb-no',
          },
        ],
      },
    ],
    apiActions: [
      {
        id: '39608e01-0429-9373-90e5-8548698fc5a0',
        action: 'submit',
        endpoints: [
          {
            id: '39608e01-0429-9373-90f4-5e49e4855264',
            version: '20231015',
            url: 'https://digdir.apps.tt02.altinn.no/digdir/super-simple-service/#/instance/50756302/58d88b01-8840-8771-a6dd-e51e9809df2c/data?dataType=mainform-20231015',
            httpMethod: 'POST',
            requestSchema:
              'https://digdir.apps.tt02.altinn.no/digdir/super-simple-service/api/jsonschema/mainform-20231015',
            responseSchema: 'https://docs.altinn.studio/swagger/altinn-app-v1.json#/components/schemas/DataElement',
            deprecated: false,
          },
        ],
      },
    ],
    activities: [
      {
        id: '39608e01-0429-9373-90cd-c281b4130de7',
        createdAt: '2024-03-21T08:00:00.0000000Z',
        type: 'Information',
        dialogElementId: '253abdb5-ce38-4c55-ba27-5d903aa4a481',
        performedBy: [
          {
            value: 'Norwegian Digitalisation Agency ',
            cultureCode: 'en-us',
          },
          {
            value: 'Digitaliseringsdirektoratet avd. BOD',
            cultureCode: 'nb-no',
          },
        ],
        description: [
          {
            value: 'Form created and prefilled',
            cultureCode: 'en-us',
          },
          {
            value: 'Skjema opprettet og forhåndsutfylt',
            cultureCode: 'nb-no',
          },
        ],
      },
      {
        id: '6d26ab76-f957-4229-a4b2-20dbe80df470',
        createdAt: '2024-03-21T08:55:52.0028870Z',
        performedBy: [
          {
            value: 'Local Development Admin',
            cultureCode: 'nb-no',
          },
        ],
      },
    ],
  },
];

export function mapDialogDtoToInboxItem(input: typeof dialogs): InboxItemInput[] {
  return input.map((item) => {
    const titleObj = item?.content?.find((c) => c.type === 'Title');
    const summaryObj = item?.content?.find((c) => c.type === 'Summary');
    const sender = item.activities?.length
      ? item.activities[item.activities.length - 1]?.performedBy?.[0]?.value ?? 'Unknown'
      : 'Unknown';
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
