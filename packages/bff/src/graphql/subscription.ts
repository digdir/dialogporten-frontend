import { stitchSchemas } from '@graphql-tools/stitch';
import type { AsyncExecutor } from '@graphql-tools/utils';
import axios from 'axios';
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { print } from 'graphql';
import { createHandler } from 'graphql-sse/lib/use/fastify';
import config from '../config.js';
import { bffSchema, dialogportenSchema } from './schema.ts';

const plugin: FastifyPluginAsync = async (fastify, options) => {
  const remoteExecutor: AsyncExecutor = async ({ document, variables, operationName, context }) => {
    try {
      const token = context!.session.get('token');
      const reply = context!.reply;
      const query = print(document);

      reply.raw.setHeader('Content-Type', 'text/event-stream');
      reply.raw.setHeader('Cache-Control', 'no-cache');
      reply.raw.setHeader('Connection', 'keep-alive');
      reply.raw.flushHeaders();

      const response = await axios({
        method: 'POST',
        responseType: 'stream',
        url: config.dialogportenURL,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token!.access_token}`,
          accept: 'text/event-stream',
        },
        data: JSON.stringify({ query, variables, operationName }),
      });

      return response.data.pipe(reply.raw);
    } catch (error) {
      console.log('ERRRRRRRRRR Error in remoteExecutor', error);
    }
  };

  const remoteExecutorSubschema = {
    schema: dialogportenSchema,
    executor: remoteExecutor,
  };

  const stitchedSchema = stitchSchemas({
    subschemas: [remoteExecutorSubschema, bffSchema],
  });

  fastify.all(
    '/api/graphql/stream',
    { preHandler: fastify.verifyToken(false) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const handler = createHandler({
        schema: stitchedSchema,
        context(request) {
          return {
            session: request.raw.session,
            reply: request.raw,
          };
        },
      });

      return handler.call(fastify, request, reply);
    },
  );
};

export default fp(plugin, {
  fastify: '4.x',
  name: 'subscription-graphql',
});
