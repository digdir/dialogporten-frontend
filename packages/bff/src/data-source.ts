import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import config from './config';

console.log(
  `REMINDER: In datasource file, typeormSynchronizeEnabled needs to be changed to false for production (typeormSynchronizeEnabled: ${config.typeormSynchronizeEnabled})`,
);

export const connectionOptions: DataSourceOptions = {
  type: 'postgres',
  url: config.postgresql.connectionString,
  synchronize: config.typeormSynchronizeEnabled,
  logging: false,
  entities: ['src/entities/*{.ts,.js}'],
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
