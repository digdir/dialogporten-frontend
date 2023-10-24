import express from 'express';
import { helloWorld } from '../controllers/helloWorld';
// import { validateModel } from "../middleware";
// import { helloWorldDTOSchema } from "../Dtos";

const helloWorldRouter = express.Router();

helloWorldRouter.get('/test', helloWorld.get);
helloWorldRouter.get('/test2', helloWorld.test);
// helloWorldRouter.post(
//   "/create",
//   validateModel(helloWorldDTOSchema),
//   helloWorld.create
// );

export { helloWorldRouter };
