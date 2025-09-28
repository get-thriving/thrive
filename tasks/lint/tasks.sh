#!/usr/bin/env bash

#MISE description="Lint the tasks"
#MISE sources=["tasks/**/*.sh"]
#MISE outputs = { auto = true }
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

tree -fi tasks | grep '\.sh$' | xargs shellcheck --external-sources --shell=bash

