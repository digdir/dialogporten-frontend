import express, { Express } from 'express';
import bodyParser from 'body-parser';
import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';
import { startLivenessProbe, startReadinessProbe } from './routes/HealthProbes';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { Profile } from './entities/Profile';
import { SessionData } from './entities/SessionData';
import { initPassport } from './oidc/passport';

import cors from 'cors';
import { sessionMiddleware } from './oidc/sessionUtils';
import config from './config';

const bffVersion = config.version;

const port = process.env.PORT || 3000;

const app: Express = express();
export let SessionRepository: Repository<SessionData> | undefined = undefined;
export let ProfileRepository: Repository<Profile> | undefined = undefined;
const startTimeStamp = new Date();
const isAppInsightsEnabled = process.env.ENABLE_APP_INSIGHTS === 'true';

declare module 'express-session' {
  export interface SessionData {
    returnTo?: string;
    sessionId?: string;
  }
}

// ***** MAIN FUNCTION *****
const main = async (): Promise<void> => {
  startLivenessProbe(app, startTimeStamp);
  app.listen(port, () => {
    console.log(`BFF: ⚡️[server]: Server ${bffVersion} is running on PORT: ${port}`);
  });

  // ************ INITIALIZE APPLICATION INSIGHTS ************
  if (isAppInsightsEnabled) {
    const { initAppInsights } = await import('./ApplicationInsightsInit');
    await initAppInsights();
    console.log(`Starting BFF ${bffVersion} with GIT SHA: ${process.env.GIT_SHA}.`);
  }

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

  try {
    const { routes } = await import('./routes');
    app.get('/', (req, res) => {
      res.send(`BFF: ⚡️[server]: Server ${bffVersion} is running on PORT: ${port}`);
    });

    app.use(bodyParser.json());
    app.use('/', routes);

    startReadinessProbe(app, startTimeStamp);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
