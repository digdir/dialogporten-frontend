import { FastifySessionOptions } from '@fastify/session';
import 'dotenv/config';
import z from 'zod';

const envVariables = z.object({
  // todo: rather use version here instead of git_sha
  GIT_SHA: z.string().default('v6.1.5'),
  HOST: z.string().default('0.0.0.0'),
  DB_CONNECTION_STRING: z.string().default('postgres://postgres:mysecretpassword@localhost:5432/dialogporten'),
  APPLICATIONINSIGHTS_CONNECTION_STRING: z.string().optional(),
  PORT: z.coerce.number().default(3000),
  MODE: z.enum(['development', 'production']).default('development'),
  DEV_ENV: z.string().default('dev'),
  OIDC_URL: z.string().default('test.idporten.no'),
  HOSTNAME: z.string().default('http://localhost'),
  ENABLE_APP_INSIGHTS: z.string().default('false'),
  REFRESH_TOKEN_EXPIRES_IN: z.coerce.number().default(3600),
  CLIENT_ID: z.string(),
  CLIENT_SECRET: z.string(),
  COOKIE_NAME: z.string(),
  SESSION_SECRET: z.string().min(32).default('SecretHereSecretHereSecretHereSecretHereSecretHereSecretHereSecretHere'),
  ENABLE_HTTPS: z.boolean().default(false),
  COOKIE_MAX_AGE: z.coerce.number().default(30 * 24 * 60 * 60 * 1000),
});

const env = envVariables.parse(process.env);

const config = {
  version: env.GIT_SHA,
  port: env.PORT,
  isAppInsightsEnabled: env.ENABLE_APP_INSIGHTS === 'true',
  isDev: env.DEV_ENV === 'dev',
  host: env.HOST,
  oidc_url: env.OIDC_URL,
  hostname: env.HOSTNAME,
  refresh_token_expires_in: env.REFRESH_TOKEN_EXPIRES_IN,
  client_id: env.CLIENT_ID,
  client_secret: env.CLIENT_SECRET,
  applicationInsights: {
    connectionString: env.APPLICATIONINSIGHTS_CONNECTION_STRING,
  },
  postgresql: {
    connectionString: env.DB_CONNECTION_STRING,
  },
  cookieName: env.COOKIE_NAME,
  secret: env.SESSION_SECRET,
  enableHttps: env.ENABLE_HTTPS,
  cookieMaxAge: env.COOKIE_MAX_AGE,
};

export const cookieSessionConfig: FastifySessionOptions = {
  secret: config.secret,
  cookie: {
    secure: config.enableHttps,
    httpOnly: !config.enableHttps,
    maxAge: config.cookieMaxAge,
  },
};
export default config;
