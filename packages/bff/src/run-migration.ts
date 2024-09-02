import 'reflect-metadata';
import { initialize } from './azure/ApplicationInsights.ts';
import config from './config.ts';
import { connectToDB } from './db.ts';
import logger from '@digdir/dialogporten-node-logger';

export const runMigrationApp = async () => {
  // App Insight setup
  if (config.applicationInsights.enabled) {
    try {
      initialize();
    } catch (e) {
      logger.error(
        e,
        'Unable to initialize Application Insights: Application Insights enabled, but connection string is missing.',
      );
      throw e;
    }
  } else {
    logger.info('Application Insights is not enabled');
  }

  try {
    logger.info(`${config.version}: Starting migration:`);
    const { dataSource } = await connectToDB();
    if (!dataSource.isInitialized) {
      throw new Error('Something went from initializing a connection to database');
    }
    // Run migrations
    await dataSource.runMigrations();
    // Disconnect from database
    await dataSource.destroy();

    logger.info('Migration successful');
  } catch (error) {
    logger.error(error, 'Migration failed: ');
    process.exit(1);
  }
};
