FROM node:20 as backend
WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile --production=false
RUN pnpm --filter bff-node run build

EXPOSE 80

CMD ["pnpm", "--filter", "bff-node", "run", "build"]
