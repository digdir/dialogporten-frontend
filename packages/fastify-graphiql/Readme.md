# GraphiQL

Adds the GraphiQL graphical interactive in-browser GraphQL IDE to fastify.

## Usage

In a `fastify` node project, add the following:

```typescript
import Fastify from 'fastify';
import fastifyGraphiql from 'fastify-graphiql';

// Setting up webserver
const app = Fastify();

app.register(fastifyGraphiql);

app.listen({ port }, (err, address) => {
  if (err) {
    log(err);
    process.exit(1);
  }
  console.log(`App started on ${address}`);
});
```
