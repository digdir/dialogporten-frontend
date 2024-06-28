import 'dotenv/config';
import z from 'zod';

const zBool = z
  .string()
  .toLowerCase()
  .transform((value) => {
    if(value === '' || value === 'false' || value === '0')
      return false;

    return true;
  })
  .pipe(z.boolean());

// Define types for our enviroment variables (using zod)
const envVariables = z.object({
  GIT_SHA: z.string().default('v6.1.5'),
  HOST: z.string().default('0.0.0.0'),
  DB_CONNECTION_STRING: z.string().default('postgres://postgres:mysecretpassword@localhost:5432/dialogporten'),
  TYPEORM_SYNCHRONIZE_ENABLED: zBool,
  APPLICATIONINSIGHTS_CONNECTION_STRING: z.string().optional(),
  PORT: z.coerce.number().default(3000),
  OIDC_URL: z.string().default('test.idporten.no'),
  HOSTNAME: z.string().default('http://localhost'),
  ENABLE_APP_INSIGHTS: z.string().default('false'),
  SESSION_SECRET: z.string().min(32).default('SecretHereSecretHereSecretHereSecretHereSecretHereSecretHereSecretHere'),
  ENABLE_HTTPS: zBool,
  DB_USE_HTTPS: zBool,
  COOKIE_MAX_AGE: z.coerce.number().default(30 * 24 * 60 * 60 * 1000),
  REDIS_CONNECTION_STRING: z.string().default('redis://:mysecretpassword@127.0.0.1:6379/0'),
  CLIENT_ID: z.string(),
  CLIENT_SECRET: z.string(),
  MIGRATION_RUN: zBool,
  DIALOGPORTEN_URL: z
    .string()
    .default('https://altinn-dev-api.azure-api.net/dialogporten/graphql'),
});

// Parse env variables (zod ensures that everything is typed)
const env = envVariables.parse(process.env);

// Export types (grouped into logical variables)
export const app = {
  version: env.GIT_SHA,
  port: env.PORT,
  host: env.HOST,
  hostname: env.HOSTNAME,
  migrationRun: env.MIGRATION_RUN,
  enableHttps: env.ENABLE_HTTPS,
};

export const dialogportenURL = env.DIALOGPORTEN_URL;

export const oidc = {
  oidc_url: env.OIDC_URL,
  client_id: env.CLIENT_ID,
  client_secret: env.CLIENT_SECRET,
};

export const db = {
  connectionString: env.DB_CONNECTION_STRING,
  enableHttps: env.DB_USE_HTTPS,
  typeormSynchronizeEnabled: env.TYPEORM_SYNCHRONIZE_ENABLED,
};

export const redisConnectionString = env.REDIS_CONNECTION_STRING;

export const cookie = {
  secret: env.SESSION_SECRET,
  cookieMaxAge: env.COOKIE_MAX_AGE,
};

export const applicationInsights = {
  isAppInsightsEnabled: env.ENABLE_APP_INSIGHTS,
  connectionString: env.APPLICATIONINSIGHTS_CONNECTION_STRING,
};
