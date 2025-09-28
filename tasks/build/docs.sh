#!/usr/bin/env bash

set -e -o pipefail

#MISE description="Build documentation using mkdocs"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

mkdir -p .build-cache/docs

source src/Config.global

export PUBLIC_NAME
export AUTHOR
export COPYRIGHT

(cd src/docs && poetry install --only main --no-interaction --no-ansi --no-root)

mkdocs build --config-file src/docs/mkdocs.yml --site-dir ../../.build-cache/docs --clean
