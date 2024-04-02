import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import passport from 'passport';
import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';
import { initAppInsights } from './ApplicationInsightsInit';
import { startLivenessProbe, startReadinessProbe } from './HealthProbes';
import config from './config';
import { connectToDB } from './db';
import { oidc } from './oidc';
import { initPassport } from './oidc/passport';
import { sessionMiddleware } from './oidc/cookies';

const { version, port, isAppInsightsEnabled } = config;

declare module 'express-session' {
  export interface SessionData {
    returnTo?: string;
    sessionId?: string;
  }
}

const startServer = async (startTimeStamp: Date): Promise<void> => {
  const app: Express = express();

  startLivenessProbe(app, startTimeStamp);

  if (isAppInsightsEnabled) {
    const connectionString = config.applicationInsights.connectionString;
    if (!connectionString) {
      throw new Error("No APPLICATIONINSIGHTS_CONNECTION_STRING found in env, can't initialize appInsights");
    } else {
      await initAppInsights(connectionString);
    }
  }

  await connectToDB();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(bodyParser.json());

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

  // Setup OIDC
  oidc(app);

  app.get('/', (req, res) => {
    res.send(`BFF: ⚡️[server]: Server ${version} is running on PORT: ${port}`);
  });

  app.listen(port, () => {
    console.log(`Server ${version} is running on PORT: ${port}`);
  });

  startReadinessProbe(app, startTimeStamp);
};

export default startServer;
