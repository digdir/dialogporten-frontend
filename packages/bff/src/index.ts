export const bffVersion = process.env.GIT_SHA || "v6.1.5";
import express, { Express } from "express";
import "reflect-metadata";
import { DataSource, Repository } from "typeorm";
import { startLivenessProbe, startReadinessProbe } from "./routes/HealthProbes";
import cookieParser from "cookie-parser";
import passport from "passport";
import { Profile } from "./entities/Profile";
import { SessionData } from "./entities/SessionData";
import { initPassport } from "./oidc/passport";
import { sessionMiddleware } from "./oidc/sessionUtils";
import cors from "cors";

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
    console.log(
      `BFF: ⚡️[server]: Server ${bffVersion} is running on PORT: ${port}`,
    );
  });

  // ************ INITIALIZE APPLICATION INSIGHTS ************
  if (isAppInsightsEnabled) {
    const { initAppInsights } = await import('./ApplicationInsightsInit');
    await initAppInsights();
    console.log(
      `Starting BFF ${bffVersion} with GIT SHA: ${process.env.GIT_SHA}.`,
    );
  }

  // ************ CONNECT TO DB ************
  const { connectionOptions } = await import('./data-source');
  const dataSource = await new DataSource(connectionOptions).initialize();

  SessionRepository = dataSource.getRepository(SessionData);
  ProfileRepository = dataSource.getRepository(Profile);

  if (!SessionRepository) {
    throw new Error('SessionRepository not initialized');
  }
  if (!ProfileRepository) {
    throw new Error('ProfileRepository not initialized');
  }

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

  // ensure cors middleware is always first
  app.use(cors(corsOptions));
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  await initPassport();

  try {
    const { routes: authRoutes } = await import("./routes");

    app.get("/", (req, res) => {
      res.send(
        `BFF: ⚡️[server]: Server ${bffVersion} is running on PORT: ${port}`,
      );
    });

    app.use(express.json());
    app.use('/', authRoutes);

    startReadinessProbe(app, startTimeStamp);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
