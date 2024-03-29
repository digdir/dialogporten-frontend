import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import config from './config';

const isDev = process.env.DEV_ENV === 'dev';

console.log('isDev: ', isDev);

console.log(
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
