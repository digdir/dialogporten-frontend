import { Request, Response } from 'express';
import { HelloWorldDto } from '../Dtos';
import { StartUpRepository, bffVersion } from '..';
const process = require('process');

async function getMostRecentStartUp() {
  const mostRecentStartUp = await StartUpRepository?.createQueryBuilder('startup')
    .orderBy('startup.created_at', 'DESC')
    .getOne();

  return mostRecentStartUp;
}

// Placeholder code for this template
const get = async (req: Request<any, any, HelloWorldDto>, res: Response): Promise<void> => {
  const mostRecentStartUp = await getMostRecentStartUp();
  console.log('mostRecentStartUp', mostRecentStartUp);
  res.send({
    id: 1,
    message: `Last startup was ${mostRecentStartUp?.created_at}`,
    process: process.env,
    bffVersion,
  });
};

const create = async (req: Request<any, any, HelloWorldDto>, res: Response): Promise<void> => {
  // const { name } = req.body;
  res.send(`Hello ${name}, env: ${process.env}`);
};

export const helloWorld = { get, create };
