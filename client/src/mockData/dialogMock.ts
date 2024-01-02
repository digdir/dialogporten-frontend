export const dialogMock = {
  id: 'c82d8d01-b187-2c74-a8be-bc6e17168e5e',
  revision: 'f713c0f0-a0e0-42e5-a2bd-5b128a4845e0',
  org: 'digdir',
  serviceResource: 'urn:altinn:resource:super-simple-service',
  party: '/org/310702749',
  createdAt: '2024-01-21T20:48:53.1579680Z',
  updatedAt: '2024-01-21T21:33:56.0983520Z',
  status: 'InProgress',
  content: [
    {
      type: 'Title',
      value: [
        {
          value: 'Endret tittel2',
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
            "Noe tilsvarende 'body' i dag (enkel HTML-støtte, inntil 1023 tegn). Ikke påkrevd. Vises kun i detaljvisning.",
          cultureCode: 'nb-no',
        },
      ],
    },
  ],
  elements: [
    {
      id: '20f8ed2b-bedd-4d54-9d19-2350700851e7',
      type: 'super-simple-service:prefill',
      isAuthorized: true,
      urls: [
        {
          id: 'c82d8d01-b387-8475-9069-0b00efe92a87',
          url: 'https://digdir.apps.tt02.altinn.no/digdir/super-simple-service/#/instance/50756302/58d88b01-8840-8771-a6dd-e51e9809df2c/data/9b18d9f2-d197-4e5a-9b80-bdc0872f1a53',
          mimeType: 'application/json',
          consumerType: 'Api',
        },
      ],
    },
  ],
  guiActions: [
    {
      id: 'c82d8d01-b387-8475-9071-11add7715bbb',
      action: 'submit',
      url: 'https://digdir.apps.tt02.altinn.no/digdir/super-simple-service/#/instance/50756302/58d88b01-8840-8771-a6dd-e51e9809df2c',
      isAuthorized: true,
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
      id: 'c82d8d01-b387-8475-900a-404e33d7b20b',
      action: 'submit',
      isAuthorized: true,
      endpoints: [
        {
          id: 'c82d8d01-b387-8475-900d-57c5f863f01c',
          version: '20231015',
          url: 'https://digdir.apps.tt02.altinn.no/digdir/super-simple-service/#/instance/50756302/58d88b01-8840-8771-a6dd-e51e9809df2c/data?dataType=mainform-20231015',
          httpMethod: 'POST',
          requestSchema:
            'https://digdir.apps.tt02.altinn.no/digdir/super-simple-service/api/jsonschema/mainform-20231015',
          responseSchema:
            'https://docs.altinn.studio/swagger/altinn-app-v1.json#/components/schemas/DataElement',
          deprecated: false,
        },
      ],
    },
  ],
  activities: [
    {
      id: 'bd39f185-06ff-4241-91d8-349602456490',
      createdAt: '2024-01-21T20:49:41.1985380Z',
      seenByEndUserName: 'SomeName',
      seenByEndUserIdHash: 'salty010101223344',
      type: 'Seen',
    },
    {
      id: 'c82d8d01-b387-8475-8feb-bc263d42b8c2',
      createdAt: '2023-11-16T13:35:44.2268490Z',
      seenByEndUserIdHash: 'salty',
      type: 'Information',
      dialogElementId: '20f8ed2b-bedd-4d54-9d19-2350700851e7',
      performedBy: [
        {
          value: 'u wut',
          cultureCode: 'en-us',
        },
        {
          value: 'Digitaliseringsdirektoratet avd. BOD',
          cultureCode: 'nb-no',
        },
      ],
      description: [
        {
          value: 'Skjema opprettet og forhåndsutfylt',
          cultureCode: 'nb-no',
        },
      ],
    },
    {
      id: 'f2252055-8ff5-4e19-b10e-ae3a00e93775',
      createdAt: '2024-01-21T21:34:25.6265030Z',
      seenByEndUserName: 'SomeName',
      seenByEndUserIdHash: 'salty010101223344',
      type: 'Seen',
    },
    {
      id: 'f9b99852-8eae-4b9d-b06e-fa4ede3f550b',
      createdAt: '2024-01-21T21:20:09.0986600Z',
      seenByEndUserName: 'SomeName',
      seenByEndUserIdHash: 'salty010101223344',
      type: 'Seen',
    },
  ],
};
