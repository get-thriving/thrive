#!/usr/bin/env bash

set -e -o pipefail

#MISE description="Run documentation server"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

source src/Config.global

export PUBLIC_NAME
export AUTHOR
export COPYRIGHT

cd src/docs && mkdocs serve
