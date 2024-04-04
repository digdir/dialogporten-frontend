FROM node:20-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY . .

RUN pnpm install --frozen-lockfile

ENV DEBUG="*"
ENV PORT=80
ENV TS_NODE_SKIP_IGNORE=true

EXPOSE 80
CMD [ "pnpm", "--filter", "bff-graphql-poc", "run", "start" ]

# ----

FROM build as pruned
WORKDIR /app

RUN pnpm --filter bff-graphql-poc --prod deploy pruned

# ---

FROM node:20-slim
WORKDIR /app

ENV NODE_ENV=production

COPY --from=pruned /app/pruned .

ENV PORT=80
ENV TS_NODE_SKIP_IGNORE=true

EXPOSE 80
CMD [ "./src/index.ts" ]
