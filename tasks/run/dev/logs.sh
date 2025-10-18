#!/usr/bin/env bash

#MISE description="View the logs for the webapi and webui services"
#USAGE flag "--namespace <namespace>" help="Jupiter namespace"
#USAGE complete "namespace" run="./tasks/run/namespace/_list-fast.sh"
#USAGE flag "--service <service>" default="webapi" help="Type of service to view logs for" {
#USAGE   choices "webapi" "webui"
#USAGE }
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_namespace:=}"
: "${usage_service:=}"

set -e -o pipefail

source tasks/_common.sh

namespace="${usage_namespace}"

if [[ -z "$namespace" ]]; then
    namespace=$STANDARD_NAMESPACE
fi

log info "Viewing logs for namespace $namespace"

# Check if webapi service is already running for this namespace
if ! check_service_is_running pm2 "$namespace" "$usage_service"; then
    log info "WebAPI service is not running for namespace: $namespace"
    log info "Please start the service first"
    exit 1
fi

npx pm2 logs "$namespace:$usage_service" --lines 1000
