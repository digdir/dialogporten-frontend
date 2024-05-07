import { objectType } from 'nexus';

export const Profile = objectType({
  name: 'Profile',
  definition(t) {
    t.string('language', {
      description: 'Preferred language for the profile',
      resolve: (source, args, ctx, info) => {
        return source.language;
      },
    });
    t.string('updatedAt', {
      description: 'Last updated',
      resolve: (source, args, ctx, info) => {
        return source.updatedAt;
      },
    });
  },
});
