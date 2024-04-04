import Fastify from 'fastify';
import passport from '@fastify/passport';
import formBody from '@fastify/formbody';
import session from '@fastify/session';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import 'reflect-metadata';
import { initAppInsights } from './ApplicationInsightsInit';
import { startLivenessProbe, startReadinessProbe } from './HealthProbes';
import config from './config';
import { connectToDB } from './db';
import oidc from './oidc';
import { initPassport } from './oidc/passport';
import { cookieSessionConfig } from './oidc/cookies';
import rootApi from './services/root'

const { version, port, isAppInsightsEnabled } = config;

const startServer = async (startTimeStamp: Date): Promise<void> => {
  const server = Fastify({
    logger: true,
    ignoreTrailingSlash: true,
    ignoreDuplicateSlashes: true,
  });

  startLivenessProbe(server, startTimeStamp);

  if (isAppInsightsEnabled) {
    const { connectionString } = config.applicationInsights;
    if (!connectionString) {
      throw new Error("No APPLICATIONINSIGHTS_CONNECTION_STRING found in env, can't initialize appInsights");
    }
    await initAppInsights(connectionString);
  }

  await connectToDB();
  /* CORS configuration for local env, needs to be applied before routes are defined */
  const corsOptions = {
    origin: ['http://app.localhost', 'http://localhost:3000'],
    credentials: true,
    methods: 'GET, POST, PATCH, DELETE, PUT',
    allowedHeaders: 'Content-Type, Authorization',
    preflightContinue: true,
  };

  server.decorateRequest('sessionId', '');
  server.register(cors, corsOptions);
  server.register(formBody);
  server.register(cookie);
  server.register(session, cookieSessionConfig);

  //server.register(rootApi);
  server.register(oidc);

  server.listen({ port: 3000, host: '0.0.0.0' }, (error, address) => {
    if (error) {
      throw error;
    }
    console.log(`Server ${version} is running on ${address}`);
  });

  startReadinessProbe(server, startTimeStamp);
};

export default startServer;
