import '../config/env';

export const initPgEnvVars = (dbConnectionString: string) => {
  try {
    const pgJson = JSON.parse(dbConnectionString);
    if (pgJson?.host) {
      process.env.DB_HOST = pgJson.host;
      process.env.DB_PORT = pgJson.port;
      process.env.DB_USER = pgJson.user;
      process.env.DB_PASSWORD = pgJson.password;
      process.env.DB_NAME = pgJson.dbname;
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('initPgEnvVars: Error reading dbConnectionStringOK: ', error);
    return false;
  }
};
