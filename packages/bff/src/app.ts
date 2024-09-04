#!/usr/bin/env -S node --no-warnings=ExperimentalWarning --loader ts-node/esm
import 'reflect-metadata';
import { logger } from '@digdir/dialogporten-node-logger';
import config from './config.ts';
import { runMigrationApp } from './run-migration.ts';
import startServer from './server.ts';

try {
  if (config.migrationRun) {
    await runMigrationApp();
  } else {
    await startServer();
  }
} catch (error) {
  logger.error(error);
}
