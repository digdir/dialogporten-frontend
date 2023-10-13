import { Request, Response } from 'express';
import { HelloWorldDto } from '../Dtos';
const process = require('process');

// Placeholder code for this template
const get = async (req: Request<any, any, HelloWorldDto>, res: Response): Promise<void> => {
  const { name } = req.headers;
  res.send({
    id: 1,
    message: `Hello ${name || 'Mr. Anonymous'}, deploy time: ${process.env?.DEPLOY_TIMESTAMP}`,
    process: process.env,
  });
};

const create = async (req: Request<any, any, HelloWorldDto>, res: Response): Promise<void> => {
  const { name } = req.body;
  res.send(`Hello ${name}, env: ${process.env}`);
};

export const helloWorld = { get, create };
