import express, { Express } from 'express';
import bodyParser from 'body-parser';
import 'reflect-metadata';
// import swaggerUi from 'swagger-ui-express';
// import swaggerFile from './swagger_output.json';
import './config/env';
import path from 'path';
import { DataSource, Repository } from 'typeorm';
import { StartUp } from './entities/StartUp';
import { startLivenessProbe, startReadinessProbe } from './routes/HealthProbes';
import { initAppInsights } from './util/InitializaitonUtils';
import { runMigrationApp } from './util/Migration';

export const bffVersion = 'v5.0';
export const isLocal = process.env.IS_LOCAL === 'true';
export const app: Express = express();
export const probes: Express = express();
const port = process.env.PORT || 8080;
const debug = false;
export let mainDataSource: DataSource;
export let StartUpRepository: Repository<StartUp> | undefined = undefined;
console.log(bffVersion, ': ', '****** VERY BEGINNING OF CODE');
const startTimeStamp = new Date().getTime();
const DIST_DIR = path.join(__dirname, 'public');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

const start = async (): Promise<void> => {
  console.log(bffVersion, ': ', 'BFF: ************* NODE BFF STARTING *************');

  // ************ START HEALTH PROBE FOR LIVENESS ************
  startLivenessProbe('bff-node:Main app');
  app.listen(port, () => {
    console.log(`BFF: ⚡️[server]: Server is running on PORT: ${port}`);
  });

  // ************ INITIALIZE APPLICATION INSIGHTS ************
  if (!isLocal) await initAppInsights();

  // ************ PARSE DB CONNECTION STRING ************
  let pgJson;
  if (process.env.Infrastructure__DialogDbConnectionString)
    try {
      pgJson = JSON.parse(process.env.Infrastructure__DialogDbConnectionString!);
      process.env.DB_HOST = pgJson?.host;
      process.env.DB_USER = pgJson?.user;
      process.env.DB_PORT = pgJson?.port;
      process.env.DB_PASSWORD = pgJson?.password;
      process.env.DB_NAME = pgJson?.dbname;
      console.log(bffVersion, ': ', 'BFF: Successfully read DB connection string');
    } catch (error) {
      console.log(bffVersion, ': ', 'Migration: Error reading dbConnectionStringOK: ', error);
    }

  // ************ CONNECT TO DB ************
  debug && console.log(bffVersion, ': ', 'BFF: Starting dataSource.initialize()');
  const { connectionOptions } = await import('./data-source');
  const dataSource = await new DataSource(connectionOptions).initialize();
  StartUpRepository = dataSource.getRepository(StartUp);
  const startup = new StartUp();
  startup.version = bffVersion;
  await StartUpRepository.save(startup);

  console.log(bffVersion, ': ', 'BFF: DB Setup done, entering main try/catch');

  // ************ ENTER MAIN LOOP ************
  try {
    const { routes } = await import('./routes');
    app.use(express.static(DIST_DIR));
    app.get('/', (req, res) => {
      res.sendFile(HTML_FILE);
    });
    app.use(bodyParser.json());
    app.use('/api/v1', routes);
    console.log(
      bffVersion,
      'Starting Healthprobes after ',
      (new Date().getTime() - startTimeStamp) / 1000,
      ' s'
    );
    startReadinessProbe('bff-node:Main app');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// if (isLocal) process.exit(0);
if (process.env.IS_MIGRATION_JOB === 'true') {
  console.log("_ ************* MIGRATION JOB, DON'T START SERVER *************");
  runMigrationApp();
} else void start();
