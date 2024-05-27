import 'dotenv/config';
import z from 'zod';

const envVariables = z.object({
  // todo: rather use version here instead of git_sha
  GIT_SHA: z.string().default('v6.1.5'),
  HOST: z.string().default('0.0.0.0'),
  DB_CONNECTION_STRING: z.string().default('postgres://postgres:mysecretpassword@localhost:5432/dialogporten'),
  TYPEORM_SYNCHRONIZE_ENABLED: z.coerce.boolean().default(false),
  APPLICATIONINSIGHTS_CONNECTION_STRING: z.string().optional(),
  PORT: z.coerce.number().default(3000),
  OIDC_URL: z.string().default('test.idporten.no'),
  HOSTNAME: z.string().default('http://localhost'),
  ENABLE_APP_INSIGHTS: z.string().default('false'),
  SESSION_SECRET: z.string().min(32).default('SecretHereSecretHereSecretHereSecretHereSecretHereSecretHereSecretHere'),
  ENABLE_HTTPS: z.boolean().default(false),
  COOKIE_MAX_AGE: z.coerce.number().default(30 * 24 * 60 * 60 * 1000),
  REDIS_CONNECTION_STRING: z.string().default('redis://:mysecretpassword@127.0.0.1:6379/0'),
  CLIENT_ID: z.string(),
  CLIENT_SECRET: z.string(),
  MIGRATION_RUN: z.coerce.boolean().default(false),
  DIALOGPORTEN_URL: z
    .string()
    .default('https://altinn-dev-api.azure-api.net/dialogporten/graphql'),
});

const env = envVariables.parse(process.env);

const config = {
  version: env.GIT_SHA,
  port: env.PORT,
  isAppInsightsEnabled: env.ENABLE_APP_INSIGHTS === 'true',
  host: env.HOST,
  oidc_url: env.OIDC_URL,
  hostname: env.HOSTNAME,
  client_id: env.CLIENT_ID,
  client_secret: env.CLIENT_SECRET,
  applicationInsights: {
    connectionString: env.APPLICATIONINSIGHTS_CONNECTION_STRING,
  },
  postgresql: {
    connectionString: env.DB_CONNECTION_STRING,
  },
  secret: env.SESSION_SECRET,
  enableHttps: env.ENABLE_HTTPS,
  cookieMaxAge: env.COOKIE_MAX_AGE,
  redisConnectionString: env.REDIS_CONNECTION_STRING,
  typeormSynchronizeEnabled: env.TYPEORM_SYNCHRONIZE_ENABLED,
  migrationRun: env.MIGRATION_RUN,
  dialogportenURL: env.DIALOGPORTEN_URL,
};

export default config;
