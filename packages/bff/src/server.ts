import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import formBody from '@fastify/formbody';
import proxy from '@fastify/http-proxy';
import session from '@fastify/session';
import { FastifySessionOptions } from '@fastify/session';
import RedisStore from 'connect-redis';
import Fastify from 'fastify';
import Redis from 'ioredis';
import 'reflect-metadata';
import { verifyToken } from './auth';
import { oidc } from './auth';
import { userApi } from './auth';
import { initAppInsights } from './azure/ApplicationInsightsInit';
import healthProbes from './azure/HealthProbes';
import config from './config';
import { connectToDB } from './db';

const {
  version,
  isAppInsightsEnabled,
  applicationInsights,
  host,
  oidc_url,
  hostname,
  client_id,
  client_secret,
  redisConnectionString,
} = config;

const startServer = async (startTimeStamp: Date): Promise<void> => {
  const server = Fastify({
    ignoreTrailingSlash: true,
    ignoreDuplicateSlashes: true,
  });

  if (isAppInsightsEnabled) {
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
      client: new Redis(redisConnectionString, {
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
  server.register(healthProbes);
  server.register(oidc, {
    oidc_url,
    hostname,
    client_id,
    client_secret,
  });
  server.register(userApi);
  server.register(proxy, {
    upstream: 'https://altinn-dev-api.azure-api.net',
    prefix: '/api/proxy/',
    preValidation: server.verifyToken,
    replyOptions: {
      rewriteRequestHeaders: (originalReq, headers) => {
        const token = originalReq.session.get('token');
        return {
          Authorization: `Bearer ${token!.access_token}`,
          accept: 'application/json',
        };
      },
    },
  });

  server.listen({ port: 3000, host }, (error, address) => {
    if (error) {
      throw error;
    }
    console.log(`Server ${version} is running on ${address}`);
  });
};

export default startServer;
