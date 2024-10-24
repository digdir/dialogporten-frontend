import {graphql, http, HttpResponse} from 'msw';
import {naiveSearchFilter} from './filters.ts';
import type {
  DialogByIdFieldsFragment,
  SavedSearchesFieldsFragment,
  UpdateSystemLabelMutationVariables
} from 'bff-types-generated';
import {convertToDialogByIdTemplate} from './data/base/helper.ts';
import {getMockedData} from "./data.ts";

const data = await getMockedData(window.location.href);

let inMemoryStore = {
  savedSearches: data.savedSearches,
  profile: data.profile,
  dialogs: data.dialogs,
  parties: data.parties,
};

const isAuthenticatedMock = http.get('/api/isAuthenticated', () => {
  return HttpResponse.json({ authenticated: true });
});

const getAllDialogsForPartiesMock = graphql.query('getAllDialogsForParties', (options) => {
  const {
    variables: { partyURIs, search },
  } = options;
  const itemsForParty = inMemoryStore.dialogs
    .filter(dialog => partyURIs.includes(dialog.party))

  return HttpResponse.json({
    data: {
      searchDialogs: {
        items: itemsForParty.filter((item) => naiveSearchFilter(item, search)),
      },
    },
  });
});

const getDialogByIdMock = graphql.query('getDialogById', (options) => {
  const {
    variables: { id },
  } = options;
  const dialog = inMemoryStore.dialogs.find((dialog) => dialog.id === id) ?? null;
  const dialogDetails: DialogByIdFieldsFragment | null = dialog ? convertToDialogByIdTemplate(dialog) : null;
  return HttpResponse.json({
    data: {
      dialogById: {
        dialog: dialogDetails
      },
    },
  });
});


const getMainContentMarkdownMock = http.get('https://dialogporten-serviceprovider.net/fce-markdown', () => {
  return HttpResponse.text(`# Info i markdown

Dette er HTML som er generert fra markdown.

## Grunnleggende konsepter fra markdown

1. **Overskrifter**: Bruk \`#\` for å lage overskrifter. Antall \`#\` indikerer nivået på overskriften (f.eks. \`##\` for nivå 2).
2. **Lister**: For punktlister, bruk \`-\`, \`+\` eller \`*\`. For nummererte lister, bruk tall etterfulgt av punktum (f.eks. \`1.\`).
3. **Lenker**: Lag lenker med \`[link-tekst](url)\`. For eksempel: \`[CommonMark](https://commonmark.org)\`.
4. **Fet tekst**: Bruk \`**\` eller \`__\` for å lage fet tekst. F.eks. \`**dette er viktig**\`.
5. **Kodeblokker**: Bruk tre backticks (\`\`\`) for å lage kodeblokker eller enkel backtick for inline kode (f.eks. \`\` \`kode\` \`\`).
`);
});

const getMainContentHtmlMock = http.get('https://dialogporten-serviceprovider.net/fce-html', () => {
  return HttpResponse.text(`<html><body><h1>Tittel i arvet HTML</h1><p>Brødtekst!</p></body></html>`);
});

const getAllPartiesMock = graphql.query('parties', () => {
  return HttpResponse.json({
    data: {
      parties: inMemoryStore.parties,
    },
  });
});

export const getSavedSearchesMock = graphql.query('savedSearches', () => {
  return HttpResponse.json({
    data: {
      savedSearches: inMemoryStore.savedSearches,
    },
  });
});

const getProfileMock = graphql.query('profile', async () => {
  return HttpResponse.json({
    data: {
      profile: inMemoryStore.profile,
    },
  });
});

const mutateSavedSearchMock = graphql.mutation('CreateSavedSearch', (req) => {
  const { name, data } = req.variables;
  const savedSearch: SavedSearchesFieldsFragment = {
    id: inMemoryStore.savedSearches.length + 1,
    name,
    data,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  inMemoryStore.savedSearches.push(savedSearch);
  return HttpResponse.json({
    data: {
      CreateSavedSearch: savedSearch,
    },
  });
});


const mutateUpdateSystemLabelMock = graphql.mutation('updateSystemLabel', (req) => {
  const { dialogId, label } = req.variables;

  const updatedSystemLabel: UpdateSystemLabelMutationVariables = {
    dialogId,
    label
  };

  inMemoryStore.dialogs = inMemoryStore.dialogs.map(dialog => {
    if (dialog.id === dialogId) {
      dialog.systemLabel = label;
    }
    return dialog;
  });

  return HttpResponse.json({
    data: {
      setSystemLabel: { ...updatedSystemLabel, success: { success: true } }
    },
  });
});

export const handlers = [
  isAuthenticatedMock,
  getAllDialogsForPartiesMock,
  getAllPartiesMock,
  getDialogByIdMock,
  getMainContentMarkdownMock,
  getMainContentHtmlMock,
  getSavedSearchesMock,
  getProfileMock,
  mutateSavedSearchMock,
  mutateUpdateSystemLabelMock
];
