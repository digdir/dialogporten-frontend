import type { SavedSearchesFieldsFragment } from 'bff-types-generated';

export const savedSearchesMock: SavedSearchesFieldsFragment[] = [
  {
    id: 1,
    name: '',
    createdAt: '1727346030948',
    updatedAt: '1727346030948',
    data: {
      urn: ['urn:altinn:person:identifier-no:14886498226'],
      searchString: '',
      fromView: '/',
      filters: [
        {
          id: 'status',
          value: 'COMPLETED',
        },
      ],
    },
  },
  {
    id: 2,
    name: '',
    createdAt: '1729252080765',
    updatedAt: '1729252080765',
    data: {
      urn: ['urn:altinn:person:identifier-no:14886498226'],
      searchString: '',
      fromView: '/',
      filters: [
        {
          id: 'sender',
          value: 'Digitaliseringsdirektoratet',
        },
        {
          id: 'status',
          value: 'IN_PROGRESS',
        },
      ],
    },
  },
  {
    id: 3,
    name: '',
    createdAt: '1729252080765',
    updatedAt: '1729252080765',
    data: {
      urn: ['urn:altinn:person:identifier-no:14886498226'],
      searchString: '',
      fromView: '/',
      filters: [
        {
          id: 'status',
          value: 'COMPLETED',
        },
      ],
    },
  },
];
