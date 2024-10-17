import { inputObjectType, list, objectType } from 'nexus';

export const Response = objectType({
  name: 'Response',
  definition(t) {
    t.nonNull.boolean('success');
    t.string('message');
  },
});

export const SavedSearchInput = inputObjectType({
  name: 'SavedSearchInput',
  definition(t) {
    t.string('searchString');
    t.string('fromView');
    t.list.string('urn');
    t.list.field('filters', { type: 'SearchDataValueFilterInput' });
  },
});

export const SearchDataValueFilterInput = inputObjectType({
  name: 'SearchDataValueFilterInput',
  definition(t) {
    t.string('id');
    t.string('value');
  },
});

export const SavedSearches = objectType({
  name: 'SavedSearches',
  nonNullDefaults: {
    input: true,
    output: true,
  },
  definition(t) {
    t.int('id', {
      description: 'id of savedSearch',
      resolve: (source) => {
        return source.id;
      },
    });
    t.string('name', {
      description: 'Name of saved search',
      resolve: (source) => {
        return source.name;
      },
    });
    t.field('data', {
      type: 'SavedSearchData',
      description: 'Data of saved search, contains searchString and filters',
      resolve: (source) => {
        return source.data;
      },
    });
    t.string('createdAt', {
      description: 'createdAt',
      resolve: (source) => {
        return source.createdAt;
      },
    });
    t.string('updatedAt', {
      description: 'updatedAt',
      resolve: (source) => {
        return source.updatedAt;
      },
    });
  },
});

export const SavedSearchData = objectType({
  name: 'SavedSearchData',
  definition(t) {
    t.string('searchString', {
      description: 'searchString of savedSearch',
      resolve: (source) => {
        return source.searchString;
      },
    });
    t.string('fromView', {
      description: 'fromView of savedSearch',
      resolve: (source) => {
        return source.fromView;
      },
    });
    t.list.string('urn', {
      description: 'urns of savedSearch',
      resolve: (source) => {
        return source.urn;
      },
    });
    t.field('filters', {
      type: list('SearchDataValueFilter'),
      description: 'filters for SearchDataFilter',
      resolve: (source) => {
        return source.filters;
      },
    });
  },
});

export const SearchDataValueFilter = objectType({
  name: 'SearchDataValueFilter',
  definition(t) {
    t.string('id', {
      description: 'id',
      resolve: (source) => {
        return source.id;
      },
    });
    t.string('value', {
      description: 'value',
      resolve: (source) => {
        return source.value;
      },
    });
  },
});
