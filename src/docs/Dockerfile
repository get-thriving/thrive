# syntax=docker/dockerfile:1
# Render builds this service by itself. `mise run build:docker` uses
# infra/docker/python.Dockerfile so the WebAPI images share one dependency install.
FROM python:3.13.0

LABEL maintainer='mike@get-thriving.com'

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt-get update && \
    apt-get install -y --no-install-recommends git curl netcat-openbsd dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:0.11.7 /uv /uvx /bin/

WORKDIR /jupiter

ENV VIRTUAL_ENV=/jupiter/venv \
    UV_PROJECT_ENVIRONMENT=/jupiter/venv \
    UV_LINK_MODE=copy \
    UV_PYTHON_PREFERENCE=only-system \
    PATH="/jupiter/venv/bin:${PATH}"

COPY uv.lock uv.lock
COPY --parents \
    pyproject.toml \
    gen/py/webapi-client/pyproject.toml \
    src/alib/py/framework/pyproject.toml \
    src/webapi/gc-do-all/pyproject.toml \
    src/webapi/clear-abandoned-users-do-all/pyproject.toml \
    src/webapi/sync-google-user-data-do-all/pyproject.toml \
    src/webapi/sync-apple-user-data-do-all/pyproject.toml \
    src/webapi/gen-do-all/pyproject.toml \
    src/webapi/schedule-external-sync-do-all/pyproject.toml \
    src/webapi/search-index-backfill-do-all/pyproject.toml \
    src/webapi/crm-backfill-do-all/pyproject.toml \
    src/webapi/search-mutation-log-drain-do-all/pyproject.toml \
    src/webapi/search-mutation-requeue-do-all/pyproject.toml \
    src/webapi/stats-do-all/pyproject.toml \
    src/webapi/srv/pyproject.toml \
    src/api/pyproject.toml \
    src/mcp/pyproject.toml \
    src/core/pyproject.toml \
    src/docs/pyproject.toml \
    src/cli/pyproject.toml \
    itests/pyproject.toml \
    ./

RUN --mount=type=cache,id=uv,target=/root/.cache/uv,sharing=locked \
    uv sync --frozen --no-dev --no-install-workspace --package jupiter-docs

COPY LICENSE LICENSE
COPY src/Config.global src/Config.global
COPY src/docs/README.md src/docs/README.md
COPY src/docs/mkdocs.yml src/docs/mkdocs.yml
COPY src/docs/material src/docs/material
COPY assets/jupiter.ico src/docs/material/assets/favicon.ico
COPY assets/jupiter.png src/docs/material/assets/jupiter.png
COPY assets/showcase-*.png src/docs/material/assets/showcase/

ARG PORT=8000
ENV HOST=0.0.0.0
ENV PORT=$PORT
ENV DEV_ADDR=$HOST:$PORT
EXPOSE $PORT

WORKDIR /jupiter/src/docs

ENTRYPOINT ["mkdocs", "serve", "--no-livereload"]
