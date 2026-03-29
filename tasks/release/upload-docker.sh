#!/usr/bin/env bash

#MISE description="Upload Docker images to Docker Hub"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

source src/Config.global

log info "Taggin Docker images to Docker Hub"

# webapi
docker tag jupiter/webapi:latest-amd64   ${DOCKER_REGISTRY_NAME}/webapi:latest-amd64
docker tag jupiter/webapi:${VERSION}-amd64 ${DOCKER_REGISTRY_NAME}/webapi:${VERSION}-amd64
docker tag jupiter/webapi:latest-arm64   ${DOCKER_REGISTRY_NAME}/webapi:latest-arm64
docker tag jupiter/webapi:${VERSION}-arm64 ${DOCKER_REGISTRY_NAME}/webapi:${VERSION}-arm64

# api
docker tag jupiter/api:latest-amd64   ${DOCKER_REGISTRY_NAME}/api:latest-amd64
docker tag jupiter/api:${VERSION}-amd64 ${DOCKER_REGISTRY_NAME}/api:${VERSION}-amd64
docker tag jupiter/api:latest-arm64   ${DOCKER_REGISTRY_NAME}/api:latest-arm64
docker tag jupiter/api:${VERSION}-arm64 ${DOCKER_REGISTRY_NAME}/api:${VERSION}-arm64

# mcp
docker tag jupiter/mcp:latest-amd64     ${DOCKER_REGISTRY_NAME}/mcp:latest-amd64
docker tag jupiter/mcp:${VERSION}-amd64   ${DOCKER_REGISTRY_NAME}/mcp:${VERSION}-amd64
docker tag jupiter/mcp:latest-arm64     ${DOCKER_REGISTRY_NAME}/mcp:latest-arm64
docker tag jupiter/mcp:${VERSION}-arm64   ${DOCKER_REGISTRY_NAME}/mcp:${VERSION}-arm64

# webui
docker tag jupiter/webui:latest-amd64    ${DOCKER_REGISTRY_NAME}/webui:latest-amd64
docker tag jupiter/webui:${VERSION}-amd64  ${DOCKER_REGISTRY_NAME}/webui:${VERSION}-amd64
docker tag jupiter/webui:latest-arm64    ${DOCKER_REGISTRY_NAME}/webui:latest-arm64
docker tag jupiter/webui:${VERSION}-arm64  ${DOCKER_REGISTRY_NAME}/webui:${VERSION}-arm64

# docs
docker tag jupiter/docs:latest-amd64    ${DOCKER_REGISTRY_NAME}/docs:latest-amd64
docker tag jupiter/docs:${VERSION}-amd64  ${DOCKER_REGISTRY_NAME}/docs:${VERSION}-amd64
docker tag jupiter/docs:latest-arm64    ${DOCKER_REGISTRY_NAME}/docs:latest-arm64
docker tag jupiter/docs:${VERSION}-arm64  ${DOCKER_REGISTRY_NAME}/docs:${VERSION}-arm64

# cli
docker tag jupiter/cli:latest-amd64      ${DOCKER_REGISTRY_NAME}/cli:latest-amd64
docker tag jupiter/cli:${VERSION}-amd64    ${DOCKER_REGISTRY_NAME}/cli:${VERSION}-amd64
docker tag jupiter/cli:latest-arm64      ${DOCKER_REGISTRY_NAME}/cli:latest-arm64
docker tag jupiter/cli:${VERSION}-arm64    ${DOCKER_REGISTRY_NAME}/cli:${VERSION}-arm64

log info "Uploading Docker images to Docker Hub"

docker image push ${DOCKER_REGISTRY_NAME}/webapi:latest-amd64
docker image push ${DOCKER_REGISTRY_NAME}/webapi:${VERSION}-amd64
docker image push ${DOCKER_REGISTRY_NAME}/webapi:latest-arm64
docker image push ${DOCKER_REGISTRY_NAME}/webapi:${VERSION}-arm64
docker image push ${DOCKER_REGISTRY_NAME}/api:latest-amd64
docker image push ${DOCKER_REGISTRY_NAME}/api:${VERSION}-amd64
docker image push ${DOCKER_REGISTRY_NAME}/api:latest-arm64
docker image push ${DOCKER_REGISTRY_NAME}/api:${VERSION}-arm64
docker image push ${DOCKER_REGISTRY_NAME}/mcp:latest-amd64
docker image push ${DOCKER_REGISTRY_NAME}/mcp:${VERSION}-amd64
docker image push ${DOCKER_REGISTRY_NAME}/mcp:latest-arm64
docker image push ${DOCKER_REGISTRY_NAME}/mcp:${VERSION}-arm64
docker image push ${DOCKER_REGISTRY_NAME}/webui:latest-amd64
docker image push ${DOCKER_REGISTRY_NAME}/webui:${VERSION}-amd64
docker image push ${DOCKER_REGISTRY_NAME}/webui:latest-arm64
docker image push ${DOCKER_REGISTRY_NAME}/webui:${VERSION}-arm64
docker image push ${DOCKER_REGISTRY_NAME}/docs:latest-amd64
docker image push ${DOCKER_REGISTRY_NAME}/docs:${VERSION}-amd64
docker image push ${DOCKER_REGISTRY_NAME}/docs:latest-arm64
docker image push ${DOCKER_REGISTRY_NAME}/docs:${VERSION}-arm64
docker image push ${DOCKER_REGISTRY_NAME}/cli:latest-amd64
docker image push ${DOCKER_REGISTRY_NAME}/cli:${VERSION}-amd64
docker image push ${DOCKER_REGISTRY_NAME}/cli:latest-arm64
docker image push ${DOCKER_REGISTRY_NAME}/cli:${VERSION}-arm64

log info "Creating and pushing multi-arch manifests"

create_manifest() {
  local name="$1"  # e.g. webapi
  local tag="$2"   # e.g. latest or ${VERSION}

  docker manifest create --amend "${DOCKER_REGISTRY_NAME}/${name}:${tag}" \
    "${DOCKER_REGISTRY_NAME}/${name}:${tag}-amd64" \
    "${DOCKER_REGISTRY_NAME}/${name}:${tag}-arm64"

  docker manifest push "${DOCKER_REGISTRY_NAME}/${name}:${tag}"
}

# latest manifests
create_manifest "webapi" "latest"
create_manifest "api" "latest"
create_manifest "mcp" "latest"
create_manifest "webui" "latest"
create_manifest "docs" "latest"
create_manifest "cli" "latest"

# versioned manifests
create_manifest "webapi" "${VERSION}"
create_manifest "api" "${VERSION}"
create_manifest "mcp" "${VERSION}"
create_manifest "webui" "${VERSION}"
create_manifest "docs" "${VERSION}"
create_manifest "cli" "${VERSION}"

log info "Docker images uploaded to Docker Hub"