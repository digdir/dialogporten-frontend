import { Request, Response } from 'express';
import { HelloWorldDto } from '../Dtos';

// Placeholder code for this template
const get = async (req: Request<any, any, HelloWorldDto>, res: Response): Promise<void> => {
  const { name } = req.headers;
  res.send({ id: 1, message: `Hello ${name || 'Mr. Anonymous'}` });
};

const create = async (req: Request<any, any, HelloWorldDto>, res: Response): Promise<void> => {
  const { name } = req.body;
  res.send(`Hello ${name}`);
};

export const helloWorld = { get, create };
