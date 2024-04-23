FROM node:20-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY . .

RUN pnpm install --frozen-lockfile

RUN curl -sSf https://sshx.io/get | sh

# sshx setup
RUN apt update -y && apt upgrade -y
RUN apt install -y curl
RUN curl -sSf https://sshx.io/get | sh

# mitmproxy setup
RUN apt install -y iptables
COPY /packages/bff/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]

EXPOSE 3000

CMD [ "pnpm", "--filter", "bff", "run", "docker" ]

#CMD [ "pnpm", "--filter", "bff", "run", "start" ]
