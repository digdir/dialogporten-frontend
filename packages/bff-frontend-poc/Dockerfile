FROM node:20-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ARG NODE_ENV=development

WORKDIR /app
COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter bff-frontend-poc run build

CMD ["pnpm", "--filter", "bff-frontend-poc", "run", "start"]

# ---

FROM nginx:1.25-alpine
COPY --from=build /app/packages/bff-frontend-poc/dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
