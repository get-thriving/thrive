#!/usr/bin/env bash

#MISE description="Generate code statistics using cloc"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

source src/Config.global

mkdir -p .build-cache/cloc/$VERSION

cloc_file=.build-cache/cloc/$VERSION/cloc.txt

cloc \
  --report-file="${cloc_file}" \
  --exclude-dir="node_modules,.build-cache,build,public,.mypy_cache,ios,android" \
  --not-match-f="(pnpm-lock.json|uv.lock|.hcl)" \
  docs/ \
  infra/ \
  itests/ \
  src/ \
  tasks/ \

cat "${cloc_file}"
