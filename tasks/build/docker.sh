#!/usr/bin/env bash

#MISE description="Build Docker images for webapi, webapi crons, webui, api, mcp, docs, and cli"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }
#USAGE flag "--platform <platform>" default="amd64" help="Target platform" {
#USAGE   choices "amd64" "arm64"
#USAGE }

set -e -o pipefail

: "${usage_platform:=}"

source tasks/_common.sh

log info "Setting up Docker buildx builder"

# Create a buildx builder if it doesn't exist
if ! docker buildx inspect jupiter-builder >/dev/null 2>&1; then
    log info "Creating buildx builder 'jupiter-builder'"
    docker buildx create --name jupiter-builder --use
else
    log info "Using existing buildx builder 'jupiter-builder'"
    docker buildx use jupiter-builder
fi

# Bootstrap the builder
docker buildx inspect --bootstrap

log info "Building Docker images for webapi (platform: ${usage_platform})"

docker buildx build \
    --platform "linux/${usage_platform}" \
    --tag "jupiter/webapi:latest-${usage_platform}" \
    --tag "jupiter/webapi:${VERSION}-${usage_platform}" \
    --file src/webapi/srv/Dockerfile \
    --load \
    .

log info "Building Docker images for webapi gc-do-all (platform: ${usage_platform})"

docker buildx build \
    --platform "linux/${usage_platform}" \
    --tag "jupiter/webapi-gc-do-all:latest-${usage_platform}" \
    --tag "jupiter/webapi-gc-do-all:${VERSION}-${usage_platform}" \
    --file src/webapi/gc-do-all/Dockerfile \
    --load \
    .

log info "Building Docker images for webapi gen-do-all (platform: ${usage_platform})"

docker buildx build \
    --platform "linux/${usage_platform}" \
    --tag "jupiter/webapi-gen-do-all:latest-${usage_platform}" \
    --tag "jupiter/webapi-gen-do-all:${VERSION}-${usage_platform}" \
    --file src/webapi/gen-do-all/Dockerfile \
    --load \
    .

log info "Building Docker images for webapi schedule-external-sync-do-all (platform: ${usage_platform})"

docker buildx build \
    --platform "linux/${usage_platform}" \
    --tag "jupiter/webapi-schedule-external-sync-do-all:latest-${usage_platform}" \
    --tag "jupiter/webapi-schedule-external-sync-do-all:${VERSION}-${usage_platform}" \
    --file src/webapi/schedule-external-sync-do-all/Dockerfile \
    --load \
    .

log info "Building Docker images for webapi search-index-backfill-do-all (platform: ${usage_platform})"

docker buildx build \
    --platform "linux/${usage_platform}" \
    --tag "jupiter/webapi-search-index-backfill-do-all:latest-${usage_platform}" \
    --tag "jupiter/webapi-search-index-backfill-do-all:${VERSION}-${usage_platform}" \
    --file src/webapi/search-index-backfill-do-all/Dockerfile \
    --load \
    .

log info "Building Docker images for webapi search-mutation-log-drain-do-all (platform: ${usage_platform})"

docker buildx build \
    --platform "linux/${usage_platform}" \
    --tag "jupiter/webapi-search-mutation-log-drain-do-all:latest-${usage_platform}" \
    --tag "jupiter/webapi-search-mutation-log-drain-do-all:${VERSION}-${usage_platform}" \
    --file src/webapi/search-mutation-log-drain-do-all/Dockerfile \
    --load \
    .

log info "Building Docker images for webapi search-mutation-log-processing-requeue-do-all (platform: ${usage_platform})"

docker buildx build \
    --platform "linux/${usage_platform}" \
    --tag "jupiter/webapi-search-mutation-log-processing-requeue-do-all:latest-${usage_platform}" \
    --tag "jupiter/webapi-search-mutation-log-processing-requeue-do-all:${VERSION}-${usage_platform}" \
    --file src/webapi/search-mutation-log-processing-requeue-do-all/Dockerfile \
    --load \
    .

log info "Building Docker images for webapi stats-do-all (platform: ${usage_platform})"

docker buildx build \
    --platform "linux/${usage_platform}" \
    --tag "jupiter/webapi-stats-do-all:latest-${usage_platform}" \
    --tag "jupiter/webapi-stats-do-all:${VERSION}-${usage_platform}" \
    --file src/webapi/stats-do-all/Dockerfile \
    --load \
    .

log info "Building Docker images for api (platform: ${usage_platform})"

docker buildx build \
    --platform "linux/${usage_platform}" \
    --tag "jupiter/api:latest-${usage_platform}" \
    --tag "jupiter/api:${VERSION}-${usage_platform}" \
    --file src/api/Dockerfile \
    --load \
    .

log info "Building Docker images for mcp (platform: ${usage_platform})"

docker buildx build \
    --platform "linux/${usage_platform}" \
    --tag "jupiter/mcp:latest-${usage_platform}" \
    --tag "jupiter/mcp:${VERSION}-${usage_platform}" \
    --file src/mcp/Dockerfile \
    --load \
    .

log info "Building Docker images for webui (platform: ${usage_platform})"

docker buildx build \
    --platform "linux/${usage_platform}" \
    --tag "jupiter/webui:latest-${usage_platform}" \
    --tag "jupiter/webui:${VERSION}-${usage_platform}" \
    --file src/webui/Dockerfile \
    --load \
    .

log info "Building Docker images for docs (platform: ${usage_platform})"

docker buildx build \
    --platform "linux/${usage_platform}" \
    --tag "jupiter/docs:latest-${usage_platform}" \
    --tag "jupiter/docs:${VERSION}-${usage_platform}" \
    --file src/docs/Dockerfile \
    --load \
    .

log info "Building Docker images for cli (platform: ${usage_platform})"

docker buildx build \
    --platform "linux/${usage_platform}" \
    --tag "jupiter/cli:latest-${usage_platform}" \
    --tag "jupiter/cli:${VERSION}-${usage_platform}" \
    --file src/cli/Dockerfile \
    --load \
    .
