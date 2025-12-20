#!/usr/bin/env bash

#MISE description="Open the OpenAPI control page"
#USAGE flag "--environ <environ>" help="Jupiter environ"
#USAGE complete "environ" run="./tasks/run/environ/_list-fast.sh"
#USAGE flag "--type <type>" default="redoc" help="Type of documentation to open" {
#USAGE   choices "redoc" "docs"
#USAGE }
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_environ:=}"
: "${usage_type:=}"

set -e -o pipefail

source tasks/_common.sh

environ="${usage_environ}"

if [[ -z "$environ" ]]; then
    environ=$STANDARD_ENVIRON
fi

log info "Opening OpenAPI control page for environ $environ"

# Check if webapi service is already running for this environ
if ! check_service_is_running pm2 "$environ" webapi; then
    log info "WebAPI service is not running for environ: $environ"
    log info "Please start the service first"
    exit 1
fi

webapi_url=$(get_jupiter_url "$environ" "webapi")

open "${webapi_url}/${usage_type}"
