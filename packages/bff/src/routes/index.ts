import express from 'express';
import { authenticationRouter } from './authenticationRouter';

const routes = express.Router();

routes.use('/auth', authenticationRouter);

export { routes };
