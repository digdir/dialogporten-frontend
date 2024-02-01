import express from 'express';
import { helloWorldRouter } from './helloWorldRouter';
import { authenticationRouter } from './authenticationRouter';

const routes = express.Router();

routes.use('/test', helloWorldRouter);
routes.use('/auth', authenticationRouter);

export { routes };
