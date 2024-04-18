import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { getOrCreateProfile } from '../entities/Profile';

const plugin: FastifyPluginAsync = async (fastify, options) => {
  fastify.get(
    '/api/user',
    { preValidation: fastify.verifyToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const sub = request.session.get('sub')!;
        const locale = request.session.get('locale')!;
        const profile = await getOrCreateProfile(sub, locale);
        reply.send(profile);
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
