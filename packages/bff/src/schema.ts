import { makeSchema, objectType } from 'nexus';

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('hello', {
      type: 'String',
      resolve: () => {
        return 'Hello!';
      },
    });
  },
});

export const schema = makeSchema({
  types: [Query],
});
