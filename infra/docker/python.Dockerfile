# syntax=docker/dockerfile:1
# Shared Python image graph. WebAPI, the cron jobs, API, and MCP install one
# dependency set. Cron images then only copy their own source.
# Render builds the per-service Dockerfiles under src/, which follow the same
# uv flags. Keep those entrypoints aligned with the stages below.

FROM python:3.13.0 AS python-base

LABEL maintainer='mike@get-thriving.com'

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt-get update && \
    apt-get install -y --no-install-recommends git curl netcat-openbsd dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:0.11.7 /uv /uvx /bin/

WORKDIR /jupiter

# only-system: do not download another CPython. copy: the uv cache mount is a
# different filesystem from the image layer, so hardlinks would fail.
ENV VIRTUAL_ENV=/jupiter/venv \
    UV_PROJECT_ENVIRONMENT=/jupiter/venv \
    UV_LINK_MODE=copy \
    UV_PYTHON_PREFERENCE=only-system \
    PATH="/jupiter/venv/bin:${PATH}"

FROM python-base AS workspace-meta

# Every workspace member pyproject, and no source. A new member has to be
# added here or `uv sync --frozen` will not see it.
COPY uv.lock uv.lock
COPY --parents \
    pyproject.toml \
    gen/py/webapi-client/pyproject.toml \
    src/alib/py/framework/pyproject.toml \
    src/webapi/gc-do-all/pyproject.toml \
    src/webapi/clear-abandoned-users-do-all/pyproject.toml \
    src/webapi/sync-google-user-data-do-all/pyproject.toml \
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

FROM workspace-meta AS webapi-deps

RUN --mount=type=cache,id=uv,target=/root/.cache/uv,sharing=locked \
    uv sync --frozen --no-dev --no-install-workspace --package jupiter-webapi-srv

FROM webapi-deps AS webapi-installed

COPY src/alib/py/framework/README.md src/alib/py/framework/README.md
COPY src/alib/py/framework/jupiter src/alib/py/framework/jupiter
COPY src/core/README.md src/core/README.md
COPY src/core/jupiter src/core/jupiter
COPY src/core/migrations src/core/migrations

RUN --mount=type=cache,id=uv,target=/root/.cache/uv,sharing=locked \
    uv sync --frozen --no-dev --no-editable --package jupiter-webapi-srv

COPY LICENSE LICENSE
COPY src/Config.global src/Config.global

FROM webapi-installed AS webapi-srv

COPY src/webapi/srv/README.md src/webapi/srv/README.md
COPY src/webapi/srv/Config.project src/webapi/srv/Config.project
COPY src/webapi/srv/jupiter src/webapi/srv/jupiter

ARG PORT=10000
ENV HOST=0.0.0.0
ENV PORT=$PORT
EXPOSE $PORT

WORKDIR /jupiter/src/webapi/srv

ENTRYPOINT ["dumb-init", "python", "-m", "jupiter.webapi.jupiter"]

FROM webapi-installed AS webapi-gc-do-all

RUN --mount=type=cache,id=uv,target=/root/.cache/uv,sharing=locked \
    uv sync --frozen --no-dev --no-editable --package jupiter-webapi-gc-do-all

COPY src/webapi/gc-do-all/README.md src/webapi/gc-do-all/README.md
COPY src/webapi/gc-do-all/Config.project src/webapi/gc-do-all/Config.project
COPY src/webapi/gc-do-all/jupiter_webapi_gc_do_all src/webapi/gc-do-all/jupiter_webapi_gc_do_all

WORKDIR /jupiter/src/webapi/gc-do-all

ENTRYPOINT ["dumb-init", "python", "-m", "jupiter_webapi_gc_do_all.jupiter"]

FROM webapi-installed AS webapi-clear-abandoned-users-do-all

RUN --mount=type=cache,id=uv,target=/root/.cache/uv,sharing=locked \
    uv sync --frozen --no-dev --no-editable --package jupiter-webapi-clear-abandoned-users-do-all

COPY src/webapi/clear-abandoned-users-do-all/README.md src/webapi/clear-abandoned-users-do-all/README.md
COPY src/webapi/clear-abandoned-users-do-all/Config.project src/webapi/clear-abandoned-users-do-all/Config.project
COPY src/webapi/clear-abandoned-users-do-all/jupiter_webapi_clear_abandoned_users_do_all src/webapi/clear-abandoned-users-do-all/jupiter_webapi_clear_abandoned_users_do_all

WORKDIR /jupiter/src/webapi/clear-abandoned-users-do-all

ENTRYPOINT ["dumb-init", "python", "-m", "jupiter_webapi_clear_abandoned_users_do_all.jupiter"]

FROM webapi-installed AS webapi-sync-google-user-data-do-all

RUN --mount=type=cache,id=uv,target=/root/.cache/uv,sharing=locked \
    uv sync --frozen --no-dev --no-editable --package jupiter-webapi-sync-google-user-data-do-all

COPY src/webapi/sync-google-user-data-do-all/README.md src/webapi/sync-google-user-data-do-all/README.md
COPY src/webapi/sync-google-user-data-do-all/Config.project src/webapi/sync-google-user-data-do-all/Config.project
COPY src/webapi/sync-google-user-data-do-all/jupiter_webapi_sync_google_user_data_do_all src/webapi/sync-google-user-data-do-all/jupiter_webapi_sync_google_user_data_do_all

WORKDIR /jupiter/src/webapi/sync-google-user-data-do-all

ENTRYPOINT ["dumb-init", "python", "-m", "jupiter_webapi_sync_google_user_data_do_all.jupiter"]

FROM webapi-installed AS webapi-gen-do-all

RUN --mount=type=cache,id=uv,target=/root/.cache/uv,sharing=locked \
    uv sync --frozen --no-dev --no-editable --package jupiter-webapi-gen-do-all

COPY src/webapi/gen-do-all/README.md src/webapi/gen-do-all/README.md
COPY src/webapi/gen-do-all/Config.project src/webapi/gen-do-all/Config.project
COPY src/webapi/gen-do-all/jupiter_webapi_gen_do_all src/webapi/gen-do-all/jupiter_webapi_gen_do_all

WORKDIR /jupiter/src/webapi/gen-do-all

ENTRYPOINT ["dumb-init", "python", "-m", "jupiter_webapi_gen_do_all.jupiter"]

FROM webapi-installed AS webapi-schedule-external-sync-do-all

RUN --mount=type=cache,id=uv,target=/root/.cache/uv,sharing=locked \
    uv sync --frozen --no-dev --no-editable --package jupiter-webapi-schedule-external-sync-do-all

COPY src/webapi/schedule-external-sync-do-all/README.md src/webapi/schedule-external-sync-do-all/README.md
COPY src/webapi/schedule-external-sync-do-all/Config.project src/webapi/schedule-external-sync-do-all/Config.project
COPY src/webapi/schedule-external-sync-do-all/jupiter_webapi_schedule_external_sync_do_all src/webapi/schedule-external-sync-do-all/jupiter_webapi_schedule_external_sync_do_all

WORKDIR /jupiter/src/webapi/schedule-external-sync-do-all

ENTRYPOINT ["dumb-init", "python", "-m", "jupiter_webapi_schedule_external_sync_do_all.jupiter"]

FROM webapi-installed AS webapi-search-index-backfill-do-all

RUN --mount=type=cache,id=uv,target=/root/.cache/uv,sharing=locked \
    uv sync --frozen --no-dev --no-editable --package jupiter-webapi-search-index-backfill-do-all

COPY src/webapi/search-index-backfill-do-all/README.md src/webapi/search-index-backfill-do-all/README.md
COPY src/webapi/search-index-backfill-do-all/Config.project src/webapi/search-index-backfill-do-all/Config.project
COPY src/webapi/search-index-backfill-do-all/jupiter_webapi_search_index_backfill_do_all src/webapi/search-index-backfill-do-all/jupiter_webapi_search_index_backfill_do_all

WORKDIR /jupiter/src/webapi/search-index-backfill-do-all

ENTRYPOINT ["dumb-init", "python", "-m", "jupiter_webapi_search_index_backfill_do_all.jupiter"]

FROM webapi-installed AS webapi-crm-backfill-do-all

RUN --mount=type=cache,id=uv,target=/root/.cache/uv,sharing=locked \
    uv sync --frozen --no-dev --no-editable --package jupiter-webapi-crm-backfill-do-all

COPY src/webapi/crm-backfill-do-all/README.md src/webapi/crm-backfill-do-all/README.md
COPY src/webapi/crm-backfill-do-all/Config.project src/webapi/crm-backfill-do-all/Config.project
COPY src/webapi/crm-backfill-do-all/jupiter_webapi_crm_backfill_do_all src/webapi/crm-backfill-do-all/jupiter_webapi_crm_backfill_do_all

WORKDIR /jupiter/src/webapi/crm-backfill-do-all

ENTRYPOINT ["dumb-init", "python", "-m", "jupiter_webapi_crm_backfill_do_all.jupiter"]

FROM webapi-installed AS webapi-search-mutation-log-drain-do-all

RUN --mount=type=cache,id=uv,target=/root/.cache/uv,sharing=locked \
    uv sync --frozen --no-dev --no-editable --package jupiter-webapi-search-mutation-log-drain-do-all

COPY src/webapi/search-mutation-log-drain-do-all/README.md src/webapi/search-mutation-log-drain-do-all/README.md
COPY src/webapi/search-mutation-log-drain-do-all/Config.project src/webapi/search-mutation-log-drain-do-all/Config.project
COPY src/webapi/search-mutation-log-drain-do-all/jupiter_webapi_search_mutation_log_drain_do_all src/webapi/search-mutation-log-drain-do-all/jupiter_webapi_search_mutation_log_drain_do_all

WORKDIR /jupiter/src/webapi/search-mutation-log-drain-do-all

ENTRYPOINT ["dumb-init", "python", "-m", "jupiter_webapi_search_mutation_log_drain_do_all.jupiter"]

FROM webapi-installed AS webapi-search-mutation-requeue-do-all

RUN --mount=type=cache,id=uv,target=/root/.cache/uv,sharing=locked \
    uv sync --frozen --no-dev --no-editable --package jupiter-webapi-search-mutation-requeue-do-all

COPY src/webapi/search-mutation-requeue-do-all/README.md src/webapi/search-mutation-requeue-do-all/README.md
COPY src/webapi/search-mutation-requeue-do-all/Config.project src/webapi/search-mutation-requeue-do-all/Config.project
COPY src/webapi/search-mutation-requeue-do-all/jupiter_webapi_search_mutation_requeue_do_all src/webapi/search-mutation-requeue-do-all/jupiter_webapi_search_mutation_requeue_do_all

WORKDIR /jupiter/src/webapi/search-mutation-requeue-do-all

ENTRYPOINT ["dumb-init", "python", "-m", "jupiter_webapi_search_mutation_requeue_do_all.jupiter"]

FROM webapi-installed AS webapi-stats-do-all

RUN --mount=type=cache,id=uv,target=/root/.cache/uv,sharing=locked \
    uv sync --frozen --no-dev --no-editable --package jupiter-webapi-stats-do-all

COPY src/webapi/stats-do-all/README.md src/webapi/stats-do-all/README.md
COPY src/webapi/stats-do-all/Config.project src/webapi/stats-do-all/Config.project
COPY src/webapi/stats-do-all/jupiter_webapi_stats_do_all src/webapi/stats-do-all/jupiter_webapi_stats_do_all

WORKDIR /jupiter/src/webapi/stats-do-all

ENTRYPOINT ["dumb-init", "python", "-m", "jupiter_webapi_stats_do_all.jupiter"]

FROM webapi-installed AS api

COPY gen/py/webapi-client/README.md gen/py/webapi-client/README.md
COPY gen/py/webapi-client/jupiter_webapi_client gen/py/webapi-client/jupiter_webapi_client

RUN --mount=type=cache,id=uv,target=/root/.cache/uv,sharing=locked \
    uv sync --frozen --no-dev --no-editable --package jupiter-api

COPY src/api/README.md src/api/README.md
COPY src/api/Config.project src/api/Config.project
COPY src/api/jupiter src/api/jupiter

ARG PORT=10000
ENV HOST=0.0.0.0
ENV PORT=$PORT
EXPOSE $PORT

WORKDIR /jupiter/src/api

ENTRYPOINT ["dumb-init", "python", "-m", "jupiter.api.jupiter"]

FROM webapi-installed AS mcp

COPY gen/py/webapi-client/README.md gen/py/webapi-client/README.md
COPY gen/py/webapi-client/jupiter_webapi_client gen/py/webapi-client/jupiter_webapi_client

RUN --mount=type=cache,id=uv,target=/root/.cache/uv,sharing=locked \
    uv sync --frozen --no-dev --no-editable --package jupiter-mcp

COPY src/mcp/README.md src/mcp/README.md
COPY src/mcp/Config.project src/mcp/Config.project
COPY src/mcp/jupiter src/mcp/jupiter

ARG PORT=10000
ENV HOST=0.0.0.0
ENV PORT=$PORT
EXPOSE $PORT

WORKDIR /jupiter/src/mcp

ENTRYPOINT ["dumb-init", "python", "-m", "jupiter.mcp.jupiter"]

FROM webapi-installed AS cli

RUN apt-get update && \
    apt-get install -y --no-install-recommends libasound2-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN --mount=type=cache,id=uv,target=/root/.cache/uv,sharing=locked \
    uv sync --frozen --no-dev --no-editable --package jupiter-cli

COPY src/cli/README.md src/cli/README.md
COPY src/cli/Config.project src/cli/Config.project
COPY src/cli/jupiter src/cli/jupiter

WORKDIR /jupiter/src/cli

ENTRYPOINT ["python", "-m", "jupiter.cli.jupiter"]

FROM workspace-meta AS docs

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
