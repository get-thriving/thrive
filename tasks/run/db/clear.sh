#!/usr/bin/env bash

#MISE description="Clear a Jupiter database - dangerous!"
#USAGE flag "--environ <environ>" help="Jupiter environ (defaults to standard environ)"
#USAGE complete "environ" run="./tasks/run/environ/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_environ:=}"

set -e -o pipefail

source tasks/_common.sh

environ="${usage_environ}"

if [[ -z "$environ" ]]; then
    environ=$STANDARD_ENVIRON
fi

db_path="$RUN_ROOT/$environ/jupiter.sqlite"

log info "Clearing database for ${environ} in ${db_path}"

rm "${db_path}"
