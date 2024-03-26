import 'reflect-metadata';
import { runMigrationApp } from './run-migration';
import logger from './logger';

runMigrationApp()
  .then(() => {
    logger.info('Migration done.');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Migration failed', error);
  });
