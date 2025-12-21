#!/usr/bin/env bash

#MISE description="View the logs for the webapi and webui services"
#USAGE flag "--environ <environ>" help="Jupiter environ"
#USAGE complete "environ" run="./tasks/run/environ/_list-fast.sh"
#USAGE arg "<service>" required help="The service to view logs for"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_environ:=}"
: "${usage_service:=}"

set -e -o pipefail

source tasks/_common.sh

environ="${usage_environ}"

if [[ -z "$environ" ]]; then
    environ=$STANDARD_ENVIRON
fi

log info "Viewing logs for environ $environ"

# Check if webapi service is already running for this environ
if ! check_service_is_running pm2 "$environ" "$usage_service"; then
    log info "WebAPI service is not running for environ: $environ"
    log info "Please start the service first"
    exit 1
fi

npx pm2 logs "$environ:$usage_service" --lines 1000
