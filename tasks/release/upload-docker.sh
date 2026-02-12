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
docker tag jupiter/webapi:latest-amd64   ${DOCKER_REGISTRY_NAME}/jupiter-webapi:latest-amd64
docker tag jupiter/webapi:${VERSION}-amd64 ${DOCKER_REGISTRY_NAME}/jupiter-webapi:${VERSION}-amd64
docker tag jupiter/webapi:latest-arm64   ${DOCKER_REGISTRY_NAME}/jupiter-webapi:latest-arm64
docker tag jupiter/webapi:${VERSION}-arm64 ${DOCKER_REGISTRY_NAME}/jupiter-webapi:${VERSION}-arm64

# api
docker tag jupiter/api:latest-amd64   ${DOCKER_REGISTRY_NAME}/jupiter-api:latest-amd64
docker tag jupiter/api:${VERSION}-amd64 ${DOCKER_REGISTRY_NAME}/jupiter-api:${VERSION}-amd64
docker tag jupiter/api:latest-arm64   ${DOCKER_REGISTRY_NAME}/jupiter-api:latest-arm64
docker tag jupiter/api:${VERSION}-arm64 ${DOCKER_REGISTRY_NAME}/jupiter-api:${VERSION}-arm64

# webui
docker tag jupiter/webui:latest-amd64    ${DOCKER_REGISTRY_NAME}/jupiter-webui:latest-amd64
docker tag jupiter/webui:${VERSION}-amd64  ${DOCKER_REGISTRY_NAME}/jupiter-webui:${VERSION}-amd64
docker tag jupiter/webui:latest-arm64    ${DOCKER_REGISTRY_NAME}/jupiter-webui:latest-arm64
docker tag jupiter/webui:${VERSION}-arm64  ${DOCKER_REGISTRY_NAME}/jupiter-webui:${VERSION}-arm64

# docs
docker tag jupiter/docs:latest-amd64    ${DOCKER_REGISTRY_NAME}/jupiter-docs:latest-amd64
docker tag jupiter/docs:${VERSION}-amd64  ${DOCKER_REGISTRY_NAME}/jupiter-docs:${VERSION}-amd64
docker tag jupiter/docs:latest-arm64    ${DOCKER_REGISTRY_NAME}/jupiter-docs:latest-arm64
docker tag jupiter/docs:${VERSION}-arm64  ${DOCKER_REGISTRY_NAME}/jupiter-docs:${VERSION}-arm64

# cli
docker tag jupiter/cli:latest-amd64      ${DOCKER_REGISTRY_NAME}/jupiter-cli:latest-amd64
docker tag jupiter/cli:${VERSION}-amd64    ${DOCKER_REGISTRY_NAME}/jupiter-cli:${VERSION}-amd64
docker tag jupiter/cli:latest-arm64      ${DOCKER_REGISTRY_NAME}/jupiter-cli:latest-arm64
docker tag jupiter/cli:${VERSION}-arm64    ${DOCKER_REGISTRY_NAME}/jupiter-cli:${VERSION}-arm64

log info "Uploading Docker images to Docker Hub"

docker image push ${DOCKER_REGISTRY_NAME}/jupiter-webapi:latest-amd64
docker image push ${DOCKER_REGISTRY_NAME}/jupiter-webapi:${VERSION}-amd64
docker image push ${DOCKER_REGISTRY_NAME}/jupiter-webapi:latest-arm64
docker image push ${DOCKER_REGISTRY_NAME}/jupiter-webapi:${VERSION}-arm64
docker image push ${DOCKER_REGISTRY_NAME}/jupiter-webui:latest-amd64
docker image push ${DOCKER_REGISTRY_NAME}/jupiter-webui:${VERSION}-amd64
docker image push ${DOCKER_REGISTRY_NAME}/jupiter-webui:latest-arm64
docker image push ${DOCKER_REGISTRY_NAME}/jupiter-webui:${VERSION}-arm64
docker image push ${DOCKER_REGISTRY_NAME}/jupiter-docs:latest-amd64
docker image push ${DOCKER_REGISTRY_NAME}/jupiter-docs:${VERSION}-amd64
docker image push ${DOCKER_REGISTRY_NAME}/jupiter-docs:latest-arm64
docker image push ${DOCKER_REGISTRY_NAME}/jupiter-docs:${VERSION}-arm64
docker image push ${DOCKER_REGISTRY_NAME}/jupiter-cli:latest-amd64
docker image push ${DOCKER_REGISTRY_NAME}/jupiter-cli:${VERSION}-amd64
docker image push ${DOCKER_REGISTRY_NAME}/jupiter-cli:latest-arm64
docker image push ${DOCKER_REGISTRY_NAME}/jupiter-cli:${VERSION}-arm64

log info "Creating and pushing multi-arch manifests"

create_manifest() {
  local name="$1"  # e.g. jupiter-webapi
  local tag="$2"   # e.g. latest or ${VERSION}

  docker manifest create --amend "${DOCKER_REGISTRY_NAME}/${name}:${tag}" \
    "${DOCKER_REGISTRY_NAME}/${name}:${tag}-amd64" \
    "${DOCKER_REGISTRY_NAME}/${name}:${tag}-arm64"

  docker manifest push "${DOCKER_REGISTRY_NAME}/${name}:${tag}"
}

# latest manifests
create_manifest "jupiter-webapi" "latest"
create_manifest "jupiter-webui" "latest"
create_manifest "jupiter-docs" "latest"
create_manifest "jupiter-cli" "latest"

# versioned manifests
create_manifest "jupiter-webapi" "${VERSION}"
create_manifest "jupiter-webui" "${VERSION}"
create_manifest "jupiter-docs" "${VERSION}"
create_manifest "jupiter-cli" "${VERSION}"

log info "Docker images uploaded to Docker Hub"