FROM node:22.14
LABEL maintainer='mike@get-thriving.com'

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt-get update && \
    apt-get install -y --no-install-recommends dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /jupiter

ENV CI=true

COPY LICENSE LICENSE
COPY package.json package.json
COPY pnpm-workspace.yaml pnpm-workspace.yaml
COPY pnpm-lock.yaml pnpm-lock.yaml
COPY gen gen
COPY src/Config.global src/Config.global
COPY src/core/README.md src/core/README.md
COPY src/core/package.json src/core/package.json
COPY src/core/tsconfig.json src/core/tsconfig.json
COPY src/core/jupiter/core src/core/jupiter/core
COPY src/published/README.md src/published/README.md
COPY src/published/Config.project src/published/Config.project
COPY src/published/package.json src/published/package.json
COPY src/published/tsconfig.json src/published/tsconfig.json
COPY src/published/remix.config.js src/published/remix.config.js
COPY src/published/remix.env.d.ts src/published/remix.env.d.ts
COPY src/published/app src/published/app
COPY assets/jupiter.ico src/published/public/favicon.ico
COPY assets/jupiter.png src/published/public/logo.png

RUN npm install -g pnpm@11.0.9 && pnpm install && chown -R "$(id -u)":"$(id -g)" node_modules

# hadolint ignore=DL3003
RUN cd gen/ts/webapi-client && npx tsc

ARG PORT=10040
ENV HOST=0.0.0.0
ENV PORT=$PORT
EXPOSE $PORT

WORKDIR /jupiter/src/published

RUN npx remix build

ENTRYPOINT [ "dumb-init", "npx", "remix-serve", "build/index.js" ]
