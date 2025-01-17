import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'reflect-metadata';
import { DataSource, type DataSourceOptions } from 'typeorm';
import config from './config.ts';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export const connectionOptions: DataSourceOptions = {
  type: 'postgres',
  url: config.postgresql.connectionString,
  synchronize: false,
  logging: false,
  entities: ['src/entities.ts'],
  migrations: [__dirname + '/migrations/**/*.ts'],
  ...(config.enableHttps && {
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
};

export default new DataSource(connectionOptions);
