#!/usr/bin/env bash

#MISE description="Open the OpenAPI control page"
#USAGE flag "--instance <instance>" help="Jupiter instance"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--type <type>" default="redoc" help="Type of documentation to open" {
#USAGE   choices "redoc" "docs"
#USAGE }
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_instance:=}"
: "${usage_type:=}"

set -e -o pipefail

source tasks/_common.sh

instance="${usage_instance}"

if [[ -z "$instance" ]]; then
    instance=$STANDARD_INSTANCE
fi

log info "Opening OpenAPI control page for instance $instance"

# Check if webapi service is already running for this instance
if ! check_service_is_running pm2 "$instance" webapi; then
    log info "WebAPI service is not running for instance: $instance"
    log info "Please start the service first"
    exit 1
fi

webapi_url=$(get_jupiter_url "$instance" "webapi")

open "${webapi_url}/${usage_type}"
