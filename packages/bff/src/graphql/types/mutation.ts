import { logger } from '@digdir/dialogporten-node-logger';
import { extendType, intArg, nonNull, objectType, stringArg } from 'nexus';
import { SavedSearchRepository } from '../../db.ts';
import { SavedSearch, getOrCreateProfile } from '../../entities.ts';
import { Response, SavedSearchInput, SavedSearches } from './index.ts';

export const Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('deleteSavedSearch', {
      type: Response,
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_, args) => {
        const { id } = args;
        try {
          const result = await SavedSearchRepository!.delete({ id });
          return { success: result?.affected && result?.affected > 0, message: 'Saved search deleted successfully' };
        } catch (error) {
          logger.error(error, 'Failed to delete saved search');
          return { success: false, message: 'Failed to delete saved search' };
        }
      },
    });
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
      resolve: async (_, args) => {
        const { id, name } = args;
        try {
          await SavedSearchRepository!.update(id, { name });
          return { success: true, message: 'Saved search updated successfully' };
        } catch (error) {
          logger.error(error, 'Failed to update saved search');
          return { success: false, message: 'Failed to update saved search' };
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
          logger.error(error, 'Failed to create saved search');
          return error;
        }
      },
    });
  },
});
