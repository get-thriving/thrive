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
    uv sync --frozen --no-dev --no-install-workspace --package jupiter-webapi-search-mutation-log-drain-do-all

COPY src/alib/py/framework/README.md src/alib/py/framework/README.md
COPY src/alib/py/framework/jupiter src/alib/py/framework/jupiter
COPY src/core/README.md src/core/README.md
COPY src/core/jupiter src/core/jupiter
COPY src/core/migrations src/core/migrations

RUN --mount=type=cache,id=uv,target=/root/.cache/uv,sharing=locked \
    uv sync --frozen --no-dev --no-editable --package jupiter-webapi-search-mutation-log-drain-do-all

COPY LICENSE LICENSE
COPY src/Config.global src/Config.global
COPY src/webapi/search-mutation-log-drain-do-all/README.md src/webapi/search-mutation-log-drain-do-all/README.md
COPY src/webapi/search-mutation-log-drain-do-all/Config.project src/webapi/search-mutation-log-drain-do-all/Config.project
COPY src/webapi/search-mutation-log-drain-do-all/jupiter_webapi_search_mutation_log_drain_do_all src/webapi/search-mutation-log-drain-do-all/jupiter_webapi_search_mutation_log_drain_do_all

WORKDIR /jupiter/src/webapi/search-mutation-log-drain-do-all

ENTRYPOINT ["dumb-init", "python", "-m", "jupiter_webapi_search_mutation_log_drain_do_all.jupiter"]
