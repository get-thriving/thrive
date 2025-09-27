#!/usr/bin/env bash

set -ex

#MISE description="Generate code statistics using cloc"

source src/Config.global

mkdir -p .build-cache/cloc/$VERSION

cloc_file=.build-cache/cloc/$VERSION/cloc.txt

cloc \
  --report-file="${cloc_file}" \
  --exclude-dir="node_modules,.build-cache,build,public,.mypy_cache,ios,android" \
  --not-match-f="(package-lock.json|poetry.lock)" \
  .dockerignore \
  .eslintignore \
  .prettierignore \
  .gitignore \
  .github/ \
  LICENSE \
  Makefile \
  README.md \
  docs/ \
  scripts/ \
  src/ \
  itests/ \

cat "${cloc_file}"
