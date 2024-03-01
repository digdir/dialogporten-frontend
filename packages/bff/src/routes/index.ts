import express from 'express';
import { authenticationRouter } from './authenticationRouter';
import { helloWorldRouter } from './helloWorldRouter';

const routes = express.Router();

routes.use('/test', helloWorldRouter);
routes.use('/auth', authenticationRouter);

export { routes };
