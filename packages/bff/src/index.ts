export const bffVersion = process.env.GIT_SHA || 'v5.2';
export const isLocal = process.env.IS_LOCAL === 'true';
import './config/env';

if (process.env.IS_LOCAL === 'true')
  console.log(`Starting BFF ${bffVersion} in local mode with env file '${process.env.ENV_FILE}'.`);
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import 'reflect-metadata';
import path from 'path';
import { DataSource, Repository } from 'typeorm';
import { StartUp } from './entities/StartUp';
import { startLivenessProbe, startReadinessProbe } from './routes/HealthProbes';
import { runMigrationApp } from './util/Migration';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { Profile } from './entities/Profile';
import { SessionData } from './entities/SessionData';
import { initPassport } from './config/passport';
import { sessionMiddleware } from './util/sessionUtils';
import { initPgEnvVars } from './util/initPgEnvVars';
import { initAppInsights } from './util/ApplicationInsightsInit';
import cors from 'cors';

export const app: Express = express();
export const probes: Express = express();
const port = process.env.PORT || 8080;
export let mainDataSource: DataSource;
export let StartUpRepository: Repository<StartUp> | undefined = undefined;
export let SessionRepository: Repository<SessionData> | undefined = undefined;
export let ProfileRepository: Repository<Profile> | undefined = undefined;
const startTimeStamp = new Date();
const DIST_DIR = path.join(__dirname, 'public');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

declare module 'express-session' {
  export interface SessionData {
    returnTo?: string;
    sessionId?: string;
  }
}

// ***** MAIN FUNCTION *****
const main = async (): Promise<void> => {
  startLivenessProbe(startTimeStamp);
  app.listen(port, () => {
    console.log(`BFF: ⚡️[server]: Server is running on PORT: ${port}`);
  });

  // ************ INITIALIZE APPLICATION INSIGHTS ************
  if (!isLocal) {
    await initAppInsights();
    console.log(`Starting BFF ${bffVersion} with GIT SHA: ${process.env.GIT_SHA}.`);
  }
  if (process.env.Infrastructure__DialogDbConnectionString)
    initPgEnvVars(process.env.Infrastructure__DialogDbConnectionString);

  // ************ CONNECT TO DB ************
  const { connectionOptions } = await import('./data-source');
  const dataSource = await new DataSource(connectionOptions).initialize();

  SessionRepository = dataSource.getRepository(SessionData);
  ProfileRepository = dataSource.getRepository(Profile);
  if (!SessionRepository) throw new Error('SessionRepository not initialized');
  if (!ProfileRepository) throw new Error('ProfileRepository not initialized');

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // CORS configuration for local env
  const corsOptions = {
    origin: 'http://localhost', // Replace with your app's origin
    credentials: true, // To accept credentials (cookies) from the front-end
  };

  app.use(cors(corsOptions));

  // Session Middleware Configuration
  app.use(sessionMiddleware);

  app.use(passport.initialize());
  app.use(passport.session());
  await initPassport();
  StartUpRepository = dataSource.getRepository(StartUp);

  await logStartupToDb();

  try {
    const { routes } = await import('./routes');
    app.use(express.static(DIST_DIR));
    app.get('/', (req, res) => {
      isLocal && res.redirect('http://localhost');
      res.sendFile(HTML_FILE);
    });

    app.use(bodyParser.json());
    app.use('/', routes);

    startReadinessProbe(startTimeStamp);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.env.IS_MIGRATION_JOB === 'true') {
  console.log("_ ************* MIGRATION JOB, DON'T START SERVER *************");
  runMigrationApp();
} else void main();

const logStartupToDb = async () => {
  if (!StartUpRepository) throw new Error('StartUpRepository not initialized');
  const startUp = new StartUp();
  startUp.version = bffVersion;
  await StartUpRepository.save(startUp);
};
