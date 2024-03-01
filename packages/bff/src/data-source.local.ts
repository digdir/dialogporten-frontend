// import 'reflect-metadata';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import './config/env';

export const connectionOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5430'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'mysecretpassword',
  database: process.env.DB_NAME || 'dialogporten',
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
