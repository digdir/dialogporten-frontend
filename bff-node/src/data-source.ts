// import 'reflect-metadata';
import { DataSource } from 'typeorm';
import './config/env';
import { Person } from './entities/Person';
import { Family } from './entities/Family';
import { getPsqlSettingsSecret } from '.';

console.log(
  `_ Dirname: ${__dirname} data-source.ts: Would connect to Postgres: host: ${process.env.DB_HOST}, user: ${process.env.DB_USER}, password: ${process.env.DB_PASSWORD}, dbname: ${process.env.DB_NAME}, port: ${process.env.DB_PORT}, `
);

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'localhost',
  password: process.env.DB_PASSWORD || 'localhost',
  database: process.env.DB_NAME || 'localhost',
  entities: [Person, Family],
  // entities: ['entities/**/*.{js,ts}'],
  synchronize: true,
  // logging: true,
  // entities: ['entities/*.ts'],
  // migrations: ['migrations/*{.ts,.js}'],
  // migrationsRun: true,
  // migrations: ['./migrations/*.{js,ts}'],
  // migrations: ['./migrations/*.ts'],
  // entities: ['dist/entities/*.ts'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  // entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
  logging: true,
  logger: 'file',
  // cli: {
  //   migrationsDir: 'src/migrations',
  // },
  // migrations: ['dist/migrations/*.ts'],
  // dropSchema: true,
});
