#!/usr/bin/env bash
# Wrapper so markdownlint-cli2 always uses tasks/_resources/check/lint/markdownlint-cli2.jsonc.
set -e -o pipefail

lint_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
exec npx markdownlint-cli2 --config "${lint_dir}/.markdownlint-cli2.jsonc" "$@"
