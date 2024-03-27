import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import config from './config';

const isDev = process.env.DEV_ENV === 'dev';
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

console.log('isDev: ', isDev);
console.log('----- ConnectionOptions');
console.log(JSON.stringify(connectionOptions, undefined, 3));

export default new DataSource({
  ...connectionOptions,
});
