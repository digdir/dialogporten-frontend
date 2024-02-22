FROM node:20-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter storybook run build

EXPOSE 80

CMD ["pnpm", "--filter", "storybook", "run", "start:storybook", "--port", "80"]

# ---

FROM nginx:1.25-alpine
COPY --from=build /app/packages/storybook/storybook-static/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

