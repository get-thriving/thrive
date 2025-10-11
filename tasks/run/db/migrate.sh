#!/usr/bin/env bash

#MISE description="Run database migrations on Jupiter database"
#USAGE flag "--namespace <namespace>" help="Jupiter namespace (defaults to standard namespace)"
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

log info "Running database migrations for namespace: $namespace"

# Get free ports for the migration run
webapi_port=$(get_free_port)
webui_port=$(get_free_port)

log info "Starting Jupiter for migrations with webapi port: $webapi_port and webui port: $webui_port"

# Check if webapi service is already running for this namespace
if check_service_is_running pm2 "$namespace" webapi; then
    log info "WebAPI service is already running for namespace: $namespace"
    log info "Please stop the service first before running migrations"
    exit 1
fi


# Run Jupiter with migrations - it will automatically run migrations on startup
run_jupiter_webapi "$namespace" "$webapi_port" "$webui_port" wait:webapi no-monit ci pm2

get_logs pm2 "$namespace" webapi

log info "Migrations completed successfully!"
log info "Stopping Jupiter..."

stop_jupiter_webapi "$namespace"

log info "Database migrations finished for namespace: $namespace"
