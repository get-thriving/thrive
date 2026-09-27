#!/usr/bin/env bash

#MISE description="Build Docker images for webapi, webapi crons, webui, published, api, mcp, docs, and cli"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }
#USAGE flag "--arch <arch>" default="arm64" help="Image architecture. 'all' builds arm64 and amd64." {
#USAGE   choices "arm64" "amd64" "all"
#USAGE }
#USAGE flag "--no-cache" help="Do not use the build cache (full rebuild)"
#USAGE flag "--pull" help="Pull newer base images (python, node, etc.) before building"

set -e -o pipefail

: "${usage_arch:=arm64}"
: "${usage_no_cache:=}"
: "${usage_pull:=}"

source tasks/_common.sh

if [ -z "${VERSION:-}" ]; then
    log info "VERSION is not set after sourcing src/Config.global"
    exit 1
fi

if ! [[ "${VERSION}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    log info "VERSION in src/Config.global is not a valid X.Y.Z semver: ${VERSION}"
    exit 1
fi

case "${usage_arch}" in
    arm64 | amd64)
        archs=("${usage_arch}")
        ;;
    all)
        # Native arch first so a Mac still has usable images if the emulated
        # arch fails partway through.
        archs=(arm64 amd64)
        ;;
    *)
        log error "arch must be arm64, amd64, or all (got: ${usage_arch})"
        exit 1
        ;;
esac

log info "Docker build VERSION=${VERSION} arch=${usage_arch} platforms=${archs[*]} no-cache=${usage_no_cache:-false} pull=${usage_pull:-false}"

log info "Setting up Docker buildx builder"

if ! docker buildx inspect jupiter-builder >/dev/null 2>&1; then
    log info "Creating buildx builder 'jupiter-builder'"
    docker buildx create --name jupiter-builder --use
else
    log info "Using existing buildx builder 'jupiter-builder'"
    docker buildx use jupiter-builder
fi

docker buildx inspect --bootstrap

bake_args=(
    --builder jupiter-builder
    --file docker-bake.hcl
    --provenance=false
    --sbom=false
)

if [[ "${usage_no_cache}" == "true" ]]; then
    bake_args+=(--no-cache)
fi
if [[ "${usage_pull}" == "true" ]]; then
    bake_args+=(--pull)
fi

for arch in "${archs[@]}"; do
    log info "Building all images for linux/${arch}"
    VERSION="${VERSION}" ARCH="${arch}" docker buildx bake "${bake_args[@]}"
done

log info "Docker build complete for VERSION=${VERSION} arch=${usage_arch}"
