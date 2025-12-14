#!/usr/bin/env bash

#MISE description="Run web app with optional environ"
#USAGE flag "--environ <environ>" help="Jupiter environ"
#USAGE complete "environ" run="./tasks/run/environ/_list-fast.sh"
#USAGE flag "--universe <universe>" default="local-dev" help="Jupiter universe"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_environ:=}"
: "${usage_universe:=local-dev}"

set -e -o pipefail

source tasks/_common.sh

environ="${usage_environ}"

if [[ -z "$environ" ]]; then
    environ=$STANDARD_ENVIRON
fi

webui_port=$(get_jupiter_port "$environ" "webui")
export HOSTED_GLOBAL_WEBUI_URL="http://localhost:$webui_port"

log info "Running web in the browser app with environ $environ"

open "$HOSTED_GLOBAL_WEBUI_URL"
