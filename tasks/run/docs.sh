#!/usr/bin/env bash

#MISE description="Run documentation server"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

source src/Config.global

export PUBLIC_NAME
export AUTHOR
export COPYRIGHT

cd src/docs && mkdocs serve
