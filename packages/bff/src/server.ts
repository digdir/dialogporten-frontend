import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import formBody from '@fastify/formbody';
import session from '@fastify/session';
import { FastifySessionOptions } from '@fastify/session';
import RedisStore from 'connect-redis';
import Fastify from 'fastify';
import fastifyGraphiql from 'fastify-graphiql';
import { default as Redis } from 'ioredis';
import { oidc, userApi, verifyToken } from './auth/index.ts';
import { initAppInsights } from './azure/ApplicationInsightsInit.ts';
import healthProbes from './azure/HealthProbes.ts';
import { app, cookie as cookieConfig, applicationInsights, oidc as oidcConfig, redisConnectionString } from './config.ts';
import { connectToDB } from './db.ts';
import graphqlApi from './graphql/api.ts';

const startServer = async (): Promise<void> => {
  const server = Fastify({
    ignoreTrailingSlash: true,
    ignoreDuplicateSlashes: true,
  });

  if (applicationInsights.isAppInsightsEnabled) {
    const { connectionString } = applicationInsights;
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
    secret: cookieConfig.secret,
    cookie: {
      secure: app.enableHttps,
      httpOnly: !app.enableHttps,
      maxAge: cookieConfig.cookieMaxAge,
    },
  };

  if (redisConnectionString) {
    const store = new RedisStore({
      client: new Redis.default(redisConnectionString, {
        enableAutoPipelining: true,
      }),
    });

    console.log('Setting up fastify-session with a Redis store');
    server.register(session, { ...cookieSessionConfig, store });
  } else {
    console.log('Setting up fastify-session');
    server.register(session, cookieSessionConfig);
  }

  server.register(verifyToken);
  server.register(healthProbes, { version: app.version });
  server.register(oidc, {
    oidc_url: oidcConfig.oidc_url,
    hostname: app.hostname,
    client_id: oidcConfig.client_id,
    client_secret: oidcConfig.client_secret,
  });
  server.register(userApi);
  server.register(graphqlApi);

  server.register(fastifyGraphiql, {
    url: '/api/graphiql',
    graphqlURL: '/api/graphql',
  });

  server.listen({ port: app.port, host: app.host }, (error, address) => {
    if (error) {
      throw error;
    }
    console.log(`Server ${app.version} is running on ${address}`);
  });
};

export default startServer;
