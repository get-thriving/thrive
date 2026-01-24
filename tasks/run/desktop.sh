#!/usr/bin/env bash

#MISE description="Run desktop app with optional instance"
#USAGE flag "--instance <instance>" help="Jupiter instance"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--universe <universe>" default="local-dev" help="Jupiter universe"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_instance:=}"
: "${usage_universe:=local-dev}"

set -e -o pipefail

source tasks/_common.sh

instance="${usage_instance}"

if [[ -z "$instance" ]]; then
    instance=$STANDARD_INSTANCE
fi

webui_url=$(get_jupiter_url "$instance" "webui")
export HOSTED_GLOBAL_WEBUI_URL="$webui_url"

log info "Running desktop app with instance $instance"

cd src/desktop
npx vite build
npx electron-forge start
