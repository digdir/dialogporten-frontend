import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import logger from '@digdir/dialogporten-node-logger';

interface Props {
  version: string;
}

const plugin: FastifyPluginAsync<Props> = async (fastify, options) => {
  const { version } = options;
  const startTimeStamp = new Date();
  const secondsAfterStart = (new Date().getTime() - startTimeStamp.getTime()) / 1000;

  logger.info(`${version} starting /api/readiness probe after ${secondsAfterStart} seconds`);
  fastify.get('/api/readiness', (req: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send();
  });

  logger.info(`${version} starting /api/liveness probe after ${secondsAfterStart} seconds`);
  fastify.get('/api/liveness', (req: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send();
  });
};

export default fp(plugin, {
  fastify: '4.x',
  name: 'azure-healthprobs',
});
