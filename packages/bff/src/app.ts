#!/usr/bin/env -S node --no-warnings=ExperimentalWarning --loader ts-node/esm
import 'reflect-metadata';
import { app } from './config.ts';
import { runMigrationApp } from './run-migration.ts';
import startServer from './server.ts';

try {
  if (app.migrationRun) {
    await runMigrationApp();
  } else {
    await startServer();
  }
} catch (error) {
  console.error(error);
}
