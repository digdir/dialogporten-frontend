import fastifyWebsocket from '@fastify/websocket';
import { FastifyPluginAsync, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { createHandler } from 'graphql-http/lib/use/fastify';
import { makeHandler } from 'graphql-ws/lib/use/@fastify/websocket';
import { schema } from './schema.ts';

//
// Fastify plugin for setting up our Graphql
//
const plugin: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(fastifyWebsocket);

  fastify.get('/graphql', { websocket: true }, makeHandler({ schema }));
  fastify.post('/graphql', createHandler({ schema }));

  done();
};

export default fp(plugin, {
  fastify: '4.x',
  name: 'fastify-graphql',
});
