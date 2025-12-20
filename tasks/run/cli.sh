#!/usr/bin/env bash

#MISE description="Run Jupiter as a CLI with "
#USAGE flag "--environ [environ]" help="Jupiter environ (defaults to standard environ)"
#USAGE complete "environ" run="./tasks/run/environ/_list-fast.sh"
#USAGE arg "[jupiterArgs]" var=#true help="Args for Jupiter CLI"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_environ:=}"
: "${usage_jupiter_args:=}"

set -e -o pipefail

source tasks/_common.sh

environ="${usage_environ}"

if [[ -z "${environ}" ]]; then
    environ=$STANDARD_ENVIRON
fi

run_jupiter_cli "$environ" "$usage_jupiter_args"
