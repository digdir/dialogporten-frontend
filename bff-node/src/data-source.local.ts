// import 'reflect-metadata';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import './config/env';

console.log(
  `_ DATASOURCE LOCAL FILE: Dirname: ${__dirname} data-source.ts: Would connect to Postgres: host: ${process.env.DB_HOST}, user: ${process.env.DB_USER}, password: ${process.env.DB_PASSWORD}, dbname: ${process.env.DB_NAME}, port: ${process.env.DB_PORT}, `
);

// export const dataSource = new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT || '5432'),
//   username: process.env.DB_USER || 'postgres',
//   password: process.env.DB_PASSWORD || 'password',
//   database: process.env.DB_NAME || 'my_db',
//   entities: [Person, Family],
//   // entities: ['entities/**/*.{js,ts}'],
//   synchronize: true,
//   // logging: true,
//   // entities: ['entities/*.ts'],
//   // migrations: ['migrations/*{.ts,.js}'],
//   // migrationsRun: true,
//   // migrations: ['./migrations/*.{js,ts}'],
//   // migrations: ['./migrations/*.ts'],
//   // entities: ['dist/entities/*.ts'],
//   migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
//   // entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
//   logging: true,
//   logger: 'file',
//   // cli: {
//   //   migrationsDir: 'src/migrations',
//   // },
//   // migrations: ['dist/migrations/*.ts'],
//   // dropSchema: true,
// });

// process.env.DB_HOST = 'localhost';
// process.env.DB_USER = 'postgres';
// process.env.DB_PORT = '5430';
// process.env.DB_PASSWORD = 'mysecretpassword';
// process.env.DB_NAME = 'dialogporten';
export let connectionOptions: DataSourceOptions = {
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
// export let connectionOptions: DataSourceOptions = {
//   type: 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT || '5432'),
//   username: process.env.DB_USER || 'postgres',
//   password: process.env.DB_PASSWORD || 'password',
//   database: process.env.DB_NAME || 'my_db',
//   // synchronize: true, // if true, you don't really need migrations // ENDRES!!!!!!!!!!!!!
//   logging: true,
//   entities: ['src/entities/*{.ts,.js}'], // where our entities reside
//   migrations: ['src/migrations/*{.ts,.js}'], // where our migrations reside
//   ...(process.env.DEV_ENV !== 'dev' && {
//     extra: {
//       ssl: {
//         rejectUnauthorized: false,
//       },
//     },
//   }),
// };

// export const getConnectionOptions: any = (postgresSettingsObject: any) => {
//   const { host, password, dbname, port: dbport, sslmode, user } = postgresSettingsObject;
//   return {
//     type: 'postgres',
//     host: host || 'localhost',
//     port: parseInt(dbport || '5432'),
//     username: user || 'postgres',
//     password: password || 'password',
//     database: dbname || 'my_db',
//     synchronize: true, // if true, you don't really need migrations // ENDRES!!!!!!!!!!!!!
//     logging: true,
//     entities: ['src/entities/*{.ts,.js}'], // where our entities reside
//     migrations: ['src/migrations/*{.ts,.js}'], // where our migrations reside
//     extra: {
//       ssl: {
//         rejectUnauthorized: false,
//       },
//     },
//   };
// };

console.log('_ dataSource connectionOptions:', connectionOptions);

export default new DataSource({
  ...connectionOptions,
});
// export const getDataSource = (postgresSettingsObject: any) =>
//   new DataSource({
//     ...getConnectionOptions(postgresSettingsObject),
//   });
