import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import formBody from '@fastify/formbody';
import proxy from '@fastify/http-proxy';
import session from '@fastify/session';
import Fastify from 'fastify';
import 'reflect-metadata';
import { initAppInsights } from './ApplicationInsightsInit';
import { startLivenessProbe, startReadinessProbe } from './HealthProbes';
import oidc from './auth/oidc';
import userApi from './auth/userApi';
import verifyToken from './auth/verifyToken';
import config, { cookieSessionConfig } from './config';
import { connectToDB } from './db';

const { version, port, isAppInsightsEnabled, host, isDev, oidc_url, hostname, client_id, client_secret } = config;

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
  server.register(session, cookieSessionConfig);
  server.register(verifyToken);
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

  if (!isDev) {
    startReadinessProbe(server, startTimeStamp);
  }
};

export default startServer;
