#!/usr/bin/env bash

#MISE description="Clear a Jupiter database - dangerous!"
#USAGE flag "--instance <instance>" help="Jupiter instance (defaults to standard instance)"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_instance:=}"

set -e -o pipefail

source tasks/_common.sh

instance="${usage_instance}"

if [[ -z "$instance" ]]; then
    instance=$STANDARD_INSTANCE
fi

db_path="$RUN_ROOT/$instance/jupiter.sqlite"

log info "Clearing database for ${instance} in ${db_path}"

rm "${db_path}"
