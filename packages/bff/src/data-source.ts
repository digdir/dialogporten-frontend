import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import config from './config';

console.log(
  `REMINDER: In datasource file, synchronize needs to be changed to false for production (isDev: ${config.isDev}`,
);

export const connectionOptions: DataSourceOptions = {
  type: 'postgres',
  url: config.postgresql.connectionString,
  synchronize: config.isDev,
  logging: false,
  entities: ['src/entities/*{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*.ts'],
  ...(!config.isDev && {
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
};

export default new DataSource(connectionOptions);
