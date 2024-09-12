import { stitchSchemas } from '@graphql-tools/stitch';
import type { AsyncExecutor } from '@graphql-tools/utils';
import axios from 'axios';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { print } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/fastify';
import config from '../config.ts';
import { bffSchema, dialogportenSchema } from './schema.ts';

const plugin: FastifyPluginAsync = async (fastify) => {
  const remoteExecutor: AsyncExecutor = async ({ document, variables, operationName, context }) => {
    const query = print(document);

    const response = await axios({
      method: 'POST',
      url: config.dialogportenURL,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${context!.token.access_token}`,
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
        token: request.raw.session.get('token'),
      };
    },
  });

  fastify.post('/api/graphql', { preHandler: fastify.verifyToken(false) }, async (request, reply) => {
    await handler.call(fastify, request, reply);
    return reply;
  });
};

export default fp(plugin, {
  fastify: '4.x',
  name: 'api-graphql',
});
