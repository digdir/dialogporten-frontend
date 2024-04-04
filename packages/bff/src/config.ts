import z from 'zod';

const envVariables = z.object({
  // todo: rather use version here instead of git_sha
  GIT_SHA: z.string().default('v6.1.5'),
  DB_CONNECTION_STRING: z.string().default('postgres://postgres:mysecretpassword@db:5432/dialogporten'),
  APPLICATIONINSIGHTS_CONNECTION_STRING: z.string().optional(),
});

const env = envVariables.parse(process.env);

const port = process.env.PORT || 3000;
const isAppInsightsEnabled = process.env.ENABLE_APP_INSIGHTS === 'true';
const isDev = process.env.DEV_ENV === 'dev';

export default {
  version: env.GIT_SHA,
  port,
  isAppInsightsEnabled,
  isDev,
  applicationInsights: {
    connectionString: env.APPLICATIONINSIGHTS_CONNECTION_STRING,
  },
  postgresql: {
    connectionString: env.DB_CONNECTION_STRING,
  },
  cookieName: process.env.COOKIE_NAME || 'cookieName',
  secret: process.env.SESSION_SECRET || 'SecretHereSecretHereSecretHereSecretHereSecretHereSecretHereSecretHere',
  enableHttps: process.env.ENABLE_HTTPS === 'true'
};

