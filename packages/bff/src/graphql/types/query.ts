import { list, objectType } from 'nexus';
import { SavedSearchRepository } from '../../db.ts';
import { getOrCreateProfile } from '../functions/profile.ts';
import { getOrganizationsFromRedis } from './organization.ts';

export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('profile', {
      type: 'Profile',
      resolve: async (_source, _args, ctx) => {
        const sub = ctx.session.get('sub');
        const locale = ctx.session.get('locale');
        const profile = await getOrCreateProfile(sub, locale);
        const { language, updatedAt } = profile;
        return {
          language,
          updatedAt,
        };
      },
    });

    t.field('organizations', {
      type: list('Organization'),
      resolve: async () => {
        try {
          return await getOrganizationsFromRedis();
        } catch (error) {
          console.error('Failed to fetch organizations from Redis:', error);
          throw new Error('Failed to fetch organizations');
        }
      },
    });

    t.field('savedSearches', {
      type: list('SavedSearches'),
      resolve: async (_source, _args, ctx) => {
        const sub = ctx.session.get('sub');
        if (SavedSearchRepository) {
          return await SavedSearchRepository.find({
            where: { profile: { sub } },
            order: { updatedAt: 'DESC' },
          });
        }
        return [];
      },
    });
  },
});
