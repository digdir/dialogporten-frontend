import express from 'express';
import { authenticationRouter } from './authenticationRouter';

const routes = express.Router();
routes.use('/', authenticationRouter);

export { routes };
