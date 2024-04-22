# GraphQL

## Usage

In a `fastify` node project, add the following:

```typescript
import Fastify from 'fastify';
import fastifyGraphql from 'fastify-graphql';

// Setting up webserver
const app = Fastify();

app.register(fastifyGraphql, {
	schema,
	url: '/graphql',
});

app.listen({ port }, (err, address) => {
  if (err) {
    log(err);
    process.exit(1);
  }
  console.log(`App started on ${address}`);
});
```
