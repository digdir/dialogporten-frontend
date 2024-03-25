import z from 'zod';

// Setup types and default values for enviroment variables
const envVariables = z.object({
  DB_CONNECTION_STRING: z.string(),
  APPLICATIONINSIGHTS_CONNECTION_STRING: z.string().optional(),
});

// Parse `process.env`
const env = envVariables.parse(process.env);

export default {
  applicationInsights: {
    connectionString: env.APPLICATIONINSIGHTS_CONNECTION_STRING,
  },
  postgresql: {
    connectionString: env.DB_CONNECTION_STRING,
  },
};
