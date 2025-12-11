#!/usr/bin/env bash

#MISE description="Run desktop app with optional environ"
#USAGE flag "--environ <environ>" help="Jupiter environ"
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

webui_port=$(get_jupiter_port "$environ" "webui")
export HOSTED_GLOBAL_WEBUI_URL="http://localhost:$webui_port"

log info "Running desktop app with environ $environ"

cd src/desktop
npx vite build
npx electron-forge start
