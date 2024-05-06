import { objectType } from 'nexus';
import { getOrCreateProfile } from '../../entities/Profile.js';
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
    t.field('hello', {
      type: 'String',
      resolve: () => {
        return 'Hello, World!';
      },
    });
  },
});
