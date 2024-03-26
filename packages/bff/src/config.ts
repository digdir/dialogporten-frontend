import z from 'zod';

const envVariables = z.object({
  DB_CONNECTION_STRING: z.string(),
  APPLICATIONINSIGHTS_CONNECTION_STRING: z.string().optional(),
});

const env = envVariables.parse(process.env);

export default {
  applicationInsights: {
    connectionString: env.APPLICATIONINSIGHTS_CONNECTION_STRING,
  },
  postgresql: {
    connectionString: env.DB_CONNECTION_STRING,
  },
};
