#!/usr/bin/env bash

set -e -o pipefail

#MISE description="Run all lint tasks"
#MISE depends=["package:**:mypy", "package:**:ruff", "package:**:tsc", "package:**:eslint", "package:**:prettier"]
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }
