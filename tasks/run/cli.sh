#!/usr/bin/env bash

#MISE description="Run Jupiter as a CLI with "
#USAGE flag "--instance [instance]" help="Jupiter instance (defaults to standard instance)"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE arg "[jupiterArgs]" var=#true help="Args for Jupiter CLI"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_instance:=}"
: "${usage_jupiter_args:=}"

set -e -o pipefail

source tasks/_common.sh

instance="${usage_instance}"

if [[ -z "${instance}" ]]; then
    instance=$STANDARD_INSTANCE
fi

run_jupiter_cli "$instance" "$usage_jupiter_args"
