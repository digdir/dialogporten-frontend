import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './schema.ts',
  require: ['ts-node/register'],
  documents: 'queries/**/*.graphql',
  generates: {
    './generated/sdk.ts': {
      plugins: [{
        'add': {
          content: '/* eslint-disable */' + '\n' + '// @ts-nocheck'
        }
      }, 'typescript', 'typescript-operations', 'typescript-graphql-request'],
    },
  },
};

export default config;



