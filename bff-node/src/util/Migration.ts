import 'reflect-metadata';
import '../config/env';
import util from 'util';
import { bffVersion, isLocal } from '..';
import { initAppInsights, waitNSeconds } from './InitializaitonUtils';

let migrationsuccessful = false;

const debug = false;

const execMigration = async () => {
  const { exec } = await import('child_process');
  const execAsync = util.promisify(exec);

  try {
    const { stdout, stderr } = await execAsync('yarn typeorm migration:run -d src/data-source.ts');
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
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING && !isLocal)
    do {
      try {
        debug && console.log(bffVersion, ': ', 'runMigrationApp: Starting initAppInsights()');
        const appInsightResult = await initAppInsights();
        if (appInsightResult === 'Done') appInsightSetupComplete = true;
      } catch (error) {
        debug && console.log(bffVersion, ': ', 'Migration: Error setting up appInsights: ', error);
      }
      await waitNSeconds(1);
    } while (!appInsightSetupComplete);
  debug &&
    console.log(bffVersion, ': ', '************* Printing ENV VARS *************', process.env);

  // ************ RUN MIGRATION ************
  debug && console.log(bffVersion, ': ', 'Migration: ************ RUN MIGRATION ************');

  console.log(bffVersion, ': ', 'MIGRATION: Starting migration:');

  try {
    let pgJson;
    if (process.env.Infrastructure__DialogDbConnectionString && !isLocal)
      do {
        try {
          debug && console.log(bffVersion, ': ', 'BFF: Starting dbConnectionStringOK()');
          pgJson = JSON.parse(process.env.Infrastructure__DialogDbConnectionString!);
        } catch (error) {
          debug &&
            console.log(bffVersion, ': ', 'BFF: Error reading dbConnectionStringOK: ', error);
        }
        await waitNSeconds(1);
      } while (!pgJson?.host);
    process.env.DB_HOST = pgJson?.host;
    process.env.DB_USER = pgJson?.user;
    process.env.DB_PORT = pgJson?.port;
    process.env.DB_PASSWORD = pgJson?.password;
    process.env.DB_NAME = pgJson?.dbname;
    // debug && console.log(bffVersion, ': ', 'runMigrationApp: process.env.DB_HOST: ', process.env.DB_HOST);
    // debug && console.log(bffVersion, ': ', 'runMigrationApp: process.env.DB_USER: ', process.env.DB_USER);
    // debug && console.log(bffVersion, ': ', 'runMigrationApp: process.env.DB_PORT: ', process.env.DB_PORT);
    // debug &&
    //   console.log(bffVersion, ': ', 'runMigrationApp: process.env.DB_PASSWORD: ', process.env.DB_PASSWORD);
    debug &&
      console.log(bffVersion, ': ', 'runMigrationApp: process.env.DB_NAME: ', process.env.DB_NAME);

    debug && console.log(bffVersion, ': ', 'BFF: pgJson: SUCESS!!!!:', pgJson);
    debug && console.log(bffVersion, ': ', 'BFF: Connecting to DB with credentials:', pgJson);

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
