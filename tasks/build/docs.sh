#!/usr/bin/env bash

#MISE description="Build documentation using mkdocs"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

mkdir -p .build-cache/docs

source src/Config.global

export PUBLIC_NAME
export AUTHOR
export COPYRIGHT

log info "Building documentation"

(cd src/docs && poetry install --only main --no-interaction --no-ansi --no-root)

mkdocs build --config-file src/docs/mkdocs.yml --site-dir ../../.build-cache/docs --clean

log info "Documentation built in .build-cache/docs"