import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

const isDev = process.env.DEV_ENV === 'dev';

console.log('isDev: ', isDev);

console.log(
  'REMINDER: In datasource file, synchronize needs to be changed to false for production',
  process.env.DEV_ENV,
);

export const connectionOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST !== 'undefined' ? process.env.DB_HOST : 'postgresdb-dp-fe',
  port: 5432,
  username: process.env.DB_USER !== 'undefined' ? process.env.DB_USER : 'postgres',
  password: process.env.DB_PASSWORD !== 'undefined' ? process.env.DB_PASSWORD : 'mysecretpassword',
  database: process.env.DB_NAME !== 'undefined' ? process.env.DB_NAME : 'dialogporten',
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

console.log({ ...connectionOptions });
export default new DataSource({
  ...connectionOptions,
});
