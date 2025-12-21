#!/usr/bin/env bash

#MISE description="Run all lint tasks"
#MISE depends=["package:**:mypy", "package:**:ruff", "package:**:tsc", "package:**:eslint", "package:**:prettier"]
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh
