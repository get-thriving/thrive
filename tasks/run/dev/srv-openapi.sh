#!/usr/bin/env bash

#MISE description="Open the OpenAPI specification page"
#USAGE flag "--universe <universe>" default="dev" help="Jupiter universe"
#USAGE flag "--environment <environment>" default="local" help="Jupiter environment" {
#USAGE   choices "production" "staging" "local"
#USAGE }
#USAGE flag "--instance <instance>" help="Jupiter instance"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--service <service>" default="webapi" help="Service to open" {
#USAGE   choices "webapi" "api"
#USAGE }
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_instance:=}"
: "${usage_environment:=}"
: "${usage_universe:=}"
: "${usage_service:=}"

set -e -o pipefail

source tasks/_common.sh

instance="${usage_instance}"
universe="${usage_universe}"
environment="${usage_environment}"
service="${usage_service}"

if [[ -z "$instance" ]]; then
    instance=$STANDARD_INSTANCE
fi

log info "Opening OpenAPI specification page (universe: $universe, environment: $environment, instance: $instance, service: $service)"

if [[ "$universe" == "dev" ]]; then
    if ! check_service_is_running pm2 "$instance" "$service"; then
        log info "$service service is not running for instance: $instance"
        log info "Please start the service first"
        exit 1
    fi
fi

if [[ "$service" == "webapi" ]]; then
    service_url=$(get_webapi_url_for_universe "$universe" "$environment" "$instance")
else
    service_url=$(get_api_url_for_universe "$universe" "$environment" "$instance")
fi

open "${service_url}/openapi.json"
