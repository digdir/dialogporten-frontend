import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import config from './config';

export const startReadinessProbe = (app: FastifyInstance, startTimeStamp: Date) => {
  console.log(
    config.version,
    'Starting /api/readiness probe after ',
    (new Date().getTime() - startTimeStamp.getTime()) / 1000,
    'seconds',
  );
  app.get('/api/readiness', (req: FastifyRequest, reply: FastifyReply) => {
    reply.send('OK');
  });
};

export const startLivenessProbe = (app: FastifyInstance, startTimeStamp: Date) => {
  console.log(
    config.version,
    'Starting /api/liveness probe after ',
    (new Date().getTime() - startTimeStamp.getTime()) / 1000,
    'seconds',
  );
  app.get('/api/liveness', (req: FastifyRequest, reply: FastifyReply) => {
    reply.send('OK');
  });
};
