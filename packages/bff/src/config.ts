import z from 'zod';

const envVariables = z.object({
  // todo: rather use version here instead of git_sha
  GIT_SHA: z.string().default('v6.1.5'),
  DB_CONNECTION_STRING: z.string(),
  APPLICATIONINSIGHTS_CONNECTION_STRING: z.string().optional(),
});

const env = envVariables.parse(process.env);

export default {
  version: env.GIT_SHA,
  applicationInsights: {
    connectionString: env.APPLICATIONINSIGHTS_CONNECTION_STRING,
  },
  postgresql: {
    connectionString: env.DB_CONNECTION_STRING,
  },
};
