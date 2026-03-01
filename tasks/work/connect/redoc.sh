#!/usr/bin/env bash

#MISE description="Open the Redoc page for a service"
#USAGE flag "--universe <universe>" default="dev" help="Jupiter universe"
#USAGE flag "--environment <environment>" default="local" help="Jupiter environment" {
#USAGE   choices "production" "staging" "local"
#USAGE }
#USAGE flag "--instance <instance>" default="dev" help="Jupiter instance"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--service <service>" default="webapi" help="The service whose Redoc page to open" {
#USAGE   choices "webapi" "api"
#USAGE }
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_universe:=}"
: "${usage_environment:=}"
: "${usage_instance:=}"
: "${usage_service:=}"

set -e -o pipefail

source tasks/_common.sh

log info "Opening Redoc page for service $usage_service (universe: $usage_universe, environment: $usage_environment, instance: $usage_instance)"

if [[ "$usage_universe" == "dev" ]]; then
    if ! check_service_is_running pm2 "$usage_instance" "$usage_service"; then
        log error "Service $usage_service is not running for instance: $usage_instance"
        log error "Please start the service first with: mise run:srv"
        exit 1
    fi
fi

service_url=$(get_service_url_for_universe "$usage_universe" "$usage_environment" "$usage_instance" "$usage_service")

open "${service_url}/redoc"
