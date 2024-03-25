import 'reflect-metadata';
import { runMigrationApp } from './util/Migration';

runMigrationApp()
  .then(() => {
    console.log('Migration done.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed', error);
  });
