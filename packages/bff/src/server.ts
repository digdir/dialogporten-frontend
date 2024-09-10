import { logger } from '@digdir/dialogporten-node-logger';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import formBody from '@fastify/formbody';
import session from '@fastify/session';
import type { FastifySessionOptions } from '@fastify/session';
import RedisStore from 'connect-redis';
import Fastify from 'fastify';
import fastifyGraphiql from 'fastify-graphiql';
import { default as Redis } from 'ioredis';
import { oidc, userApi, verifyToken } from './auth/index.ts';
import healthProbes from './azure/HealthProbes.ts';
import config from './config.ts';
import { connectToDB } from './db.ts';
import graphqlApi from './graphql/api.ts';

const {
  version,
  port,
  // applicationInsights,
  host,
  oidc_url,
  hostname,
  client_id,
  client_secret,
  redisConnectionString,
} = config;

const startServer = async (): Promise<void> => {
  const server = Fastify({
    ignoreTrailingSlash: true,
    ignoreDuplicateSlashes: true,
    logger: logger.pinoLoggerInstance,
  });

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
  const { secret, enableHttps, cookieMaxAge } = config;
  const cookieSessionConfig: FastifySessionOptions = {
    secret,
    cookie: {
      secure: enableHttps,
      httpOnly: !enableHttps,
      maxAge: cookieMaxAge,
    },
  };

  if (redisConnectionString) {
    const store = new RedisStore({
      client: new Redis.default(redisConnectionString, {
        enableAutoPipelining: true,
      }),
    });

    logger.info('Setting up fastify-session with a Redis store');
    server.register(session, { ...cookieSessionConfig, store });
  } else {
    logger.info('Setting up fastify-session');
    server.register(session, cookieSessionConfig);
  }

  server.register(verifyToken);
  server.register(healthProbes, { version });
  server.register(oidc, {
    oidc_url,
    hostname,
    client_id,
    client_secret,
  });
  server.register(userApi);
  server.register(graphqlApi);

  server.register(fastifyGraphiql, {
    url: '/api/graphiql',
    graphqlURL: '/api/graphql',
  });

  server.listen({ port, host }, (error, address) => {
    if (error) {
      throw error;
    }
    logger.info(`Server ${version} is running on ${address}`);
  });
};

export default startServer;
