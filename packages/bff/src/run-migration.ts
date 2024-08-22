import 'reflect-metadata';
import { intitialize } from './azure/ApplicationInsights.ts';
import config from './config.ts';
import { connectToDB } from './db.ts';

export const runMigrationApp = async () => {
  // App Insight setup
  if (config.applicationInsights.enabled) {
    try {
      intitialize();
    } catch (e) {
      console.error('Unable to initialize Application Insights: Application Insights enabled, but connection string is missing.', e);
      throw e;
    }
  } else {
    console.log('Application Insights is not enabled');
  }

  try {
    console.log(config.version, ': ', 'MIGRATION: Starting migration:');
    const { dataSource } = await connectToDB();
    if (!dataSource.isInitialized) {
      throw new Error('Something went from initializing a connection to database');
    }

    // Run migrations
    await dataSource.runMigrations();

    // Disconnect from database
    await dataSource.destroy();

    console.log('Migration successful');
  } catch (error) {
    console.error('Migration failed: ', error);
    process.exit(1);
  }
};
