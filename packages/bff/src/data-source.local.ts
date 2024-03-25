// import 'reflect-metadata';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import './config/env';
import config from './config/config';

export const connectionOptions: DataSourceOptions = {
  type: 'postgres',
  url: config.postgresql.connectionString,
  // synchronize: true, // if true, you don't really need migrations // ENDRES!!!!!!!!!!!!!
  logging: true,
  entities: ['src/entities/*{.ts,.js}'], // where our entities reside
  migrations: ['src/migrations/*{.ts,.js}'], // where our migrations reside
  // ...(process.env.DEV_ENV !== 'dev' && {
  //   extra: {
  //     ssl: {
  //       rejectUnauthorized: false,
  //     },
  //   },
  // }),
};
export default new DataSource({
  ...connectionOptions,
});
