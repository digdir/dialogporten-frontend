#!/usr/bin/env -S node --no-warnings=ExperimentalWarning --loader ts-node/esm
import debug from 'debug';
import Fastify from 'fastify';
import fastifyGraphiql from 'fastify-graphiql';
import debugScreen from './debug-screen.tsx';
import { host, mode, port } from './env.ts';
import fastifyGraphql from './graphql.ts';

// Setting up logger function
const log = debug('app');

// Setting up webserver
const app = Fastify();

app.register(fastifyGraphql);

if (mode === 'development') {
  log('`development` mode, activating Graphiql and debug screen');
  app.register(fastifyGraphiql);
  app.register(debugScreen);
}

app.listen({ port, host }, (err, address) => {
  if (err) {
    log(err);
    process.exit(1);
  }
  console.log(`App started on ${address}`);
});
