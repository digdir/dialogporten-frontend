import { FastifyPluginAsync, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const plugin: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get('/', async (request, reply) => {
    reply.type('text/html');
    reply.send(
      `
			<div>
				<h1> bff-graphql-poc </h1>
				<ul>
					<li> <a href="/graphiql"> graphiql </a> </li>
				</ul>
			</div>
			`,
    );
  });

  done();
};

export default fp(plugin, {
  fastify: '4.x',
  name: 'debug-screen',
});
