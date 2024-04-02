import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import passport from 'passport';
import 'reflect-metadata';
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
    const { connectionString } = config.applicationInsights;
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

  /* CORS configuration for local env, needs to be applied before routes are defined */
  const corsOptions = {
    origin: [ 'http://frontend-design-poc.localhost', 'http://localhost:3000' ],
    credentials: true,
    methods: "GET, POST, PATCH, DELETE, PUT",
    allowedHeaders: "Content-Type, Authorization",
    preflightContinue: true,
  };

  app.use(cors(corsOptions));
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  await initPassport();

  // Setup OIDC
  oidc(app);

  app.listen(port, () => {
    console.log(`Server ${version} is running on PORT: ${port}`);
  });

  startReadinessProbe(app, startTimeStamp);
};

export default startServer;
