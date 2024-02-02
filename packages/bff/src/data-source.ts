import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import './config/env';

console.log(
  'REMINDER: In datasource file, synchronize needs to be changed to false for production'
);

export let connectionOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST !== 'undefined' ? process.env.DB_HOST : 'postgresdb-dp-fe',
  port: 5432,
  username: process.env.DB_USER !== 'undefined' ? process.env.DB_USER : 'postgres',
  password: process.env.DB_PASSWORD !== 'undefined' ? process.env.DB_PASSWORD : 'mysecretpassword',
  database: process.env.DB_NAME !== 'undefined' ? process.env.DB_NAME : 'dialogporten',
  synchronize: true, // if true, you don't really need migrations // ENDRES!!!!!!!!!!!!!
  logging: false,
  entities: ['src/entities/*{.ts,.js}'], // where our entities reside
  // migrations: ['src/migrations/*{.ts,.js}'], // where our migrations reside
  migrations: [__dirname + '/migrations/**/*.ts'],
  ...(process.env.DEV_ENV !== 'dev' && {
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
};

console.log({ ...connectionOptions });
export default new DataSource({
  ...connectionOptions,
});
