import { Request, Response } from 'express';
import { HelloWorldDto } from '../Dtos';
import { testKeyVault } from '..';
import dataSource from '../data-source';
import { Person } from '../entities/Person';
const process = require('process');

// Placeholder code for this template
const get = async (req: Request<any, any, HelloWorldDto>, res: Response): Promise<void> => {
  const { name } = req.headers;
  res.send({
    id: 1,
    message: `Hello ${name || 'Mr. Anonymous'}, deploy time: ${process.env?.DEPLOY_TIMESTAMP}`,
    process: process.env,
    testKeyVault: await testKeyVault(),
  });
};
// Placeholder code for this template
const test = async (req: Request<any, any, HelloWorldDto>, res: Response): Promise<void> => {
  const { name } = req.headers;
  // const dataSource = await new DataSource(connectionOptions).initialize();
  const PersonRepository = dataSource.getRepository(Person);
  const user = new Person();
  const d = new Date();
  user.name = 'Endepunkt Bruker';
  user.favoriteMovie = d.toLocaleString();
  user.age = 45;
  await PersonRepository.save(user);
  res.send({
    user,
  });
};

const create = async (req: Request<any, any, HelloWorldDto>, res: Response): Promise<void> => {
  const { name } = req.body;
  res.send(`Hello ${name}, env: ${process.env}`);
};

export const helloWorld = { get, create, test };
