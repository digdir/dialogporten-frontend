#!/usr/bin/env -S node --no-warnings=ExperimentalWarning --loader ts-node/esm
import './instrumentation.ts';
import 'reflect-metadata';

// There is a race-condition where fastify, redis and postgres is booted before the instrumentation is ready.
// By starting the app in a function we avoid the imports being hoisted, and we ensure that the instrumentation is ready before the app is started.
function start() {
  import('./app.ts');
}
start();
