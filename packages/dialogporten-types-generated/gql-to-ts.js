#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
const basename = path.basename;

const schemaPaths = await glob('./node_modules/@digdir/dialogporten-schema/*.graphql');

console.log(`Found ${schemaPaths.length} graphql schemas`);

const schemas = await Promise.all(
  schemaPaths.map(async (path) => {
    const schema = (await fs.readFile(path, 'utf8')).trim();
    return {
      schema,
      basename: basename(path),
    };
  }),
);

const content = schemas
  .map(({ schema, basename }) => {
    const name = basename.replaceAll('.', '_');
    const escapedSchemas = schema.replaceAll('`', "'").replaceAll('\\"', "'");
    return 'export const ' + name + ' = `' + escapedSchemas + '`';
  })
  .join('\n');

console.log('Writing contend to ./generated/graphql_raw.ts');
fs.writeFile('./generated/graphql_raw.ts', content);
