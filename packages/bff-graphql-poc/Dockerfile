FROM node:20-slim AS build
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY . .

RUN mkdir -p /app/cache

RUN --mount=type=cache,target=/app/cache \
    if [ ! -f "/app/cache/corepack.tgz" ]; then \
    corepack pnpm --version \
    corepack pack -o /app/cache/corepack.tgz; \
    fi

RUN --mount=type=cache,target=/app/cache \
    COREPACK_ENABLE_NETWORK=0 corepack install -g /app/cache/corepack.tgz

RUN corepack enable

RUN \
	--mount=type=cache,id=pnpm,target=/pnpm/store \
	pnpm install --frozen-lockfile --prefer-offline

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
