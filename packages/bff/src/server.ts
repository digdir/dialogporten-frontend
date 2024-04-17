import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import formBody from '@fastify/formbody';
import session from '@fastify/session';
import { FastifySessionOptions } from '@fastify/session';
import RedisStore from 'connect-redis';
import Fastify from 'fastify';
import Redis from 'ioredis';
import 'reflect-metadata';
import { initAppInsights } from './ApplicationInsightsInit';
import { startLivenessProbe, startReadinessProbe } from './HealthProbes';
import config from './config';
import { connectToDB } from './db';
import oidc from './oidc';
import userApi from './userApi';

const {
  version,
  port,
  isAppInsightsEnabled,
  host,
  isDev,
  oidc_url,
  hostname,
  client_id,
  client_secret,
  refresh_token_expires_in,
} = config;

const startServer = async (startTimeStamp: Date): Promise<void> => {
  const server = Fastify({
    ignoreTrailingSlash: true,
    ignoreDuplicateSlashes: true,
  });

  if (!isDev) {
    startLivenessProbe(server, startTimeStamp);
  }

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

  server.register(cors, corsOptions);
  server.register(formBody);
  server.register(cookie);

  // Session setup
  const cookieSessionConfig: FastifySessionOptions = {
    secret: config.secret,
    cookie: {
      secure: config.enableHttps,
      httpOnly: !config.enableHttps,
      maxAge: config.cookieMaxAge,
    },
  };

  if (config.redisConnectionString) {
    const store = new RedisStore({
      client: new Redis(config.redisConnectionString, {
        enableAutoPipelining: true,
      }),
    });

    console.log('Setting up fastify-session with a Redis store');
    server.register(session, { ...cookieSessionConfig, store });
  } else {
    console.log('Setting up fastify-session');
    server.register(session, cookieSessionConfig);
  }

  server.register(oidc, {
    oidc_url,
    hostname,
    client_id,
    client_secret,
    refresh_token_expires_in,
  });
  server.register(userApi);

  server.listen({ port: 3000, host }, (error, address) => {
    if (error) {
      throw error;
    }
    console.log(`Server ${version} is running on ${address}`);
  });

  if (!isDev) {
    startReadinessProbe(server, startTimeStamp);
  }
};

export default startServer;
