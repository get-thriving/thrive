#!/usr/bin/env bash

#MISE description="Build Docker images for webapi, webapi crons, webui, api, mcp, docs, and cli"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }
#USAGE flag "--platform <platform>" help="Target platform only (default: build amd64 and arm64)" {
#USAGE   choices "amd64" "arm64"
#USAGE }
#USAGE flag "--no-cache" help="Do not use the build cache (full rebuild)"
#USAGE flag "--pull" help="Pull newer base images (python, node, etc.) before building"

set -e -o pipefail

: "${usage_platform:=}"
: "${usage_no_cache:=}"
: "${usage_pull:=}"

docker_build_extra_args=()
if [[ "${usage_no_cache}" == "true" ]]; then
    docker_build_extra_args+=(--no-cache)
fi
if [[ "${usage_pull}" == "true" ]]; then
    docker_build_extra_args+=(--pull)
fi

source tasks/_common.sh

if [ -z "${VERSION:-}" ]; then
    log info "VERSION is not set after sourcing src/Config.global"
    exit 1
fi

if ! [[ "${VERSION}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    log info "VERSION in src/Config.global is not a valid X.Y.Z semver: ${VERSION}"
    exit 1
fi

platforms=(amd64 arm64)
if [ -n "${usage_platform}" ]; then
    platforms=("${usage_platform}")
fi

log info "Docker build VERSION=${VERSION} platforms=${platforms[*]} no-cache=${usage_no_cache:-false} pull=${usage_pull:-false}"

log info "Setting up Docker buildx builder"

if ! docker buildx inspect jupiter-builder >/dev/null 2>&1; then
    log info "Creating buildx builder 'jupiter-builder'"
    docker buildx create --name jupiter-builder --use
else
    log info "Using existing buildx builder 'jupiter-builder'"
    docker buildx use jupiter-builder
fi

docker buildx inspect --bootstrap

build_image() {
    local name=$1
    local dockerfile=$2
    local platform=$3

    log info "Building jupiter/${name} (linux/${platform}, VERSION=${VERSION})"

    docker buildx build \
        --platform "linux/${platform}" \
        --tag "jupiter/${name}:latest-${platform}" \
        --tag "jupiter/${name}:${VERSION}-${platform}" \
        --file "${dockerfile}" \
        --load \
        "${docker_build_extra_args[@]}" \
        .
}

image_specs=(
    "webapi-srv:src/webapi/srv/Dockerfile"
    "api:src/api/Dockerfile"
    "mcp:src/mcp/Dockerfile"
    "webui:src/webui/Dockerfile"
    "docs:src/docs/Dockerfile"
    "cli:src/cli/Dockerfile"
)

for folder in "${WEBAPI_CRON_FOLDERS[@]}"; do
    image_specs+=("$(jupiter_webapi_cron_image_name "$folder"):src/webapi/${folder}/Dockerfile")
done

for platform in "${platforms[@]}"; do
    log info "Building all images for platform ${platform}"
    for spec in "${image_specs[@]}"; do
        name="${spec%%:*}"
        dockerfile="${spec#*:}"
        build_image "$name" "$dockerfile" "$platform"
    done
done

log info "Docker build complete for VERSION=${VERSION} platforms=${platforms[*]}"
