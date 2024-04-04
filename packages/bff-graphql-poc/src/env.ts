import z from 'zod';

// Setup types and default values for enviroment variables
const envVariables = z.object({
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  MODE: z.enum(['development', 'production']).default('development'),
});

// Parse `process.env`
const env = envVariables.parse(process.env);

// Export enviroment variables (but with lowercase-casing for readability)
export const port = env.PORT;
export const host = env.HOST;
export const mode = env.MODE;
