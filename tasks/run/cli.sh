#!/usr/bin/env bash

#MISE description="Run Jupiter as a CLI with "
#USAGE flag "--namespace [namespace]" help="Jupiter namespace (defaults to standard namespace)"
#USAGE complete "namespace" run="./tasks/run/namespace/_list-fast.sh"
#USAGE arg "[jupiterArgs]" var=#true help="Args for Jupiter CLI"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_namespace:=}"
: "${usage_jupiter_args:=}"

set -e -o pipefail

source tasks/_common.sh

namespace="${usage_namespace}"

if [[ -z "${namespace}" ]]; then
    namespace=$STANDARD_NAMESPACE
fi

run_jupiter_cli "$namespace" "${usage_jupiter_args[*]}"
