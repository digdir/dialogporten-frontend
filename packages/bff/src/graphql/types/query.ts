import { list, objectType } from 'nexus';
import { getOrCreateProfile } from '../../entities.ts';
import { SavedSearchRepository } from '../../db.ts';
export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('profile', {
      type: 'Profile',
      resolve: async (source, args, ctx, info) => {
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
    t.field('savedSearches', {
      type: list('SavedSearches'),
      resolve: async (source, args, ctx, info) => {
        const sub = ctx.session.get('sub');
        if (SavedSearchRepository) {
          return await SavedSearchRepository.find({
            where: { profile: { sub } },
          });
        }
        return [];
      },
    });
    t.field('hello', {
      type: 'String',
      resolve: () => {
        return 'Hello, World!';
      },
    });
  },
});
