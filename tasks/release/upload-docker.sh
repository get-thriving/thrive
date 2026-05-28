#!/usr/bin/env bash

#MISE description="Upload Docker images to Docker Hub"
#USAGE arg "<version>" required help="Release version (X.Y.Z format)"
#USAGE complete "version" run="./tasks/release/list.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

: "${usage_version:=}"

if ! [[ "${usage_version}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    log info "Not a valid X.Y.Z version string"
    exit 1
fi

if [ "${VERSION}" != "${usage_version}" ]; then
    log info "src/Config.global has VERSION=${VERSION} but release version is ${usage_version}"
    log info "Bump VERSION in src/Config.global (release:prepare does this) before upload-docker"
    exit 1
fi

require_local_image() {
    local name=$1
    local platform=$2
    local tag=$3
    local ref="jupiter/${name}:${tag}-${platform}"

    if ! docker image inspect "${ref}" >/dev/null 2>&1; then
        log info "Missing local image ${ref}"
        log info "Run: mise run build:docker   (builds amd64 and arm64 for VERSION in src/Config.global)"
        exit 1
    fi
}

log info "Publishing Docker images VERSION=${VERSION} to ${DOCKER_REGISTRY_NAME}"

tag_for_registry() {
    local name=$1
    local platform

    for platform in amd64 arm64; do
        require_local_image "$name" "$platform" "latest"
        require_local_image "$name" "$platform" "${VERSION}"

        docker tag "jupiter/${name}:latest-${platform}" \
            "${DOCKER_REGISTRY_NAME}/${name}:latest-${platform}"
        docker tag "jupiter/${name}:${VERSION}-${platform}" \
            "${DOCKER_REGISTRY_NAME}/${name}:${VERSION}-${platform}"
    done
}

push_to_registry() {
    local name=$1
    local platform

    for platform in amd64 arm64; do
        docker image push "${DOCKER_REGISTRY_NAME}/${name}:latest-${platform}"
        docker image push "${DOCKER_REGISTRY_NAME}/${name}:${VERSION}-${platform}"
    done
}

create_manifest() {
    local name=$1
    local tag=$2

    docker manifest create --amend "${DOCKER_REGISTRY_NAME}/${name}:${tag}" \
        "${DOCKER_REGISTRY_NAME}/${name}:${tag}-amd64" \
        "${DOCKER_REGISTRY_NAME}/${name}:${tag}-arm64"

    docker manifest push "${DOCKER_REGISTRY_NAME}/${name}:${tag}"
}

publish_image() {
    local name=$1

    log info "Publishing ${name} to ${DOCKER_REGISTRY_NAME}"
    tag_for_registry "$name"
    push_to_registry "$name"
    create_manifest "$name" "latest"
    create_manifest "$name" "${VERSION}"
}

for name in webapi-srv api mcp webui docs cli; do
    publish_image "$name"
done

for folder in "${JUPITER_WEBAPI_CRON_FOLDERS[@]}"; do
    publish_image "$(jupiter_webapi_cron_image_name "$folder")"
done

log info "Docker images VERSION=${VERSION} uploaded to ${DOCKER_REGISTRY_NAME}"
