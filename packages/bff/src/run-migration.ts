import util from 'util';
import 'reflect-metadata';
import { initAppInsightWithRetry } from './azure/ApplicationInsightsInit.ts';
import { app, applicationInsights } from './config.ts';
import { connectToDB } from './db.ts';

export const runMigrationApp = async () => {
  // App Insight setup
  if (applicationInsights.connectionString) {
    try {
      await initAppInsightWithRetry(applicationInsights.connectionString, 10);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  } else {
    console.error('Missing config for AppInsight');
  }

  try {
    console.log(app.version, ': ', 'MIGRATION: Starting migration:');
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
