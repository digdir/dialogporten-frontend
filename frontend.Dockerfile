FROM node:20 as build
WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile --production=false
RUN pnpm --filter frontend run build

FROM nginx:1.25.3

WORKDIR /app
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT nginx -g 'daemon off;'
