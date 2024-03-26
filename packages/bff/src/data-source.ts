import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import config from './config';
import logger from './logger';

const isDev = process.env.DEV_ENV === 'dev';

logger.info('isDev: ', isDev);

logger.info(
  'REMINDER: In datasource file, synchronize needs to be changed to false for production',
  process.env.DEV_ENV,
);

export const connectionOptions: DataSourceOptions = {
  type: 'postgres',
  url: config.postgresql.connectionString,
  synchronize: isDev,
  logging: isDev,
  entities: ['src/entities/*{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*.ts'],
  ...(!isDev && {
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
};

export default new DataSource({
  ...connectionOptions,
});
