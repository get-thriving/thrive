#!/usr/bin/env bash

#MISE description="Build documentation using mkdocs"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

mkdir -p secrets
touch secrets/Config.secrets # In build this doesn't exist
source tasks/_common.sh

mkdir -p .build-cache/docs

source src/Config.global

export PUBLIC_NAME
export AUTHOR
export COPYRIGHT
export SITE_URL="${RENDER_EXTERNAL_URL:-https://docs.get-thriving.com}"

log info "Building documentation"

(cd src/docs && uv sync --active)

mkdocs build --config-file src/docs/mkdocs.yml --site-dir ../../.build-cache/docs --clean

log info "Documentation built in .build-cache/docs"