import fastifyWebsocket from '@fastify/websocket';
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { createHandler } from 'graphql-http/lib/use/fastify';
import { makeHandler } from 'graphql-ws/lib/use/@fastify/websocket';

interface Options {
  schema: any;
  url: string;
}

//
// Fastify plugin for setting up our Graphql
//
const plugin: FastifyPluginAsync<Options> = async (fastify, opts) => {
  const { schema, url } = opts;

  fastify.register(fastifyWebsocket);

  fastify.get(url, { websocket: true }, makeHandler({ schema }));
  fastify.post(url, createHandler({ schema }));
};

export default fp(plugin, {
  fastify: '4.x',
  name: 'fastify-graphql',
});
