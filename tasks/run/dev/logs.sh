#!/usr/bin/env bash

#MISE description="View PM2 logs for a service (e.g. webapi:srv, webui, api)"
#USAGE flag "--instance <instance>" help="Jupiter instance"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE arg "<service>" required help="PM2 process suffix after instance: (e.g. webapi:srv, webui, api)"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_instance:=}"
: "${usage_service:=}"

set -e -o pipefail

source tasks/_common.sh

instance="${usage_instance}"

if [[ -z "$instance" ]]; then
    instance=$STANDARD_INSTANCE
fi

log info "Viewing logs for instance $instance"

# Check if the requested PM2 service is already running for this instance
if ! check_service_is_running pm2 "$instance" "$usage_service"; then
    log info "$usage_service service is not running for instance: $instance"
    log info "Please start the service first"
    exit 1
fi

npx pm2 logs "$instance:$usage_service" --lines 1000
