import { Sequelize } from 'sequelize-typescript';
import { HelloWorld } from '../models/HelloWorld';

type SupportedDBDialect = 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'mariadb';

const database = process.env.DATABASE_NAME ?? '';
const username = process.env.DATABASE_USERNAME ?? 'root';
const password = process.env.DATABASE_PASSWORD ?? 'root';
const host = process.env.DATABASE_HOST ?? 'localhost';
const dialect = (process.env.DATABASE_DIALECT ?? 'mysql') as SupportedDBDialect;

export const DBConnection = new Sequelize(database, username, password, {
  host,
  dialect,
  models: [HelloWorld],
});
