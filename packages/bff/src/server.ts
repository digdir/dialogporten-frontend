import { logger } from '@digdir/dialogporten-node-logger';
import cors from '@fastify/cors';
import formBody from '@fastify/formbody';
import type { FastifySessionOptions } from '@fastify/session';
// import RedisStore from 'connect-redis';
import fastifyGraphiql from 'fastify-graphiql';
import { oidc, userApi } from './auth/index.ts';
import healthChecks from './azure/HealthChecks.ts';
import healthProbes from './azure/HealthProbes.ts';
import config from './config.ts';
import { connectToDB } from './db.ts';
import graphqlApi from './graphql/api.ts';
import { fastifyHeaders } from './graphql/fastifyHeaders.ts';
import graphqlStream from './graphql/subscription.ts';
import redisClient from './redisClient.ts';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import RedisStore from 'connect-redis';
import Redis from 'ioredis';
import oauthPlugin, { type OAuth2Namespace } from '@fastify/oauth2';
import type {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
  IdportenToken,
} from 'fastify';
import Fastify from 'fastify';
import { CustomOICDPluginOptions, handleAuthRequest, handleLogout, type SessionStorageToken } from './auth/oidc.ts';
import verifyToken, { refreshToken } from './auth/verifyToken.ts';
type ValidationStatus = 'refresh_token_expired' | 'refreshed' | 'missing_token' | 'access_token_valid';

//// NEW CODE ////
declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}

const getIsTokenValid = async (
  request: FastifyRequest,
  allowTokenRefresh: boolean,
  fastify: FastifyInstance,
): Promise<ValidationStatus> => {
  const token: SessionStorageToken | undefined = request.session.get('token');

  if (!token) {
    return 'missing_token';
  }

  const now = new Date();
  const accessTokenExpiresAt = new Date(token.access_token_expires_at);
  const isRefreshTokenValid = new Date(token.refresh_token_expires_at) > now;
  // Check if the access token expires in less than 60 seconds for now
  const accessTokenExpiresSoon = accessTokenExpiresAt.getTime() - now.getTime() < 60 * 1000;
  const isAccessTokenValid = accessTokenExpiresAt > now;

  if (accessTokenExpiresSoon && allowTokenRefresh && isRefreshTokenValid) {
    try {
      await refreshToken(request);
      // Ensure that the token has been updated and valid after the refresh
      const updatedToken: SessionStorageToken | undefined = request.session.get('token');
      const updatedAccessTokenExpiresAt = new Date(updatedToken?.access_token_expires_at || '');
      if (updatedAccessTokenExpiresAt > now) {
        return 'refreshed';
      }
      return 'refresh_token_expired';
    } catch (error) {
      logger.error(error, 'Unable to refresh token');
      return 'refresh_token_expired';
    }
  }

  return isAccessTokenValid ? 'access_token_valid' : 'refresh_token_expired';
};

const { version, port, host, oidc_url, hostname, client_id, client_secret, redisConnectionString } = config;

const startServer = async (): Promise<void> => {
  const { secret, enableHttps, enableGraphiql } = config;
  const server = Fastify({
    ignoreTrailingSlash: true,
    ignoreDuplicateSlashes: true,
    logger: true,
    trustProxy: true,
  });

  const { dataSource } = await connectToDB();
  /* CORS configuration for local env, needs to be applied before routes are defined */
  const corsOptions = {
    origin: ['http://app.localhost', 'http://localhost:3000'],
    credentials: true,
    methods: 'GET, POST, PATCH, DELETE, PUT',
    allowedHeaders: 'Content-Type, Authorization',
    preflightContinue: true,
  };

  // //// NEW CODE ////
  // declare module 'fastify' {
  //   interface FastifyInstance {
  //     googleOAuth2: OAuth2Namespace;
  //   }
  // }

  // Initialize Redis client
  // const redisClient = new Redis();

  // Create Fastify instance
  const fastify: FastifyInstance = Fastify({ logger: true });

  // Register cookie and session plugins
  // fastify.register(fastifySession, {
  //   secret, // Replace with an environment variable
  //   cookie: {
  //     secure: true, // Secure cookies in production
  //     httpOnly: true,
  //     sameSite: 'lax',
  //   },
  //   store: new RedisStore({ client: redisClient }),
  // });

  // Session setup

  // logger.info('Setting up fastify-session with a Redis store');
  // server.register(session, { ...cookieSessionConfig, store });
  server.register(fastifyCookie);
  const store = new RedisStore({
    client: redisClient,
  });
  server.register(fastifySession, {
    secret,
    cookie: {
      secure: enableHttps,
      httpOnly: enableHttps,
      sameSite: 'lax',
    },
    saveUninitialized: false,
    store,
  });
  // } else {
  //   logger.info('NOT Setting up fastify-session');
  //   // server.register(session, cookieSessionConfig);
  // }
  server.register(verifyToken);

  const plugin: FastifyPluginAsync<CustomOICDPluginOptions> = async (fastify, options) => {
    const { client_id, client_secret, oidc_url, hostname } = options;

    // Register OAuth2 plugin for Google
    fastify.register(oauthPlugin, {
      name: 'googleOAuth2',
      credentials: {
        client: {
          id: client_id,
          secret: client_secret,
        },
      },
      scope: ['openid', 'profile', 'digdir:dialogporten.noconsent', 'digdir:dialogporten'],

      startRedirectPath: '/api/login/',
      callbackUri: `${hostname}/api/cb`,
      discovery: {
        issuer: `https://${oidc_url}/.well-known/openid-configuration`,
      },
    });

    fastify.get('/api/cb', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        logger.info('api/cb');
        // Exchange authorization code for tokens
        const token = await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
        const customToken: IdportenToken = token as unknown as IdportenToken;
        logger.info('token', token);
        logger.info('access_token', token?.token.access_token);
        logger.info('customToken', customToken);
        // Log the access token (for demonstration purposes)
        logger.info('Access Token:', customToken.access_token);
        // await handleAuthRequest(request, reply, fastify);

        // Send the access token back to the client or store it securely
        reply.send({ access_token: customToken.access_token });
        reply.redirect('/?loggedIn=true');
      } catch (error) {
        request.log.error(error);
        +reply.status(500).send({ error: 'Failed to authenticate' });
      }
    });

    // Protected route example
    fastify.get('/protected', async (request, reply) => {
      // Check if user is authenticated by verifying session or token
      if (!request.session.sub) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }
      reply.send({ message: 'You are authenticated!', user: request.session.sub });
    });
    //// END NEW CODE ////
    fastify.get('/api/logout', { preHandler: fastify.verifyToken(false) }, handleLogout);
  };

  server.register(cors, corsOptions);
  server.register(plugin, {
    oidc_url,
    hostname,
    client_id,
    client_secret,
  });
  server.register(formBody);
  // server.register(cookie);

  server.register(healthProbes, { version });
  server.register(healthChecks, { version });
  // server.register(oidc, {
  //   oidc_url,
  //   hostname,
  //   client_id,
  //   client_secret,
  // });
  server.register(fastifyHeaders);
  server.register(userApi);
  server.register(graphqlApi);
  server.register(graphqlStream);
  if (enableGraphiql) {
    server.register(fastifyGraphiql, {
      url: '/api/graphiql',
      graphqlURL: '/api/graphql',
    });
  }

  server.listen({ port, host }, (error, address) => {
    if (error) {
      throw error;
    }
    logger.info(`Server ${version} is running on ${address}`);
  });

  // Graceful Shutdown
  const gracefulShutdown = async () => {
    try {
      logger.info('Initiating graceful shutdown...');

      // Stop accepting new connections
      await server.close();
      logger.info('Closed Fastify server.');

      // Disconnect Redis
      await redisClient.quit();
      logger.info('Disconnected Redis client.');

      // Disconnect Database
      if (dataSource?.isInitialized) {
        await dataSource.destroy();
        logger.info('Disconnected from PostgreSQL.');
      }

      process.exit(0);
    } catch (err) {
      logger.error(err, 'Error during graceful shutdown');
      process.exit(1);
    }
  };

  // Handle termination signals
  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
};

export default startServer;
