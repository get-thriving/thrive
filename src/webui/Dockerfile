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

FROM node-client AS webui

COPY LICENSE LICENSE
COPY src/Config.global src/Config.global
COPY src/core/README.md src/core/README.md
COPY src/core/tsconfig.json src/core/tsconfig.json
COPY src/core/editorjs.d.ts src/core/editorjs.d.ts
COPY src/core/jupiter/core src/core/jupiter/core
COPY src/webui/README.md src/webui/README.md
COPY src/webui/Config.project src/webui/Config.project
COPY src/webui/tsconfig.json src/webui/tsconfig.json
COPY src/webui/vite.config.mts src/webui/vite.config.mts
COPY src/webui/trust-proxy.cjs src/webui/trust-proxy.cjs
COPY src/webui/docker-entrypoint.sh src/webui/docker-entrypoint.sh
COPY src/webui/react-router.config.ts src/webui/react-router.config.ts
COPY src/webui/env.d.ts src/webui/env.d.ts
COPY src/webui/from-electron.d.ts src/webui/from-electron.d.ts
COPY src/webui/app src/webui/app
COPY assets/jupiter.ico src/webui/public/favicon.ico
COPY assets/jupiter.png src/webui/public/logo.png
COPY src/webui/public/pomodoro-notification.mp3 src/webui/public/pomodoro-notification.mp3
COPY src/webui/public/frontdoor-redirect-hack-init.html src/webui/public/frontdoor-redirect-hack-init.html
COPY src/webui/public/frontdoor-redirect-hack-workspace.html src/webui/public/frontdoor-redirect-hack-workspace.html

ARG PORT=10020
ENV HOST=0.0.0.0
ENV PORT=$PORT
EXPOSE $PORT

WORKDIR /jupiter/src/webui

RUN pnpm exec react-router build

ENTRYPOINT ["dumb-init", "sh", "./docker-entrypoint.sh"]

