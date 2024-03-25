FROM node:20 AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY . .

RUN pnpm install --frozen-lockfile

ENV DEBUG="*"
ENV PORT=80

EXPOSE 80
CMD [ "pnpm", "--filter", "bff-graphql-poc", "run", "start" ]
