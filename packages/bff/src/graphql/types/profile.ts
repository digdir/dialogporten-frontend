import { objectType } from 'nexus';

export const Profile = objectType({
  name: 'Profile',
  definition(t) {
    t.string('language', {
      description: 'Preferred language for the profile',
      resolve: (profile, args, ctx, info) => {
        return profile.language;
      },
    });
    t.string('updatedAt', {
      description: 'Last updated',
      resolve: (profile, args, ctx, info) => {
        return profile.updatedAt;
      },
    });
  },
});
