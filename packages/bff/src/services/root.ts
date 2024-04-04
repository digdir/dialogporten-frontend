import fp from 'fastify-plugin';
import { FastifyPluginCallback } from 'fastify';
const plugin: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get('/api/hello', (request, reply) => {
    reply.send({ hello: "hei" })
  });
  done();
}

export default fp(plugin, {
  fastify: '4.x',
  name: 'fastify-graphiql',
});