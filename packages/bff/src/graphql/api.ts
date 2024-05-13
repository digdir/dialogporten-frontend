import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { createHandler } from 'graphql-http/lib/use/fastify';
import config from '../config.ts';
import { schema } from './schema.ts';

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

  fastify.post(
    '/api/graphql2',
    { preValidation: fastify.verifyToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const token = request.session.get('token');
        const headers = {
          'content-type': 'application/json',
          Authorization: `Bearer ${token!.access_token}`,
        };

        const response = await axios({
          method: 'POST',
          url: config.dialogportenURL + '/graphql',
          data: request.body,
          headers,
        });
        reply.send(response.data);
      } catch (e) {
        reply.status(500).send({ error: 'Internal Server Error', message: (e as unknown as Error).message });
      }
    },
  );
};

export default fp(plugin, {
  fastify: '4.x',
  name: 'api-graphql',
});
