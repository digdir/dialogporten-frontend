import { stitchSchemas } from '@graphql-tools/stitch';
import type { AsyncExecutor } from '@graphql-tools/utils';
import axios from 'axios';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { print } from 'graphql';
import { createHandler } from 'graphql-sse/lib/use/fastify';
import config from '../config.js';
import { bffSchema, dialogportenSchema } from './schema.ts';

const plugin: FastifyPluginAsync = async (fastify, options) => {
  const remoteExecutor: AsyncExecutor = async ({ document, variables, operationName, context }) => {
    const token = context!.session.get('token');
    const query = print(document);

    const response = await axios({
      method: 'POST',
      responseType: 'stream',
      url: config.dialogportenURL,
      headers: {
        Accept: 'text/event-stream',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token!.access_token}`,
      },
      data: JSON.stringify({ query, variables, operationName }),
    });
    return response.data;
  };

  const remoteExecutorSubschema = {
    schema: dialogportenSchema,
    executor: remoteExecutor,
  };

  const stitchedSchema = stitchSchemas({
    subschemas: [remoteExecutorSubschema, bffSchema],
  });

  const handler = createHandler({
    schema: stitchedSchema,
    context(request) {
      return {
        session: request.raw.session,
        headers: request.headers,
      };
    },
  });

  fastify.all('/api/graphql/stream', { preHandler: fastify.verifyToken(false) }, async (request, reply) => {
    try {
      await handler(request, reply);
    } catch (err) {
      console.error(err);
      reply.code(500).send();
    }
  });
};

export default fp(plugin, {
  fastify: '4.x',
  name: 'subscription-graphql',
});
