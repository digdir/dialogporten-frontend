import util from 'util';
import 'reflect-metadata';
import { bffVersion } from '.';
import { initAppInsights } from './ApplicationInsightsInit';

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
    const { stdout, stderr } = await execAsync('pnpm typeorm migration:run -d src/data-source.ts');
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
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
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
    let pgJson;
    if (process.env.Infrastructure__DialogDbConnectionString)
      do {
        try {
          pgJson = JSON.parse(process.env.Infrastructure__DialogDbConnectionString!);
        } catch (error) {
          console.error(bffVersion, ': ', 'BFF: Error reading dbConnectionStringOK: ', error);
        }
        await waitNSeconds(1);
      } while (!pgJson?.host);
    process.env.DB_HOST = pgJson?.host;
    process.env.DB_USER = pgJson?.user;
    process.env.DB_PORT = pgJson?.port;
    process.env.DB_PASSWORD = pgJson?.password;
    process.env.DB_NAME = pgJson?.dbname;

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
