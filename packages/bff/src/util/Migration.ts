import util from 'util';
import 'reflect-metadata';
import { bffVersion } from '..';
import '../config/env';
import { initAppInsights } from './ApplicationInsightsInit';
import { waitNSeconds } from './waitNSeconds';
import config from '../config/config';

let migrationsuccessful = false;

const execMigration = async () => {
  const { exec } = await import('child_process');
  const execAsync = util.promisify(exec);

  try {
    const { stdout, stderr } = await execAsync('pnpm --filter bff run typeorm migration:run -d src/data-source.ts');
    if (stderr) {
      console.error('BFF: Standard Error:', stderr);
    }
    if (stdout) {
      if (stdout.includes('No migrations are pending')) {
        console.log(bffVersion, ': ', 'Migration: Success! (No migrations were pending)');
        return true;
      } else if (stdout.includes('new migrations must be executed')) {
        console.log(bffVersion, ': ', 'Migration: Success! (New migrations were executed)');
        return true;
      }
      console.log(bffVersion, ': ', 'Migration: Standard Output:', stdout);
    }
    return false;
  } catch (error) {
    console.error('Migration: Error running the command:', error);
    return false;
  }
};

export const runMigrationApp = async () => {
  // ************ INIT APP INSIGHTS ************
  let appInsightSetupComplete = false;
  if (config.applicationInsights.connectionString)
    do {
      try {
        const appInsightResult = await initAppInsights();
        if (appInsightResult === 'Done') appInsightSetupComplete = true;
      } catch (error) {
        console.error(bffVersion, ': ', 'Migration: Error setting up appInsights: ', error);
      }
      await waitNSeconds(1);
    } while (!appInsightSetupComplete);

  // ************ RUN MIGRATION ************
  console.log(bffVersion, ': ', 'MIGRATION: Starting migration:');

  try {
    migrationsuccessful = await execMigration();
  } catch (error) {
    console.error('runMigrationApp: Migration run failed: ', error);
    migrationsuccessful = false;
  }

  if (migrationsuccessful) {
    console.log(bffVersion, ': ', 'Migration successful, setting migrationStatus to true');
    console.log(bffVersion, ': ', 'Migration: Exiting with success');
  } else {
    console.log('Migration not successful, Exiting with failure ');
    process.exit(1);
  }
};
