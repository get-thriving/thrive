#!/usr/bin/env bash

#MISE description="Open the OpenAPI specification page"
#USAGE flag "--namespace <namespace>" help="Jupiter namespace"
#USAGE complete "namespace" run="./tasks/run/namespace/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_namespace:=}"

set -e -o pipefail

source tasks/_common.sh

namespace="${usage_namespace}"

if [[ -z "$namespace" ]]; then
    namespace=$STANDARD_NAMESPACE
fi

log info "Opening OpenAPI specification page for namespace $namespace"

# Check if webapi service is already running for this namespace
if ! check_service_is_running pm2 "$namespace" webapi; then
    log info "WebAPI service is not running for namespace: $namespace"
    log info "Please start the service first"
    exit 1
fi

webapi_port=$(get_jupiter_port "$namespace" "webapi")
webapi_url="http://localhost:${webapi_port}"

open "${webapi_url}/openapi.json"
