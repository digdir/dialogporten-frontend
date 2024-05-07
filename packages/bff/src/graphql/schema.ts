import { makeSchema } from 'nexus';
import * as types from './types/index.ts';
export const schema = makeSchema({
  types,
});
