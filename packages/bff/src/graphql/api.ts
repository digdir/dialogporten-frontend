import session from '@fastify/session';
import { stitchSchemas } from '@graphql-tools/stitch';
import { AsyncExecutor } from '@graphql-tools/utils';
import axios from 'axios';
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { print } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/fastify';
import { validateOrRefreshToken } from '../auth/verifyToken.js';
import config from '../config.ts';
import { bffSchema, dialogportenSchema } from './schema.ts';

const plugin: FastifyPluginAsync = async (fastify, options) => {
  const remoteExecutor: AsyncExecutor = async ({ document, variables, operationName, context }) => {
    const request = context!.request;
    await validateOrRefreshToken(request);

    const token = request.session.get('token');
    const query = print(document);

    const response = await axios({
      method: 'POST',
      url: config.dialogportenURL,
      headers: {
        'content-type': 'application/json',
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

  fastify.post(
    '/api/graphql',
    { preValidation: fastify.verifyToken },
    createHandler({
      schema: stitchedSchema,
      context(request) {
        return {
          request: {
            ...request,
            session: request.raw.session,
          },
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
