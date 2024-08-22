import { arg, extendType, inputObjectType, intArg, list, nonNull, objectType, stringArg } from 'nexus';
import { SavedSearchRepository } from '../../db.ts';
import { SavedSearch, getOrCreateProfile } from '../../entities.ts';

export const Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('deleteSavedSearch', {
      type: Response,
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_, args, ctx) => {
        const { id } = args;
        try {
          const result = await SavedSearchRepository!.delete({ id });
          return { success: result?.affected && result?.affected > 0, message: 'Saved search deleted successfully' };
        } catch (error) {
          console.error('Failed to delete saved search:', error);
          return { success: false, message: 'Failed to delete saved search' };
        }
      },
    });
  },
});

export const Response = objectType({
  name: 'Response',
  definition(t) {
    t.nonNull.boolean('success');
    t.string('message');
  },
});

export const UpdateSavedSearch = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateSavedSearch', {
      type: Response,
      args: {
        id: nonNull(intArg()),
        name: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const { id, name } = args;
        try {
          await SavedSearchRepository!.update(id, { name });
          return { success: true, message: 'Saved search updated successfully' };
        } catch (error) {
          console.error('Failed to updated saved search:', error);
          return { success: false, message: 'Failed to updated saved search' };
        }
      },
    });
  },
});

export const CreateSavedSearch = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createSavedSearch', {
      type: SavedSearches,
      args: {
        name: stringArg(),
        data: SavedSearchInput,
      },
      resolve: async (_, { name, data }, ctx) => {
        try {
          const profile = await getOrCreateProfile(ctx.session.get('sub'), ctx.session.get('locale'));
          const newSavedSearch = new SavedSearch();
          newSavedSearch.name = name;
          newSavedSearch.data = data;
          newSavedSearch.profile = profile;
          return await SavedSearchRepository!.save(newSavedSearch);
        } catch (error) {
          console.error('Failed to create saved search:', error);
          return error;
        }
      },
    });
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
      resolve: (source, args, ctx, info) => {
        return source.id;
      },
    });
    t.string('name', {
      description: 'Name of saved search',
      resolve: (source, args, ctx, info) => {
        return source.name;
      },
    });
    t.field('data', {
      type: 'SavedSearchData',
      description: 'Data of saved search, contains searchString and filters',
      resolve: (source, args, ctx, info) => {
        return source.data;
      },
    });
    t.string('createdAt', {
      description: 'createdAt',
      resolve: (source, args, ctx, info) => {
        return source.createdAt;
      },
    });
    t.string('updatedAt', {
      description: 'updatedAt',
      resolve: (source, args, ctx, info) => {
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
      resolve: (source, args, ctx, info) => {
        return source.searchString;
      },
    });
    t.string('fromView', {
      description: 'fromView of savedSearch',
      resolve: (source, args, ctx, info) => {
        return source.fromView;
      },
    });
    t.list.string('urn', {
      description: 'urns of savedSearch',
      resolve: (source, args, ctx, info) => {
        return source.urn;
      },
    });
    t.field('filters', {
      type: list('SearchDataValueFilter'),
      description: 'filters for SearchDataFilter',
      resolve: (source, args, ctx, info) => {
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
      resolve: (source, args, ctx, info) => {
        return source.id;
      },
    });
    t.string('value', {
      description: 'value',
      resolve: (source, args, ctx, info) => {
        return source.value;
      },
    });
  },
});
