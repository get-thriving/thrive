# syntax=docker/dockerfile:1
# Render builds this file on its own. `mise run build:docker` builds the
# matching target in infra/docker/node.Dockerfile, which installs dependencies and
# compiles the WebAPI client once for both apps. Keep this file aligned.
FROM node:22.23.3 AS node-base

LABEL maintainer='mike@get-thriving.com'

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt-get update && \
    apt-get install -y --no-install-recommends dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@11.0.9

WORKDIR /jupiter

ENV CI=true

FROM node-base AS node-meta

COPY package.json package.json
COPY pnpm-workspace.yaml pnpm-workspace.yaml
COPY pnpm-lock.yaml pnpm-lock.yaml
COPY .npmrc .npmrc
COPY gen/ts/webapi-client/package.json gen/ts/webapi-client/package.json
COPY src/core/package.json src/core/package.json
COPY src/webui/package.json src/webui/package.json
COPY src/published/package.json src/published/package.json
COPY src/desktop/package.json src/desktop/package.json
COPY src/mobile/package.json src/mobile/package.json

FROM node-meta AS node-deps

# Package manifests only, so an app-source change does not reinstall.
# Hoisted node-linker still links the whole lockfile; the filters document
# which workspace projects the images need (webui, published, and the root
# package, which provides tsc).
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,sharing=locked \
    pnpm install --frozen-lockfile --store-dir /pnpm/store \
        --filter @jupiter/webui... \
        --filter @jupiter/published... \
        --filter jupiter

FROM node-deps AS node-client

COPY gen/ts/webapi-client gen/ts/webapi-client

RUN pnpm --dir gen/ts/webapi-client exec tsc

FROM node-client AS published

COPY LICENSE LICENSE
COPY src/Config.global src/Config.global
COPY src/core/README.md src/core/README.md
COPY src/core/tsconfig.json src/core/tsconfig.json
COPY src/core/editorjs.d.ts src/core/editorjs.d.ts
COPY src/core/jupiter/core src/core/jupiter/core
COPY src/published/README.md src/published/README.md
COPY src/published/Config.project src/published/Config.project
COPY src/published/tsconfig.json src/published/tsconfig.json
COPY src/published/vite.config.mts src/published/vite.config.mts
COPY src/webui/trust-proxy.cjs src/published/trust-proxy.cjs
COPY src/webui/docker-entrypoint.sh src/published/docker-entrypoint.sh
COPY src/published/react-router.config.ts src/published/react-router.config.ts
COPY src/published/env.d.ts src/published/env.d.ts
COPY src/published/app src/published/app
COPY assets/jupiter.ico src/published/public/favicon.ico
COPY assets/jupiter.png src/published/public/logo.png

ARG PORT=10040
ENV HOST=0.0.0.0
ENV PORT=$PORT
EXPOSE $PORT

WORKDIR /jupiter/src/published

RUN pnpm exec react-router build

ENTRYPOINT ["dumb-init", "sh", "./docker-entrypoint.sh"]
