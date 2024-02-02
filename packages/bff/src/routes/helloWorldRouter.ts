import express from 'express';
import { helloWorld } from '../controllers/helloWorld';
// import { validateModel } from "../middleware";
// import { helloWorldDTOSchema } from "../Dtos";

const helloWorldRouter = express.Router();

helloWorldRouter.get('/test', helloWorld.get);
// helloWorldRouter.post(
//   "/create",
//   validateModel(helloWorldDTOSchema),
//   helloWorld.create
// );

export { helloWorldRouter };
