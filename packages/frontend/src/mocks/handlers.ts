import {graphql, http, HttpResponse } from 'msw';
import { dialogs as mockedDialogs } from './dialogs/dialogs.ts';
import {parties} from "./parties.ts";
import {naiveSearchFilter} from "./filters.ts";
import {DialogByIdFieldsFragment, SavedSearchesFieldsFragment} from "bff-types-generated";
import {convertToDialogByIdTemplate} from "./dialogs/helper.ts";
import {savedSearches} from "./searches/searches.ts";

let inMemoryStore = {
  savedSearches: savedSearches,
}

const isAuthenticatedMock = http.get('/api/isAuthenticated', () => {
  return HttpResponse.json({ authenticated: true });
});

const getAllDialogsForPartiesMock = graphql.query('getAllDialogsForParties', (options) => {
  const { variables: { partyURIs, search } } = options;
  const itemsForParty = mockedDialogs.filter((dialog) => partyURIs.includes(dialog.party));
  return HttpResponse.json({
    data: {
      searchDialogs: {
        items: itemsForParty.filter((item) => naiveSearchFilter(item, search)),
      }
    }
  });
})

const getDialogByIdMock = graphql.query('getDialogById', (options) => {
  const { variables: { id } } = options;
  const dialog = mockedDialogs.find((dialog) => dialog.id === id) ?? null;
  const dialogDetails: DialogByIdFieldsFragment | null = dialog ? convertToDialogByIdTemplate(dialog) : null;

  return HttpResponse.json({
    data: {
      dialogById: { dialog: dialogDetails }
    }
  });
})


const getMainContentMock = http.get('https://dialogporten-serviceprovider.net/fce', () => {
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

const getAllPartiesMock = graphql.query('parties', () => {
  return HttpResponse.json({
    data: {
      parties,
    }
  })
})

const getSavedSearchesMock = graphql.query('savedSearches', () => {
  return HttpResponse.json({
    data: {
      savedSearches: inMemoryStore.savedSearches,
    }
  })
})

const getProfileMock = graphql.query('profile', () => {
  return HttpResponse.json({
    data: {
      profile: {
        updatedAt: '1727691732707',
        language: 'nb',
      },
    }
  })
})

const mutateSavedSearchMock = graphql.mutation('CreateSavedSearch', (req) => {
  const { name, data } = req.variables;
  const savedSearch: SavedSearchesFieldsFragment = {
    id: inMemoryStore.savedSearches.length + 1,
    name,
    data,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
  inMemoryStore.savedSearches.push(savedSearch);
  return HttpResponse.json({
    data: {
      CreateSavedSearch: savedSearch,
    }
  })
})

export const handlers = [
  isAuthenticatedMock,
  getAllDialogsForPartiesMock,
  getAllPartiesMock,
  getDialogByIdMock,
  getMainContentMock,
  getSavedSearchesMock,
  getProfileMock,
  mutateSavedSearchMock,
]


