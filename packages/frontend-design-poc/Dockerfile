FROM node:20-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter frontend-design-poc run build

# `EXPOSE`, `ENV` and `CMD` in this stage is only used for dev
EXPOSE 80
ENV PORT=80
CMD ["pnpm", "--filter", "frontend-design-poc", "run", "dev", "--host", "0.0.0.0"]

# ---

FROM nginx:1.25-alpine
COPY --from=build /app/packages/frontend-design-poc/dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
