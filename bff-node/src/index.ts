import express, { Express } from 'express';
import bodyParser from 'body-parser';
// import swaggerUi from 'swagger-ui-express';
// import swaggerFile from './swagger_output.json';
// import './config/env';
// import { DBConnection } from './config/database';
import { routes } from './routes';
import path from 'path';
const process = require('process');

const DIST_DIR = path.join(__dirname, 'public');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

const app: Express = express();
const port = process.env.PORT || 80;

app.use(express.static(DIST_DIR));
app.get('/', (req, res) => {
  res.sendFile(HTML_FILE);
});
app.use(bodyParser.json());
app.use('/api/v1', routes);
console.log('************* ENVIRONMENT *************');
console.log('ENV_TEST: ', process.env.ENV_TEST);
console.log('ALL: ', process.env);
console.log(
  'process.env.APPSETTING_BICEP_TEST_ENV_VARIABLE: ',
  process.env.APPSETTING_BICEP_TEST_ENV_VARIABLE
);

// app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerFile));

const start = async (): Promise<void> => {
  try {
    // await DBConnection.sync();
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running on PORT: ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();
