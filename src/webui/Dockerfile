FROM node:22.14
LABEL maintainer='mike@get-thriving.com'

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt-get update && \
    apt-get install -y --no-install-recommends dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /jupiter

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
COPY src/webui/README.md src/webui/README.md
COPY src/webui/Config.project src/webui/Config.project
COPY src/webui/package.json src/webui/package.json
COPY src/webui/tsconfig.json src/webui/tsconfig.json
COPY src/webui/remix.config.js src/webui/remix.config.js
COPY src/webui/remix.env.d.ts src/webui/remix.env.d.ts
COPY src/webui/from-electron.d.ts src/webui/from-electron.d.ts
COPY src/webui/app src/webui/app
COPY assets/jupiter.ico src/webui/public/favicon.ico
COPY assets/jupiter.png src/webui/public/logo.png
COPY src/webui/public/pomodoro-notification.mp3 src/webui/public/pomodoro-notification.mp3
COPY src/webui/public/frontdoor-redirect-hack-init.html src/webui/public/frontdoor-redirect-hack-init.html
COPY src/webui/public/frontdoor-redirect-hack-workspace.html src/webui/public/frontdoor-redirect-hack-workspace.html

RUN npm install -g pnpm@latest && pnpm install && chown -R "$(id -u)":"$(id -g)" node_modules

# hadolint ignore=DL3003
RUN cd gen/ts/webapi-client && npx tsc

ARG PORT=10020
ENV HOST=0.0.0.0
ENV PORT=$PORT
EXPOSE $PORT

WORKDIR /jupiter/src/webui

RUN npx remix build

ENTRYPOINT [ "dumb-init", "npx", "remix-serve", "build/index.js" ]
