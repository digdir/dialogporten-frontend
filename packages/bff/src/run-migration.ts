import util from 'util';
import 'reflect-metadata';
import { initAppInsights } from './ApplicationInsightsInit';
import config from './config';
import logger from './logger';

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
      logger.error('BFF: Standard Error:', stderr);
    }
    if (stdout) {
      if (stdout.includes('No migrations are pending')) {
        logger.info(config.version, ': ', 'Migration: Success! (No migrations were pending)');
        return true;
      } else if (stdout.includes('new migrations must be executed')) {
        logger.info(config.version, ': ', 'Migration: Success! (New migrations were executed)');
        return true;
      }
      logger.info(config.version, ': ', 'Migration: Standard Output:', stdout);
    }
    return false;
  } catch (error) {
    logger.error('Migration: Error running the command:', error);
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
        logger.error(config.version, ': ', 'Migration: Error setting up appInsights: ', error);
      }
      await waitNSeconds(1);
    } while (!appInsightSetupComplete);

  // ************ RUN MIGRATION ************
  logger.info(config.version, ': ', 'MIGRATION: Starting migration:');

  try {
    migrationsuccessful = await execMigration();
  } catch (error) {
    logger.error('runMigrationApp: Migration run failed: ', error);
    migrationsuccessful = false;
  }

  if (migrationsuccessful) {
    logger.info(config.version, ': ', 'Migration successful, setting migrationStatus to true');
    logger.info(config.version, ': ', 'Migration: Exiting with success');
  } else {
    logger.info('Migration not successful, Exiting with failure ');
    process.exit(1);
  }
};
