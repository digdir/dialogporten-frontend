import express from 'express';
import { helloWorldRouter } from './helloWorldRouter';

const routes = express.Router();

routes.use('/', helloWorldRouter);

export { routes };
