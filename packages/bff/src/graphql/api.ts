import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { createHandler } from 'graphql-http/lib/use/fastify';
import { schema } from './schema.js';

const plugin: FastifyPluginAsync = async (fastify, options) => {
  fastify.post(
    '/api/graphql',
    { preValidation: fastify.verifyToken },
    createHandler({
      schema,
      context(request) {
        return {
          session: request.raw.session,
        };
      },
    }),
  );
};

export default fp(plugin, {
  fastify: '4.x',
  name: 'api-graphql',
});
