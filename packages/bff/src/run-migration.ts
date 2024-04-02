import util from 'util';
import 'reflect-metadata';
import { initAppInsights } from './ApplicationInsightsInit';
import config from './config';

function waitNSeconds(n = 1): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000 * n);
  });
}

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
        console.log(config.version, ': ', 'Migration: Success! (No migrations were pending)');
        return true;
      } else if (stdout.includes('new migrations must be executed')) {
        console.log(config.version, ': ', 'Migration: Success! (New migrations were executed)');
        return true;
      }
      console.log(config.version, ': ', 'Migration: Standard Output:', stdout);
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
        await initAppInsights(config.applicationInsights.connectionString);
        appInsightSetupComplete = true;
      } catch (error) {
        console.error(config.version, ': ', 'Migration: Error setting up appInsights: ', error);
      }
      await waitNSeconds(1);
    } while (!appInsightSetupComplete);

  // ************ RUN MIGRATION ************
  console.log(config.version, ': ', 'MIGRATION: Starting migration:');

  try {
    migrationsuccessful = await execMigration();
  } catch (error) {
    console.error('runMigrationApp: Migration run failed: ', error);
    migrationsuccessful = false;
  }

  if (migrationsuccessful) {
    console.log(config.version, ': ', 'Migration successful, setting migrationStatus to true');
    console.log(config.version, ': ', 'Migration: Exiting with success');
  } else {
    console.log('Migration not successful, Exiting with failure ');
    process.exit(1);
  }
};
