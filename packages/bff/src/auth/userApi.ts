import axios from 'axios';
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { getOrCreateProfile } from '../entities/Profile.ts';

const plugin: FastifyPluginAsync = async (fastify, options) => {
  fastify.post(
    '/api/test',
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
          url: 'https://dp-be-test-graphql-ca.lemonisland-e7641482.norwayeast.azurecontainerapps.io/graphql',
          data: request.body,
          headers,
        });
        reply.send(response.data);
      } catch (e) {
        reply.status(500).send({ error: 'Internal Server Error', message: (e as unknown as Error).message });
      }
    },
  );

  fastify.get(
    '/api/user',
    { preValidation: fastify.verifyToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const sub = request.session.get('sub')!;
        const locale = request.session.get('locale')!;
        const profile = await getOrCreateProfile(sub, locale);
        reply.send(request.session.get('token'));
      } catch (e) {
        console.error('Error fetching user endpoint:', e);
        reply.status(500).send({ error: 'Internal Server Error' });
      }
    },
  );

  fastify.get(
    '/api/isAuthenticated',
    { preValidation: fastify.verifyToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        reply.send({
          isAuthenticated: true,
        });
      } catch (e) {
        console.error('Error fetching isAuthenticated endpoint:', e);
        reply.status(500).send({ error: 'Internal Server Error' });
      }
    },
  );
};

export default fp(plugin, {
  fastify: '4.x',
  name: 'api-user',
});
